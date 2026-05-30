/**
 * Context for Authentication
 * Provides auth state and methods throughout the app
 * Integrates Firebase Authentication with proper error handling and loading states
 */

import React, { createContext, useState, useEffect, useCallback } from 'react'
import { subscribeToAuth, login as firebaseLogin, logout as firebaseLogout, signUp as firebaseSignUp } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser)
      setLoading(false)
      // Clear error when user state changes
      if (currentUser) {
        setError(null)
      }
    })

    return unsubscribe
  }, [])

  /**
   * Login user with email and password
   */
  const login = useCallback(async (email, password) => {
    setIsAuthenticating(true)
    setError(null)
    try {
      const userData = await firebaseLogin(email, password)
      setUser(userData)
      return userData
    } catch (err) {
      const errorMsg = err.message || 'Failed to login'
      setError(errorMsg)
      throw err
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  /**
   * Sign up new user
   */
  const signUp = useCallback(async (email, password, displayName = '') => {
    setIsAuthenticating(true)
    setError(null)
    try {
      const userData = await firebaseSignUp(email, password, displayName)
      setUser(userData)
      return userData
    } catch (err) {
      const errorMsg = err.message || 'Failed to sign up'
      setError(errorMsg)
      throw err
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  /**
   * Logout current user
   */
  const logout = useCallback(async () => {
    setIsAuthenticating(true)
    setError(null)
    try {
      await firebaseLogout()
      setUser(null)
    } catch (err) {
      const errorMsg = err.message || 'Failed to logout'
      setError(errorMsg)
      throw err
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    user,
    loading,
    error,
    isAuthenticating,
    isAuthenticated: !!user,
    login,
    logout,
    signUp,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to use AuthContext
 * Usage: const { user, login, logout, isAuthenticated } = useAuth()
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Context for Theme
 * Provides theme state throughout the app
 */
export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  const value = {
    isDark,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to use ThemeContext
 */
export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

/**
 * Context for App State
 * Provides global app state
 */
export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [links, setLinks] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'info', duration = 3000) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), duration)
  }

  const value = {
    links,
    setLinks,
    collections,
    setCollections,
    loading,
    setLoading,
    notification,
    showNotification
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

/**
 * Hook to use AppContext
 */
export const useApp = () => {
  const context = React.useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
