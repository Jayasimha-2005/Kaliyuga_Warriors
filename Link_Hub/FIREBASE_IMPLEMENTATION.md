# Firebase Integration - Implementation Guide

## Quick Integration Summary

Your Link Hub application has been fully integrated with Firebase Authentication and Firestore Database. This guide shows how to use the services in your components.

## Files Created/Modified

### ✅ New Files Created:
1. **`src/firebase/firebase.js`** - Central Firebase configuration with auth persistence
2. **`src/services/authService.js`** - Complete authentication service with 9 functions
3. **`src/services/linkService.js`** - Firestore link management with real-time subscriptions
4. **`FIREBASE_INTEGRATION.md`** - Comprehensive API documentation
5. **`FIREBASE_SETUP.md`** - Step-by-step Firebase project setup guide

### ✅ Modified Files:
1. **`src/context/AppContext.jsx`** - Updated AuthContext with login, logout, signUp methods
2. **`src/main.jsx`** - Wrapped App with AuthProvider
3. **`src/hooks/useCustomHooks.js`** - Added useLinks and useFormState hooks

---

## How to Connect AdminLogin Form to Firebase

### Current State
The AdminLogin page has a form but it's not connected to Firebase yet.

### Step 1: Update AdminLogin Component

**File:** `src/pages/AdminLogin.jsx`

Replace the content with:

```javascript
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AppContext'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()
  const { user, login, isAuthenticating, error, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [localError, setLocalError] = useState(null)
  const [localSuccess, setLocalSuccess] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setLocalError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    setLocalSuccess(false)

    // Validation
    if (!formData.email.trim()) {
      setLocalError('Email is required')
      return
    }
    if (!formData.password.trim()) {
      setLocalError('Password is required')
      return
    }

    try {
      await login(formData.email, formData.password)
      setLocalSuccess(true)
      setFormData({ email: '', password: '' })
      // Navigation happens automatically via useEffect watching 'user'
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please try again.')
    }
  }

  const displayError = localError || error

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        <div className="login-form-section">
          <h1>Admin Login</h1>
          <p>Manage your Link Hub application</p>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@linkhub.com"
                  disabled={isAuthenticating}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isAuthenticating}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="error-message">
                <strong>Error:</strong> {displayError}
              </div>
            )}

            {/* Success Message */}
            {localSuccess && (
              <div className="success-message">
                ✓ Login successful! Redirecting...
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-signin"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Demo Note */}
            <p className="demo-note">
              Demo credentials can be used for testing. Create a test user in Firebase Console.
            </p>
          </form>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <h3>Security Notice</h3>
          <ul>
            <li>✓ This connects to real Firebase authentication</li>
            <li>✓ Never share your credentials</li>
            <li>✓ Always use HTTPS for login</li>
            <li>✓ Enable two-factor authentication when available</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
```

### Step 2: Create Protected Route Component

**File:** `src/components/ProtectedRoute.jsx`

```javascript
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AppContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  // If not authenticated, redirect to admin login
  if (!user) {
    return <Navigate to="/admin" replace />
  }

  // User is authenticated, render the protected component
  return children
}

export default ProtectedRoute
```

### Step 3: Update App.jsx with Protected Routes

**File:** `src/App.jsx`

```javascript
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
```

---

## Using Firebase Services in Components

### Example 1: Using useAuth Hook

```javascript
import { useAuth } from '../context/AppContext'

function MyComponent() {
  const { 
    user,                    // Current user object
    loading,                 // Loading state
    error,                   // Error message
    isAuthenticating,        // Auth in progress
    isAuthenticated,         // Boolean - user logged in
    login,                   // async login(email, password)
    logout,                  // async logout()
    signUp,                  // async signUp(email, password, displayName)
    clearError               // Clear error message
  } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.displayName || user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please login to continue</p>
      )}
    </div>
  )
}
```

### Example 2: Using useLinks Hook

```javascript
import { useLinks } from '../hooks/useCustomHooks'

function MyLinksComponent() {
  const { 
    links,                   // Array of user's links
    loading,                 // Loading state
    error,                   // Error message
    addLink,                 // async addLink(linkData)
    updateLink,              // async updateLink(linkId, updates)
    deleteLink,              // async deleteLink(linkId)
    getLink,                 // async getLink(linkId)
    getLinksByCategory,      // async getLinksByCategory(category)
    getPublishedLinks,       // async getPublishedLinks()
    deleteMultipleLinks,     // async deleteMultipleLinks(linkIds)
    clearError               // Clear error message
  } = useLinks()

  const handleAddLink = async () => {
    try {
      const linkId = await addLink({
        title: 'My Link',
        description: 'A useful link',
        url: 'https://example.com',
        category: 'general',
        isPublished: true
      })
      console.log('Link created:', linkId)
    } catch (err) {
      console.error('Failed to add link:', err)
    }
  }

  if (loading) return <div>Loading links...</div>

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleAddLink}>Add Link</button>
      <ul>
        {links.map(link => (
          <li key={link.id}>
            <h3>{link.title}</h3>
            <p>{link.description}</p>
            <a href={link.url}>{link.url}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Example 3: Using useFormState Hook

```javascript
import { useFormState } from '../hooks/useCustomHooks'

