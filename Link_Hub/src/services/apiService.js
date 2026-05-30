/**
 * API Service
 * Placeholder for future REST API calls
 * Can be used for backend API integration
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Generic fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Get request
export const apiGet = (endpoint) => {
  return fetchAPI(endpoint, { method: 'GET' })
}

// Post request
export const apiPost = (endpoint, data) => {
  return fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// Put request
export const apiPut = (endpoint, data) => {
  return fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// Delete request
export const apiDelete = (endpoint) => {
  return fetchAPI(endpoint, { method: 'DELETE' })
}
