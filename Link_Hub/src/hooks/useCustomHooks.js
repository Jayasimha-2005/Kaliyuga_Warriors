/**
 * Custom React Hooks
 * Reusable hooks for common functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth as useAuthContext } from '../context/AppContext'

/**
 * useAuth Hook
 * Access authentication state and methods
 * Usage: const { user, login, logout, isAuthenticated } = useAuth()
 */
export const useAuth = useAuthContext

/**
 * useLocalStorage Hook
 * Manage localStorage with React state
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

/**
 * useFetch Hook
 * Handle API calls with loading and error states
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url, options)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const json = await response.json()
        if (isMounted) {
          setData(json)
          setError(null)
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message)
          setData(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (url) {
      fetchData()
    }

    return () => {
      isMounted = false
    }
  }, [url, options])

  return { data, loading, error }
}

/**
 * useDebounce Hook
 * Debounce a value with a delay
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * useAsync Hook
 * Handle async operations with loading and error states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)
    
    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error)
      setStatus('error')
      throw error
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, data, error }
}

/**
 * useMediaQuery Hook
 * Detect screen size changes
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    const handleChange = (e) => setMatches(e.matches)
    
    // Set initial value
    setMatches(mediaQuery.matches)
    
    // Add listener
    mediaQuery.addEventListener('change', handleChange)
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

/**
 * useClickOutside Hook
 * Detect clicks outside of an element
 */
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

/**
 * usePrevious Hook
 * Get previous value of a prop or state
 */
export const usePrevious = (value) => {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * useToggle Hook
 * Toggle a boolean state
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle, setValue]
}

/**
 * useCounter Hook
 * Manage a counter state
 */
export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => setCount(c => c + 1), [])
  const decrement = useCallback(() => setCount(c => c - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])

  return { count, increment, decrement, reset, setCount }
}

/**
 * useTimeout Hook
 * Execute a callback after a delay
 */
export const useTimeout = (callback, delay) => {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => savedCallback.current(), delay)
      return () => clearTimeout(id)
    }
  }, [delay])
}

/**
 * useInterval Hook
 * Execute a callback at regular intervals
 */
export const useInterval = (callback, delay) => {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

/**
 * useFormState Hook
 * Manage form state with convenient handlers
 */
export const useFormState = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }, [])

  const handleSetValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setError(null)
  }, [initialValues])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    values,
    setValues,
    handleChange,
    handleSetValue,
    loading,
    setLoading,
    error,
    setError,
    resetForm,
    clearError
  }
}

/**
 * useLinks Hook
 * Manage links with real-time updates from Firestore
 */
export const useLinks = () => {
  // Use dynamic imports to avoid circular dependencies
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialized, setInitialized] = useState(false)

  // Initialize hook
  useEffect(() => {
    const initHook = async () => {
      try {
        const { useAuth } = require('../context/AppContext')
        const linkService = require('../services/linkService')
        
        const authContext = useAuth()
        if (authContext?.user?.uid) {
          setLoading(true)
          const unsubscribe = linkService.subscribeToLinks(authContext.user.uid, (updatedLinks) => {
            setLinks(updatedLinks)
            setLoading(false)
            setError(null)
          })
          
          setInitialized(true)
          return () => unsubscribe()
        }
      } catch (err) {
        console.error('Failed to initialize useLinks:', err)
        setError('Failed to initialize links')
        setLoading(false)
      }
    }

    initHook()
  }, [])

  /**
   * Add a new link
   */
  const addLink = useCallback(async (linkData) => {
    try {
      const { useAuth } = require('../context/AppContext')
      const linkService = require('../services/linkService')
      const { user } = useAuth()
      
      if (!user?.uid) {
        throw new Error('User not authenticated')
      }

      setError(null)
      const linkId = await linkService.addLink(user.uid, linkData)
      return linkId
    } catch (err) {
      const errorMsg = err.message || 'Failed to add link'
      setError(errorMsg)
      throw err
    }
  }, [])

  /**
   * Update an existing link
   */
  const updateLink = useCallback(async (linkId, updates) => {
    try {
      const linkService = require('../services/linkService')
      setError(null)
      await linkService.updateLink(linkId, updates)
    } catch (err) {
      const errorMsg = err.message || 'Failed to update link'
      setError(errorMsg)
      throw err
    }
  }, [])

  /**
   * Delete a link
   */
  const deleteLink = useCallback(async (linkId) => {
    try {
      const linkService = require('../services/linkService')
      setError(null)
      await linkService.deleteLink(linkId)
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete link'
      setError(errorMsg)
      throw err
    }
  }, [])

  /**
   * Get a single link by ID
   */
  const getLink = useCallback(async (linkId) => {
    try {
      const linkService = require('../services/linkService')
      setError(null)
      const link = await linkService.getLink(linkId)
      return link
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch link'
      setError(errorMsg)
      throw err
    }
  }, [])

  /**
   * Get links by category
   */
  const getLinksByCategory = useCallback(async (category) => {
    try {
      const { useAuth } = require('../context/AppContext')
      const linkService = require('../services/linkService')
      const { user } = useAuth()
      
      if (!user?.uid) {
        throw new Error('User not authenticated')
      }

      setError(null)
      const categoryLinks = await linkService.getLinksByCategory(user.uid, category)
      return categoryLinks
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch links'
      setError(errorMsg)
      throw err
    }
  }, [])

  /**
   * Get published links
   */
  const getPublishedLinks = useCallback(async () => {
    try {
      const { useAuth } = require('../context/AppContext')
      const linkService = require('../services/linkService')
      const { user } = useAuth()
      
      if (!user?.uid) {
        throw new Error('User not authenticated')
      }

      setError(null)
      const publishedLinks = await linkService.getPublishedLinks(user.uid)
      return publishedLinks
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch published links'
      setError(errorMsg)
      throw err
    }
  }, [])

  /**
   * Batch delete links
   */
  const deleteMultipleLinks = useCallback(async (linkIds) => {
    try {
      const linkService = require('../services/linkService')
      setError(null)
      await linkService.deleteLinks(linkIds)
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete links'
      setError(errorMsg)
      throw err
    }
  }, [])

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    links,
    loading,
    error,
    initialized,
    addLink,
    updateLink,
    deleteLink,
    getLink,
    getLinksByCategory,
    getPublishedLinks,
    deleteMultipleLinks,
    clearError
  }
}
