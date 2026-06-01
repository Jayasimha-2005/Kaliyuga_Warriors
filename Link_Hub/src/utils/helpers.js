/**
 * Utility functions for Link Hub
 */

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return ''
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleDateString('en-US', options)
}

// Validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Truncate text
export const truncateText = (text, length = 50) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Format number with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

// Get time ago string
export const getTimeAgo = (date) => {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now - then) / 1000)
  
  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) return `${interval} years ago`
  
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) return `${interval} months ago`
  
  interval = Math.floor(seconds / 86400)
  if (interval > 1) return `${interval} days ago`
  
  interval = Math.floor(seconds / 3600)
  if (interval > 1) return `${interval} hours ago`
  
  interval = Math.floor(seconds / 60)
  if (interval > 1) return `${interval} minutes ago`
  
  return `${Math.floor(seconds)} seconds ago`
}

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Check if URL is valid
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

// Check if URL is a valid Instagram Reel link
export const isValidInstagramReelUrl = (url) => {
  if (!url) return false

  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, '')
    const pathname = parsedUrl.pathname.toLowerCase()

    return (
      hostname === 'instagram.com' || hostname.endsWith('.instagram.com') || hostname === 'instagr.am'
    ) && (pathname.includes('/reel/') || pathname.includes('/reels/'))
  } catch (error) {
    return false
  }
}

// Get domain from URL
export const getDomainFromUrl = (url) => {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch (error) {
    return url
  }
}