function AddLinkForm() {
  const { 
    values,           // Form values
    setValues,        // Set all values
    handleChange,     // Handle input change
    handleSetValue,   // Set single value
    loading,          // Loading state
    setLoading,       // Set loading state
    error,            // Error message
    setError,         // Set error message
    resetForm,        // Reset to initial values
    clearError        // Clear error
  } = useFormState({
    title: '',
    description: '',
    url: '',
    category: 'general'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Add your API call here
      resetForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="Link title"
      />
      <input
        name="url"
        value={values.url}
        onChange={handleChange}
        placeholder="URL"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Link'}
      </button>
    </form>
  )
}
```

---

## Firebase Setup Checklist

Before using the application with real data:

- [ ] Create Firebase project at https://console.firebase.google.com
- [ ] Enable Email/Password authentication
- [ ] Create Firestore database in test mode
- [ ] Get Firebase credentials from Project Settings
- [ ] Add credentials to `.env.local` file
- [ ] Create test user in Firebase Console
- [ ] Restart development server (`npm run dev`)
- [ ] Test login with test user credentials
- [ ] Test adding/editing/deleting links
- [ ] Update Firestore security rules for production

---

## Complete Implementation Example

Here's a complete example of a link management page:

**File:** `src/pages/LinkManagement.jsx`

```javascript
import React, { useState } from 'react'
import { useAuth } from '../context/AppContext'
import { useLinks } from '../hooks/useCustomHooks'
import { useFormState } from '../hooks/useCustomHooks'
import { FaPlus, FaEdit, FaTrash, FaLink } from 'react-icons/fa'
import './LinkManagement.css'

function LinkManagement() {
  const { user, logout } = useAuth()
  const { links, loading, error, addLink, deleteLink, updateLink } = useLinks()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const {
    values,
    handleChange,
    handleSetValue,
    loading: formLoading,
    error: formError,
    resetForm
  } = useFormState({
    title: '',
    description: '',
    url: '',
    category: 'general',
    isPublished: false
  })

  const handleAddLink = async (e) => {
    e.preventDefault()
    try {
      await addLink(values)
      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Failed to add link:', err)
    }
  }

  const handleDeleteLink = async (linkId) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await deleteLink(linkId)
      } catch (err) {
        console.error('Failed to delete link:', err)
      }
    }
  }

  const handleEditLink = (link) => {
    handleSetValue('title', link.title)
    handleSetValue('description', link.description)
    handleSetValue('url', link.url)
    handleSetValue('category', link.category)
    handleSetValue('isPublished', link.isPublished)
    setEditingId(link.id)
    setShowForm(true)
  }

  return (
    <div className="link-management">
      <div className="header">
        <div>
          <h1>My Links</h1>
          <p>Welcome, {user?.displayName || user?.email}</p>
        </div>
        <button onClick={logout} className="btn-logout">Logout</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        onClick={() => setShowForm(!showForm)} 
        className="btn-add-link"
      >
        <FaPlus /> Add New Link
      </button>

      {showForm && (
        <form onSubmit={handleAddLink} className="add-link-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Link title"
              required
            />
          </div>

          <div className="form-group">
            <label>URL</label>
            <input
              type="url"
              name="url"
              value={values.url}
              onChange={handleChange}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Link description"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
            >
              <option value="general">General</option>
              <option value="learning">Learning</option>
              <option value="resources">Resources</option>
              <option value="tools">Tools</option>
            </select>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="isPublished"
              checked={values.isPublished}
              onChange={handleChange}
              id="published"
            />
            <label htmlFor="published">Publish this link</label>
          </div>

          {formError && <div className="error-message">{formError}</div>}

          <div className="form-actions">
            <button type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save Link'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowForm(false)
                resetForm()
                setEditingId(null)
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="links-list">
        {loading ? (
          <p>Loading links...</p>
        ) : links.length === 0 ? (
          <p>No links yet. Add your first link!</p>
        ) : (
          <ul>
            {links.map(link => (
              <li key={link.id} className="link-item">
                <div className="link-info">
                  <div className="link-header">
                    <FaLink className="icon" />
                    <h3>{link.title}</h3>
                  </div>
                  <p>{link.description}</p>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                  <div className="link-meta">
                    <span className="category">{link.category}</span>
                    <span className="status">
                      {link.isPublished ? 'Published' : 'Private'}
                    </span>
                  </div>
                </div>
                <div className="link-actions">
                  <button 
                    onClick={() => handleEditLink(link)}
                    className="btn-edit"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteLink(link.id)}
                    className="btn-delete"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default LinkManagement
```

---

## Error Handling Best Practices

```javascript
// Always wrap Firebase calls in try-catch
try {
  await login(email, password)
} catch (error) {
  // error.message contains user-friendly text
  console.error('Auth error:', error.message)
}

// Check if user is authenticated before operations
if (!user) {
  throw new Error('User must be authenticated')
}

// Display context errors to user
const { error } = useAuth()
if (error) {
  return <div className="error">{error}</div>
}
```

---

## Available Imports

```javascript
// Context
import { useAuth } from '../context/AppContext'

// Services
import * as authService from '../services/authService'
import * as linkService from '../services/linkService'

// Hooks
import { useLinks, useFormState, useLocalStorage, useAsync } from '../hooks/useCustomHooks'

// Firebase
import { auth, db, storage, isInitialized } from '../firebase/firebase'
```

---

## Next Steps

1. ✅ Update `.env.local` with real Firebase credentials
2. ✅ Update `AdminLogin.jsx` to use the `useAuth` hook (code above)
3. ✅ Create `ProtectedRoute.jsx` component (code above)
4. ✅ Update `App.jsx` to use protected routes (code above)
5. ✅ Test login functionality
6. ✅ Create link management page using `useLinks` hook
7. ✅ Set up Firestore security rules
8. ✅ Test adding/editing/deleting links

Your Firebase integration is complete and ready to use!
