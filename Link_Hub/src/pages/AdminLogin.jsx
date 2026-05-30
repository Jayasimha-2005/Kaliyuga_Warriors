import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaSpinner, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'
import { useAuth } from '../hooks/useCustomHooks'
import './AdminLogin.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const { login, isAuthenticating, error: authError, user, clearError } = useAuth()

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard')
    }
  }, [user, navigate])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSuccessMessage('')

    // Validation
    if (!email.trim()) {
      setLocalError('Please enter your email address')
      return
    }

    if (!password) {
      setLocalError('Please enter your password')
      return
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    try {
      // Attempt login
      await login(email, password)
      setSuccessMessage('✅ Login successful! Redirecting...')
    } catch (err) {
      // Error handling is done in useAuth hook
      console.error('Login failed:', err)
    }
  }

  // Display error message
  const displayError = localError || authError

  return (
    <div className="login-container fade-in">
      <div className="login-box glass">
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Secure access to Link Hub administration</p>

        {/* Error Message */}
        {displayError && (
          <div className="alert alert-error">
            <FaExclamationCircle className="alert-icon" />
            <span>{displayError}</span>
            <button 
              type="button" 
              className="alert-close"
              onClick={() => {
                setLocalError('')
                clearError()
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success">
            <FaCheckCircle className="alert-icon" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAuthenticating}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isAuthenticating}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <>
                <FaSpinner className="spinner-icon" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Use your Firebase credentials to access the admin panel</p>
        </div>
      </div>

      <div className="security-info glass">
        <h3>🔒 Security Features</h3>
        <ul>
          <li>Firebase Authentication with email/password</li>
          <li>Secure password encryption</li>
          <li>Automatic session persistence</li>
          <li>Protected admin routes</li>
          <li>Real-time error handling</li>
        </ul>
      </div>
    </div>
  )
}

export default AdminLogin
