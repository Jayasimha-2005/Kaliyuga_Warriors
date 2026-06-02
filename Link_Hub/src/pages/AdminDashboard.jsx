import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaLink, FaSignOutAlt, FaHome, FaSpinner, FaEllipsisV, FaTimes, FaDownload } from 'react-icons/fa'
import { useAuth } from '../hooks/useCustomHooks'
import { subscribeToLinks, migrateLinksToUser, addLink } from '../services/linkService'
import AddLinkForm from '../components/AddLinkForm'
import EditLinkModal from '../components/EditLinkModal'
import LinksTable from '../components/LinksTable'
import ToastContainer from '../components/ToastContainer'
import { showToast } from '../components/Toast'
import './AdminDashboard.css'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('add')
  const [links, setLinks] = useState([])
  const [linksLoading, setLinksLoading] = useState(true)
  const [editingLink, setEditingLink] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Subscribe to real-time links updates
  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToLinks(user.uid, (updatedLinks) => {
      setLinks(updatedLinks)
      setLinksLoading(false)
    })

    return unsubscribe
  }, [user])

  // Migrate existing links to current user on login
  useEffect(() => {
    if (!user) return

    const runMigration = async () => {
      try {
        await migrateLinksToUser(user.uid)
      } catch (error) {
        console.error('Failed to migrate links to current user:', error)
      }
    }

    runMigration()
  }, [user])

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      showToast('👋 Logged out successfully', 'success')
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      showToast('Failed to logout', 'error')
    }
  }

  // Handle edit
  const handleEdit = (link) => {
    setEditingLink(link)
    setShowEditModal(true)
  }

  const [importing, setImporting] = useState(false)

  // Export full database to CSV
  const handleExportCSV = () => {
    if (links.length === 0) {
      showToast('⚠️ No links available to export', 'error')
      return
    }

    // Helper to convert YYYY-MM-DD to a single-quoted string (e.g. '02-Jun-2026)
    // This forces Microsoft Excel to treat it as plain text, preventing the ######## date formatting issue.
    const formatDateString = (dateStr) => {
      if (!dateStr) return ''
      try {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const [year, month, day] = dateStr.split('-')
          const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ]
          const monthName = monthNames[parseInt(month, 10) - 1]
          return `'${parseInt(day, 10)}-${monthName}-${year}`
        }
        if (/^\d{4}-\d{2}$/.test(dateStr)) {
          const [year, month] = dateStr.split('-')
          const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ]
          const monthName = monthNames[parseInt(month, 10) - 1]
          return `'${monthName}-${year}`
        }
        return `'${dateStr}`
      } catch (error) {
        return `'${dateStr}`
      }
    }

    const headers = [
      'Title',
      'Description',
      'Category',
      'Month',
      'URL',
      'Instagram Reel URL',
      'Status',
      'Featured',
      'Created At'
    ]

    const rows = links.map(link => [
      link.title || '',
      link.description || '',
      link.category || '',
      formatDateString(link.month),
      link.url || '',
      link.reelUrl || '',
      link.isPublished ? 'Published' : 'Draft',
      link.featured ? 'Yes' : 'No',
      link.createdAt ? new Date(link.createdAt).toISOString() : ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(value => {
          const stringValue = String(value);
          const escaped = stringValue.replace(/"/g, '""');
          if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"') || escaped.includes('\r')) {
            return `"${escaped}"`;
          }
          return escaped;
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')
    downloadLink.setAttribute('href', url)
    downloadLink.setAttribute('download', `kaliyuga_warriors_links_${new Date().toISOString().slice(0, 10)}.csv`)
    downloadLink.style.visibility = 'hidden'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    showToast('🚀 Data exported to CSV successfully!', 'success')
  }

  // Restore/Import database from CSV backup file
  const handleImportCSV = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setImporting(true)
    showToast('⏳ Reading backup file...', 'info')

    // Helper to parse human-readable "DD Month YYYY" back into YYYY-MM-DD for database consistency
    // Cleans single quotes prepended for Excel compatibility.
    const parseImportDate = (dateStr) => {
      if (!dateStr) return new Date().toISOString().substring(0, 10)
      try {
        // Strip leading single quote or Excel formula prefix
        const cleanStr = dateStr.replace(/^'|^="/, '').replace(/"$/, '').trim().replace(/\s+/g, ' ')
        
        if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
          return cleanStr
        }
        if (/^\d{4}-\d{2}$/.test(cleanStr)) {
          return `${cleanStr}-01`
        }

        // Try parsing "DD-Month-YYYY" (e.g. "2-Jun-2026" or "02-Jun-2026")
        const partsDash = cleanStr.split('-')
        if (partsDash.length === 3) {
          const day = partsDash[0].padStart(2, '0')
          const monthName = partsDash[1].toLowerCase()
          const year = partsDash[2]

          const monthNamesShort = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
          const monthIdx = monthNamesShort.findIndex(m => monthName.startsWith(m))
          if (monthIdx !== -1) {
            const monthStr = String(monthIdx + 1).padStart(2, '0')
            return `${year}-${monthStr}-${day}`
          }
        }

        // Try parsing space-separated "DD Month YYYY"
        const partsSpace = cleanStr.split(' ')
        if (partsSpace.length === 3) {
          const day = partsSpace[0].padStart(2, '0')
          const monthName = partsSpace[1].toLowerCase()
          const year = partsSpace[2]

          const monthNames = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
          ]
          const monthIdx = monthNames.findIndex(m => m.startsWith(monthName))
          if (monthIdx !== -1) {
            const monthStr = String(monthIdx + 1).padStart(2, '0')
            return `${year}-${monthStr}-${day}`
          }
        }

        const date = new Date(cleanStr)
        if (!isNaN(date.getTime())) {
          return date.toISOString().substring(0, 10)
        }
        return new Date().toISOString().substring(0, 10)
      } catch (e) {
        return new Date().toISOString().substring(0, 10)
      }
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target.result
        const lines = []
        let currentRow = []
        let insideQuote = false
        let currentField = ''

        // Custom RFC 4180 CSV parser supporting quotes and escaping
        for (let i = 0; i < text.length; i++) {
          const char = text[i]
          const nextChar = text[i + 1]

          if (char === '"') {
            if (insideQuote && nextChar === '"') {
              currentField += '"'
              i++
            } else {
              insideQuote = !insideQuote
            }
          } else if (char === ',' && !insideQuote) {
            currentRow.push(currentField.trim())
            currentField = ''
          } else if ((char === '\n' || char === '\r') && !insideQuote) {
            if (char === '\r' && nextChar === '\n') {
              i++
            }
            currentRow.push(currentField.trim())
            if (currentRow.length > 0 && currentRow.some(f => f !== '')) {
              lines.push(currentRow)
            }
            currentRow = []
            currentField = ''
          } else {
            currentField += char
          }
        }

        if (currentField || currentRow.length > 0) {
          currentRow.push(currentField.trim())
          lines.push(currentRow)
        }

        if (lines.length <= 1) {
          throw new Error('CSV file is empty or missing headers')
        }

        const headers = lines[0].map(h => h.toLowerCase().trim())
        const dataRows = lines.slice(1)

        const titleIdx = headers.indexOf('title')
        const descIdx = headers.indexOf('description')
        const catIdx = headers.indexOf('category')
        const monthIdx = headers.indexOf('month')
        const urlIdx = headers.indexOf('url')
        const reelIdx = headers.findIndex(h => h.includes('reel') || h.includes('instagram'))
        const statusIdx = headers.indexOf('status')
        const featuredIdx = headers.indexOf('featured')

        if (titleIdx === -1 || urlIdx === -1) {
          throw new Error('CSV must contain at least "Title" and "URL" columns')
        }

        let importCount = 0
        
        for (const row of dataRows) {
          if (row.length < 2 || !row[titleIdx]) continue

          const linkData = {
            title: row[titleIdx],
            description: descIdx !== -1 ? row[descIdx] : '',
            category: catIdx !== -1 ? row[catIdx] : 'general',
            month: monthIdx !== -1 ? parseImportDate(row[monthIdx]) : new Date().toISOString().substring(0, 10),
            url: row[urlIdx],
            reelUrl: reelIdx !== -1 ? row[reelIdx] : '',
            isPublished: statusIdx !== -1 ? row[statusIdx].toLowerCase() === 'published' : true,
            featured: featuredIdx !== -1 ? row[featuredIdx].toLowerCase() === 'yes' : false
          }

          await addLink(user.uid, linkData)
          importCount++
        }

        showToast(`✅ Successfully imported ${importCount} links!`, 'success')
      } catch (error) {
        console.error('Error importing CSV:', error)
        showToast(`❌ Import failed: ${error.message}`, 'error')
      } finally {
        setImporting(false)
        event.target.value = ''
      }
    }

    reader.readAsText(file)
  }

  return (
    <div className="admin-dashboard fade-in">
      <ToastContainer />

      {/* Mobile Header Bar */}
      <header className="mobile-header">
        <div className="mobile-brand">
          <img src="/assets/KaliYuga_Warriors-logo.png" alt="Kaliyugawarriors logo" className="brand-logo" />
          <span>Kaliyugawarriors</span>
        </div>
        <button
          className={`mobile-menu-toggle ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Sidebar Backdrop for Mobile */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar glass ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : 'expanded'}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <img src="/assets/KaliYuga_Warriors-logo.png" alt="Kaliyugawarriors logo" className="brand-logo" />
              <span>Kaliyugawarriors</span>
            </div>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>

            <button
              type="button"
              className="sidebar-collapse-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <FaEllipsisV /> : <FaTimes />}
            </button>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-group">
              <div className="nav-group-title">ADMIN MENU</div>

              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('overview')
                  setSidebarOpen(false)
                }}
              >
                <FaHome />
                <span>Overview</span>
              </button>

              <button
                className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('add')
                  setSidebarOpen(false)
                }}
              >
                <FaPlus />
                <span>Add Link</span>
              </button>

              <button
                className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('manage')
                  setSidebarOpen(false)
                }}
              >
                <FaLink />
                <span>Manage Links</span>
              </button>
            </div>

            <div className="nav-group">
              <div className="nav-group-title">ACCOUNT</div>

              <div className="user-info">
                <div className="user-avatar">
                  W
                </div>
                <div className="user-details">
                  <p className="user-name">Warrior</p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>

              <button
                className="nav-link logout"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h1>Welcome Warrior!</h1>
                <p>Skills are Weapons</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card glass">
                  <div className="stat-icon">
                    <FaLink />
                  </div>
                  <div className="stat-body">
                    <h3>{links.length}</h3>
                    <p>Total Links</p>
                  </div>
                </div>

                <div className="stat-card glass">
                  <div className="stat-icon">
                    <FaPlus />
                  </div>
                  <div className="stat-body">
                    <h3>{links.filter(l => !l.isPublished).length}</h3>
                    <p>Drafts</p>
                  </div>
                </div>

                <div className="stat-card glass">
                  <div className="stat-icon">
                    <FaLink />
                  </div>
                  <div className="stat-body">
                    <h3>{links.filter(l => l.isPublished).length}</h3>
                    <p>Published</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <button
                  className="action-btn primary"
                  onClick={() => setActiveTab('add')}
                >
                  <FaPlus /> Add New Link
                </button>
                <button
                  className="action-btn secondary"
                  onClick={() => setActiveTab('manage')}
                >
                  <FaLink /> Manage Links
                </button>
              </div>

              <div className="overview-backup-section glass">
                <div className="backup-header">
                  <h3>🛡️ Warrior's Vault & Backups</h3>
                  <p>Safeguard your weapons and skills. Secure your arsenal to a local CSV file, or forge your weapons back instantly from a previous vault file.</p>
                </div>
                <div className="backup-actions">
                  <button
                    type="button"
                    className="backup-btn export"
                    onClick={handleExportCSV}
                    disabled={linksLoading}
                    title="Secure all current links to a CSV file"
                  >
                    <FaDownload /> Secure Arsenal (CSV)
                  </button>

                  <label className={`backup-btn import ${importing ? 'disabled' : ''}`} title="Forge links back from a previous vault CSV file">
                    <FaPlus /> {importing ? 'Forging...' : 'Forge from Vault (CSV)'}
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportCSV}
                      disabled={importing}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Add Link Tab */}
          {activeTab === 'add' && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h1>Forge New Weapon</h1>
                <p>Craft and prepare a new high-impact skill resource</p>
              </div>
              <AddLinkForm
                onLinkAdded={() => {
                  setActiveTab('manage')
                }}
              />
            </div>
          )}

          {/* Manage Links Tab */}
          {activeTab === 'manage' && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h1>Warrior's Arsenal</h1>
                <p>Equip the battlefield with high-impact weapons and resource links</p>
              </div>
              <LinksTable
                links={links}
                loading={linksLoading}
                onEdit={handleEdit}
                onRefresh={() => { }} // Real-time subscription handles refresh
              />
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <EditLinkModal
          link={editingLink}
          onClose={() => {
            setShowEditModal(false)
            setEditingLink(null)
          }}
          onLinkUpdated={() => { }}
        />
      )}
    </div>
  )
}

export default AdminDashboard
