import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaExternalLinkAlt,
  FaFilter,
  FaInstagram,
  FaLayerGroup,
  FaSearch,
  FaTimes
} from 'react-icons/fa'
import TextType from '../components/TextType'
import { subscribeToPublicResources } from '../services/linkService'
import './Home.css'

const formatMonthLabel = (monthValue) => {
  if (!monthValue) return 'Uncategorized'

  const normalizedMonthValue = monthValue.slice(0, 7)
  const parsedDate = new Date(`${normalizedMonthValue}-01`)

  if (Number.isNaN(parsedDate.getTime())) {
    return normalizedMonthValue
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

const getMonthKey = (monthValue) => monthValue?.slice(0, 7) || 'unspecified'

const compareMonthsDesc = (left, right) => {
  if (left === right) return 0
  if (left === 'unspecified') return 1
  if (right === 'unspecified') return -1
  return right.localeCompare(left)
}

const ResourceCard = ({ resource, index }) => {
  const hasReel = Boolean(resource.reelUrl && resource.reelUrl.trim())

  return (
    <motion.article
      className={`resource-card ${hasReel ? 'has-reel' : 'no-reel'}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      layout
    >
      <div className="resource-card-main">
        <div className="resource-badges">
          {resource.featured && (
            <span className="resource-badge featured-badge">
              Featured
            </span>
          )}
          {resource.category && (
            <span className="resource-badge category-badge">{resource.category}</span>
          )}
          <span className="resource-badge date-badge">
            {formatMonthLabel(resource.month)}
          </span>
        </div>

        <div className="resource-details">
          <h3 className="resource-title">{resource.title || resource.url}</h3>
          {resource.description && <p className="resource-description">{resource.description}</p>}
        </div>
      </div>

      <aside className="resource-rail">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="resource-button"
        >
          Open Resource
          <FaExternalLinkAlt />
        </a>

        {hasReel && (
          <a
            href={resource.reelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reel-button reel-button-inline"
          >
            <FaInstagram />
            Watch Reel
          </a>
        )}
      </aside>
    </motion.article>
  )
}

const SkeletonCard = () => (
  <div className="resource-card skeleton-card" aria-hidden="true">
    <div className="resource-card-main">
      <div className="resource-badges">
        <span className="skeleton skeleton-pill" />
        <span className="skeleton skeleton-pill" />
        <span className="skeleton skeleton-pill" />
      </div>
      <div className="resource-details">
        <span className="skeleton skeleton-title" />
        <span className="skeleton skeleton-line" />
        <span className="skeleton skeleton-line short" />
      </div>
    </div>
    <div className="resource-rail skeleton-rail" aria-hidden="true">
      <span className="skeleton skeleton-line short" />
      <span className="skeleton skeleton-button" />
      <span className="skeleton skeleton-button reel-skeleton-button" />
    </div>
  </div>
)

function Home() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('')
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)

 useEffect(() => {
  const unsubscribe = subscribeToPublicResources((publicResources) => {
    const EXCLUDE_TITLES = ['java dsa course']
    const visibleResources = publicResources.filter((r) => {
      const title = (r.title || '').toString().trim().toLowerCase()
      return !EXCLUDE_TITLES.includes(title)
    })

    setResources(visibleResources)
    setLoading(false)
  })

  return () => {
    unsubscribe?.()
  }
}, [])

  const stats = useMemo(() => {
    const categories = new Set()
    const currentMonthKey = new Date().toISOString().slice(0, 7)

    resources.forEach((resource) => {
      if (resource.category) {
        categories.add(resource.category)
      }
    })

    return {
      totalResources: resources.length,
      totalCategories: categories.size,
      currentMonthResources: resources.filter((resource) => resource.month && resource.month.substring(0, 7) === currentMonthKey).length
    }
  }, [resources])

  const availableCategories = useMemo(
    () => [...new Set(resources.map((resource) => resource.category).filter(Boolean))].sort(),
    [resources]
  )

  const filteredResources = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return resources
      .filter((resource) => {
        const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter

        const matchesSearch =
          !normalizedSearch ||
          resource.title?.toLowerCase().includes(normalizedSearch) ||
          resource.description?.toLowerCase().includes(normalizedSearch)

        return matchesCategory && matchesSearch
      })
      .sort((left, right) => {
        const leftFeatured = Boolean(left.featured)
        const rightFeatured = Boolean(right.featured)

        if (leftFeatured !== rightFeatured) {
          return rightFeatured ? 1 : -1
        }

        return new Date(right.createdAt || 0) - new Date(left.createdAt || 0)
      })
  }, [resources, searchTerm, categoryFilter])

  const featuredResources = useMemo(
    () => filteredResources.filter((resource) => resource.featured),
    [filteredResources]
  )

  const groupedResources = useMemo(() => {
    const resourceMap = new Map()

    filteredResources
      .filter((resource) => !resource.featured)
      .forEach((resource) => {
        const monthKey = getMonthKey(resource.month)

        if (!resourceMap.has(monthKey)) {
          resourceMap.set(monthKey, [])
        }

        resourceMap.get(monthKey).push(resource)
      })

    return [...resourceMap.entries()].sort(([leftKey], [rightKey]) => compareMonthsDesc(leftKey, rightKey))
  }, [filteredResources])

  const filtersActive = Boolean(searchTerm.trim()) || categoryFilter !== 'all'

  const availableTabs = useMemo(() => {
    const tabs = [
      { id: 'all', label: 'All Months', count: filteredResources.length }
    ]
    if (featuredResources.length > 0) {
      tabs.push({ id: 'featured', label: 'Featured', count: featuredResources.length })
    }
    groupedResources.forEach(([monthKey, monthResources]) => {
      tabs.push({ id: monthKey, label: formatMonthLabel(monthKey), count: monthResources.length })
    })
    return tabs
  }, [filteredResources, featuredResources, groupedResources])

  useEffect(() => {
    if (availableTabs.length > 0) {
      const isValid = availableTabs.some(tab => tab.id === activeTab)
      if (!isValid) {
        setActiveTab(availableTabs[0].id)
      }
    } else {
      setActiveTab('')
    }
  }, [availableTabs, activeTab])

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
  }

  return (
    <div className="home-container fade-in">
      <motion.section
        className="hero-section"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-content">
          <span className="hero-kicker">Skills Are Weapons</span>
              <h1>
                <TextType
                  text="Welcome to Kaliyugawarriors"
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor
                  cursorCharacter="_"
                  loop={false}
                  cursorBlinkDuration={0.5}
                />
              </h1>
        </div>
      </motion.section>

      <motion.section
        className="stats-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
      >
        

       
      </motion.section>

      <section className="controls-section">
        <div className="controls-header">
          <div>
            <h2>Find resources</h2>
            <p>Search by title or description, then filter by category.</p>
          </div>

          <button type="button" className="clear-filters-button" onClick={clearFilters} disabled={!filtersActive}>
            <FaTimes />
            Clear filters
          </button>
        </div>

        <div className="controls-grid">
          <label className="search-field">
            <FaSearch className="control-icon" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title or description"
            />
          </label>

          <div className="filter-field-container">
            <span className="control-label">Category</span>
            <div className="custom-filter-dropdown">
              <button
                type="button"
                className={`filter-dropdown-trigger ${filterDropdownOpen ? 'active' : ''}`}
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              >
                <span>
                  {categoryFilter === 'all'
                    ? 'All categories'
                    : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                </span>
                <span className={`filter-dropdown-arrow ${filterDropdownOpen ? 'open' : ''}`}></span>
              </button>

              {filterDropdownOpen && (
                <>
                  <div className="filter-dropdown-backdrop" onClick={() => setFilterDropdownOpen(false)} />
                  <ul className="filter-dropdown-options">
                    <li
                      className={`filter-dropdown-option ${categoryFilter === 'all' ? 'selected' : ''}`}
                      onClick={() => {
                        setCategoryFilter('all')
                        setFilterDropdownOpen(false)
                      }}
                    >
                      All categories
                    </li>
                    {availableCategories.map((category) => (
                      <li
                        key={category}
                        className={`filter-dropdown-option ${categoryFilter === category ? 'selected' : ''}`}
                        onClick={() => {
                          setCategoryFilter(category)
                          setFilterDropdownOpen(false)
                        }}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <motion.section
          className="resources-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="section-header">
            <div>
              <h2>Loading resources</h2>
              <p>Fetching the latest items from Firestore.</p>
            </div>
          </div>
          <div className="resource-grid">
            {[0, 1, 2].map((item) => (
              <SkeletonCard key={item} />
            ))}
          </div>
        </motion.section>
      ) : filteredResources.length === 0 ? (
        <motion.section
          className="empty-state glass"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="empty-state-badge">No resources found</div>
          <h2>{filtersActive ? 'No matching resources' : 'No resources have been published yet'}</h2>
          <p>
            {filtersActive
              ? 'Try a different search term or clear the filters to explore everything available.'
              : 'When the admin publishes new resources, they will appear here automatically.'}
          </p>
        </motion.section>
      ) : (
        <div className="dashboard-split-layout">
          {/* Left Sidebar: Month & Featured Tabs */}
          <aside className="dashboard-tabs-sidebar glass">
            <div className="tabs-title">TIMELINE</div>
            <div className="tabs-list">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-badge">{tab.count}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Right Main Panel: Selected Month's Links */}
          <main className="dashboard-links-panel">
            <AnimatePresence mode="wait">
              {activeTab === 'all' && (
                <motion.div
                  key="all"
                  className="resource-group"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="section-header">
                    <div>
                      <h2>All Resources</h2>
                      <p>All resource links published across all months.</p>
                    </div>
                    <span className="section-count">{filteredResources.length} items</span>
                  </div>
                  <div className="resource-grid">
                    {filteredResources.map((resource, index) => (
                      <ResourceCard key={resource.id} resource={resource} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'featured' && (
                <motion.div
                  key="featured"
                  className="resource-group featured-group"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="section-header">
                    <div>
                      <h2>Featured Resources</h2>
                      <p>Admin highlighted resources for maximum impact.</p>
                    </div>
                    <span className="section-count">{featuredResources.length} items</span>
                  </div>
                  <div className="resource-grid">
                    {featuredResources.map((resource, index) => (
                      <ResourceCard key={resource.id} resource={resource} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}

              {availableTabs.filter(tab => tab.id !== 'featured').map((tab) => {
                if (activeTab !== tab.id) return null;
                const monthData = groupedResources.find(([monthKey]) => monthKey === tab.id);
                if (!monthData) return null;
                const [monthKey, monthResources] = monthData;

                return (
                  <motion.div
                    key={monthKey}
                    className="resource-group"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28 }}
                  >
                    <div className="section-header">
                      <div>
                        <h2>{tab.label}</h2>
                        <p>Resources published during {tab.label}.</p>
                      </div>
                      <span className="section-count">{monthResources.length} items</span>
                    </div>
                    <div className="resource-grid">
                      {monthResources.map((resource, index) => (
                        <ResourceCard key={resource.id} resource={resource} index={index} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  )
}

export default Home