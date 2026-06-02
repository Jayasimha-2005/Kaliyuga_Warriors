import React, { useState, useEffect } from 'react'
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSearch, FaSpinner, FaStar } from 'react-icons/fa'
import { deleteLink, updateLink } from '../services/linkService'
import { showToast } from './Toast'
import './LinksTable.css'

function LinksTable({ links, loading, onEdit, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortMonth, setSortMonth] = useState(() => new Date().toISOString().substring(0, 7))
  const [filteredLinks, setFilteredLinks] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [featuringId, setFeaturingId] = useState(null)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false)

  // Filter and sort links
  useEffect(() => {
    let result = links

    // Search filter
    if (searchTerm) {
      result = result.filter(link =>
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.url.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Month filter
    if (sortMonth) {
      result = result.filter(link => link.month && link.month.substring(0, 7) === sortMonth)
    }

    // Sort by creation date (newest first)
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return dateB - dateA
    })

    setFilteredLinks(result)
  }, [links, searchTerm, sortMonth])

  const openDeleteDialog = (link) => {
    setDeleteCandidate(link)
  }

  const closeDeleteDialog = () => {
    if (deletingId) return
    setDeleteCandidate(null)
  }

  // Handle delete after confirmation
  const confirmDelete = async () => {
    if (!deleteCandidate) return

    const linkId = deleteCandidate.id
    setDeletingId(linkId)

    try {
      await deleteLink(linkId)
      showToast('✅ Link deleted successfully!', 'success')
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      showToast(error.message || 'Failed to delete link', 'error')
    } finally {
      setDeletingId(null)
      setDeleteCandidate(null)
    }
  }

  // Handle publish toggle
  const handleTogglePublish = async (link) => {
    setTogglingId(link.id)

    try {
      await updateLink(link.id, {
        isPublished: !link.isPublished
      })
      showToast(
        link.isPublished ? '🔒 Link unpublished' : '🔓 Link published',
        'success'
      )
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
      showToast(error.message || 'Failed to update link', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  // Handle featured toggle
  const handleToggleFeatured = async (link) => {
    setFeaturingId(link.id)

    try {
      await updateLink(link.id, {
        featured: !link.featured
      })
      showToast(
        link.featured ? '⭐ Link removed from featured' : '⭐ Link marked as featured!',
        'success'
      )
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
      showToast(error.message || 'Failed to update link', 'error')
    } finally {
      setFeaturingId(null)
    }
  }

  // Get unique months for filter
  const months = [...new Set(links.map(link => link.month ? link.month.substring(0, 7) : ''))].filter(Boolean).sort().reverse()

  return (
    <div className="links-table-container glass">
      <div className="table-header">
        <h2>Manage Links</h2>
        <p>Total: {filteredLinks.length} links</p>
      </div>

      {/* Search & Filter */}
      <div className="table-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="custom-filter-dropdown">
          <button
            type="button"
            className={`filter-dropdown-trigger ${monthDropdownOpen ? 'active' : ''}`}
            onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
          >
            <span>
              {sortMonth
                ? new Date(sortMonth + '-01').toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })
                : 'All Months'}
            </span>
            <span className={`filter-dropdown-arrow ${monthDropdownOpen ? 'open' : ''}`}></span>
          </button>

          {monthDropdownOpen && (
            <>
              <div className="filter-dropdown-backdrop" onClick={() => setMonthDropdownOpen(false)} />
              <ul className="filter-dropdown-options">
                <li
                  className={`filter-dropdown-option ${sortMonth === '' ? 'selected' : ''}`}
                  onClick={() => {
                    setSortMonth('')
                    setMonthDropdownOpen(false)
                  }}
                >
                  All Months
                </li>
                {months.map(month => (
                  <li
                    key={month}
                    className={`filter-dropdown-option ${sortMonth === month ? 'selected' : ''}`}
                    onClick={() => {
                      setSortMonth(month)
                      setMonthDropdownOpen(false)
                    }}
                  >
                    {new Date(month + '-01').toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading links...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredLinks.length === 0 && (
        <div className="empty-state">
          <p>
            {searchTerm || sortMonth ? 'No links found matching your search.' : 'No links yet. Add one to get started!'}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && filteredLinks.length > 0 && (
        <div className="table-wrapper">
          <table className="links-table">
            <thead>
              <tr>
                <th className="title-cell">Title</th>
                <th className="description-cell">Description</th>
                <th className="category-cell">Category</th>
                <th className="month-cell">Month</th>
                <th className="status-cell">Status</th>
                <th className="actions-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map(link => (
                <tr key={link.id} className={link.isPublished ? 'published' : 'draft'}>
                  <td className="title-cell">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.title}>
                      {link.title}
                    </a>
                  </td>
                  <td className="description-cell">{link.description}</td>
                  <td className="category-cell">
                    <span className="category-badge">{link.category}</span>
                  </td>
                  <td className="month-cell">
                    {new Date((link.month ? link.month.substring(0, 7) : '') + '-01').toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${link.isPublished ? 'published' : 'draft'}`}>
                      {link.isPublished ? '✓ Published' : '○ Draft'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="actions-wrapper">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(link)}
                        title="Edit link"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn toggle-btn"
                        onClick={() => handleTogglePublish(link)}
                        disabled={togglingId === link.id}
                        title={link.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {togglingId === link.id ? (
                          <FaSpinner className="spinner" />
                        ) : (
                          link.isPublished ? <FaToggleOn /> : <FaToggleOff />
                        )}
                      </button>
                      <button
                        className={`action-btn feature-btn ${link.featured ? 'featured' : ''}`}
                        onClick={() => handleToggleFeatured(link)}
                        disabled={featuringId === link.id}
                        title={link.featured ? 'Remove featured' : 'Mark as featured'}
                      >
                        {featuringId === link.id ? (
                          <FaSpinner className="spinner" />
                        ) : (
                          <FaStar />
                        )}
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => openDeleteDialog(link)}
                        disabled={deletingId === link.id}
                        title="Delete link"
                      >
                        {deletingId === link.id ? (
                          <FaSpinner className="spinner" />
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="delete-modal-backdrop" onClick={closeDeleteDialog}>
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">!</div>
            <h3 id="delete-modal-title">Delete this link?</h3>
            <p>
              {`"${deleteCandidate.title}" will be permanently removed. This action cannot be undone.`}
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-btn secondary"
                onClick={closeDeleteDialog}
                disabled={deletingId === deleteCandidate.id}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-modal-btn danger"
                onClick={confirmDelete}
                disabled={deletingId === deleteCandidate.id}
              >
                {deletingId === deleteCandidate.id ? (
                  <>
                    <FaSpinner className="spinner" /> Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LinksTable
