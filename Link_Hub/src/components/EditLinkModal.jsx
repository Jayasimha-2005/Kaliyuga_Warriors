import React, { useState, useEffect } from 'react'
import { FaTimes, FaSpinner } from 'react-icons/fa'
import { updateLink } from '../services/linkService'
import { showToast } from './Toast'
import { isValidInstagramReelUrl } from '../utils/helpers'
import './EditLinkModal.css'

function EditLinkModal({ link, onClose, onLinkUpdated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    reelUrl: '',
    category: 'general',
    month: '',
    featured: false,
    isPublished: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const categories = ['general', 'tech', 'design', 'business', 'education', 'entertainment', 'other']
  const currentYear = new Date().getFullYear()
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i)
    return date.toISOString().substring(0, 7)
  })

  // Initialize form with link data
  useEffect(() => {
    if (link) {
      setFormData({
        title: link.title || '',
        description: link.description || '',
        url: link.url || '',
        reelUrl: link.reelUrl || '',
        category: link.category || 'general',
        month: link.month || new Date().toISOString().substring(0, 7),
        featured: Boolean(link.featured),
        isPublished: link.isPublished || false
      })
    }
  }, [link])

  // Validate URL format
  const isValidUrl = (urlString) => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const isValidOptionalReelUrl = (reelUrl) => {
    if (!reelUrl.trim()) return true
    return isValidInstagramReelUrl(reelUrl)
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL'
    }

    if (!isValidOptionalReelUrl(formData.reelUrl)) {
      newErrors.reelUrl = 'Please enter a valid Instagram Reel URL'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast('Please fix the errors below', 'error')
      return
    }

    setLoading(true)

    try {
      await updateLink(link.id, formData)
      showToast('✅ Link updated successfully!', 'success')
      if (onLinkUpdated) {
        onLinkUpdated()
      }
      onClose()
    } catch (error) {
      console.error('Error updating link:', error)
      showToast(error.message || 'Failed to update link', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!link) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Link</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter link title"
              disabled={loading}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* URL */}
          <div className="form-group">
            <label htmlFor="url">URL *</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              disabled={loading}
            />
            {errors.url && <span className="error-message">{errors.url}</span>}
          </div>

          {/* Instagram Reel URL */}
          <div className="form-group">
            <label htmlFor="reelUrl">Instagram Reel URL (optional)</label>
            <input
              type="url"
              id="reelUrl"
              name="reelUrl"
              value={formData.reelUrl}
              onChange={handleChange}
              placeholder="https://www.instagram.com/reel/..."
              disabled={loading}
            />
            {errors.reelUrl && <span className="error-message">{errors.reelUrl}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this link"
              rows="3"
              disabled={loading}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Category & Month */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="month">Month</label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                disabled={loading}
              >
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
          </div>

          {/* Publish Toggle */}
          <div className="form-group form-checkbox">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="isPublished">Publish this link</label>
          </div>

          <div className="form-group form-checkbox">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="featured">Mark as featured</label>
          </div>

          {/* Buttons */}
          <div className="modal-buttons">
            <button type="button" className="button secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="button primary" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Updating...
                </>
              ) : (
                'Update Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLinkModal
