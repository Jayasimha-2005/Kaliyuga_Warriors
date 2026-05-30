import React from 'react'
import { Navigate } from 'react-router-dom'
import { FaSpinner } from 'react-icons/fa'
import { useAuth } from '../hooks/useCustomHooks'
import './ProtectedRoute.css'

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication
 * - If user is authenticated: renders the component
 * - If user is not authenticated: redirects to /admin
 * - While loading: shows loading spinner
 */
function ProtectedRoute({ element }) {
  const { user, loading } = useAuth()

  // Show loading spinner while checking authentication state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner glass">
          <FaSpinner className="spinner-icon" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to admin login
  if (!user) {
    return <Navigate to="/admin" replace />
  }

  // If authenticated, render the protected component
  return element
}

export default ProtectedRoute
