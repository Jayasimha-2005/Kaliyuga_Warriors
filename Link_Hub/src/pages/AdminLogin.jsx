import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSpinner, FaExclamationCircle, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../hooks/useCustomHooks'
import TextType from '../components/TextType'
import './AdminLogin.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
        <div className="login-header">
          <img src="/assets/KaliYuga_Warriors-logo.png" alt="Kaliyuga Warriors Logo" className="login-logo" />
          <h1 className="login-title">
            <TextType
              text="Warrior Login"
              typingSpeed={75}
              loop={false}
              showCursor={true}
              cursorCharacter="_"
            />
          </h1>
          <p className="login-subtitle">Secure access to Kaliyuga Warriors administration</p>
        </div>

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
              <input
                type="email"
                id="email"
                placeholder="admin@warrior.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAuthenticating}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isAuthenticating}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
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

      </div>
    </div>
  )
}

export default AdminLogin
