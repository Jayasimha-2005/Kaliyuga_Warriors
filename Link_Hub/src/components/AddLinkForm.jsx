import React, { useState } from 'react'
import { FaPlus, FaSpinner } from 'react-icons/fa'
import { addLink } from '../services/linkService'
import { useAuth } from '../hooks/useCustomHooks'
import { showToast } from './Toast'
import { isValidInstagramReelUrl } from '../utils/helpers'
import './AddLinkForm.css'

function AddLinkForm({ onLinkAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    reelUrl: '',
    category: 'general',
    month: new Date().toISOString().substring(0, 7),
    featured: false,
    isPublished: true
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const categories = ['general', 'tech', 'design', 'business', 'education', 'entertainment', 'other']
  const currentYear = new Date().getFullYear()
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i)
    return date.toISOString().substring(0, 7)
  })

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
      newErrors.url = 'Please enter a valid URL (e.g., https://example.com)'
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
    // Clear error for this field
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
      await addLink(user.uid, formData)
      showToast('✅ Link added successfully!', 'success')

      // Reset form
      setFormData({
        title: '',
        description: '',
        url: '',
        reelUrl: '',
        category: 'general',
        month: new Date().toISOString().substring(0, 7),
        featured: false,
        isPublished: true
      })
      setErrors({})

      // Notify parent
      if (onLinkAdded) {
        onLinkAdded()
      }
    } catch (error) {
      console.error('Error adding link:', error)
      showToast(error.message || 'Failed to add link', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-link-form glass">
      <div className="form-header">
        <FaPlus className="form-header-icon" />
        <h2>Add New Link</h2>
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

        {/* Category */}
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

          {/* Month */}
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
          <label htmlFor="isPublished">Publish immediately</label>
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

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? (
            <>
              <FaSpinner className="spinner" />
              Adding...
            </>
          ) : (
            <>
              <FaPlus />
              Add Link
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default AddLinkForm
