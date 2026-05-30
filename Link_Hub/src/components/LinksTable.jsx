import React, { useState, useEffect } from 'react'
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSearch, FaSpinner } from 'react-icons/fa'
import { deleteLink, updateLink } from '../services/linkService'
import { showToast } from './Toast'
import './LinksTable.css'

function LinksTable({ links, loading, onEdit, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortMonth, setSortMonth] = useState('')
  const [filteredLinks, setFilteredLinks] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

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
      result = result.filter(link => link.month === sortMonth)
    }

    // Sort by creation date (newest first)
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return dateB - dateA
    })

    setFilteredLinks(result)
  }, [links, searchTerm, sortMonth])

  // Handle delete with confirmation
  const handleDelete = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
      return
    }

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

  // Get unique months for filter
  const months = [...new Set(links.map(link => link.month))].sort().reverse()

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

        <select
          className="month-filter"
          value={sortMonth}
          onChange={(e) => setSortMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {months.map(month => (
            <option key={month} value={month}>
              {new Date(month + '-01').toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </option>
          ))}
        </select>
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
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Month</th>
                <th>Status</th>
                <th>Actions</th>
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
                    {new Date(link.month + '-01').toLocaleDateString('en-US', {
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
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(link.id)}
                      disabled={deletingId === link.id}
                      title="Delete link"
                    >
                      {deletingId === link.id ? (
                        <FaSpinner className="spinner" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default LinksTable
