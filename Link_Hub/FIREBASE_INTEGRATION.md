# Firebase Integration Guide

## Overview

This document explains the complete Firebase integration in Link Hub, including Authentication and Firestore Database setup.

## Table of Contents

1. [Firebase Configuration](#firebase-configuration)
2. [Authentication Service](#authentication-service)
3. [Link Service (Firestore)](#link-service-firestore)
4. [Context & Hooks](#context--hooks)
5. [Usage Examples](#usage-examples)
6. [Environment Variables](#environment-variables)
7. [Firestore Collections](#firestore-collections)
8. [Error Handling](#error-handling)

---

## Firebase Configuration

### File: `src/firebase/firebase.js`

Central Firebase initialization file that handles:
- App initialization
- Authentication setup with persistence
- Firestore database setup
- Storage setup
- Configuration validation

**Key Features:**
```javascript
// Exports
export { app, auth, db, storage, isInitialized }
```

**Configuration Validation:**
- Checks if Firebase credentials are properly configured
- Shows warning if credentials are missing
- Enables auth persistence (browserLocalPersistence)

**Error Handling:**
- Graceful degradation if Firebase fails to initialize
- Console warnings for debugging
- Safe to use in development without credentials

---

## Authentication Service

### File: `src/services/authService.js`

Comprehensive authentication service with the following functions:

### Available Functions

#### 1. `signUp(email, password, displayName = '')`
Sign up a new user with email and password.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password
- `displayName` (string, optional): User's display name

**Returns:** User object with uid, email, displayName, photoURL, emailVerified

**Example:**
```javascript
try {
  const user = await signUp('user@example.com', 'password123', 'John Doe')
  console.log('User created:', user)
} catch (error) {
  console.error('Signup error:', error.message)
}
```

#### 2. `login(email, password)`
Login user with email and password.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password

**Returns:** User object

**Example:**
```javascript
try {
  const user = await login('user@example.com', 'password123')
  console.log('Logged in as:', user.email)
} catch (error) {
  console.error('Login error:', error.message)
}
```

#### 3. `logout()`
Logout the currently authenticated user.

**Returns:** Promise<void>

**Example:**
```javascript
try {
  await logout()
  console.log('User logged out')
} catch (error) {
  console.error('Logout error:', error.message)
}
```

#### 4. `getCurrentUser()`
Get the currently authenticated user.

**Returns:** Promise<User | null>

**Example:**
```javascript
const user = await getCurrentUser()
if (user) {
  console.log('Current user:', user.email)
} else {
  console.log('No user logged in')
}
```

#### 5. `subscribeToAuth(callback)`
Subscribe to auth state changes for real-time updates.

**Parameters:**
- `callback` (function): Called with user object when auth state changes

**Returns:** Unsubscribe function

**Example:**
```javascript
const unsubscribe = subscribeToAuth((user) => {
  if (user) {
    console.log('User logged in:', user.email)
  } else {
    console.log('User logged out')
  }
})

// Later: unsubscribe()
```

#### 6. `updateUserProfile(updates)`
Update user profile information.

**Parameters:**
- `updates` (object): Object with `displayName` and/or `photoURL`

**Example:**
```javascript
await updateUserProfile({
  displayName: 'Jane Doe',
  photoURL: 'https://example.com/photo.jpg'
})
```

#### 7. `updateUserEmail(newEmail)`
Update user's email address.

**Parameters:**
- `newEmail` (string): New email address

**Example:**
```javascript
await updateUserEmail('newemail@example.com')
```

#### 8. `updateUserPassword(newPassword)`
Update user's password.

**Parameters:**
- `newPassword` (string): New password

**Example:**
```javascript
await updateUserPassword('newpassword123')
```

#### 9. `sendPasswordReset(email)`
Send password reset email to user.

**Parameters:**
- `email` (string): User's email address

**Example:**
```javascript
await sendPasswordReset('user@example.com')
```

### Error Messages

The service provides user-friendly error messages:
- Invalid email format
- Weak password
- Email already in use
- Wrong password
- User not found
- Too many login attempts
- Network errors

---

## Link Service (Firestore)

### File: `src/services/linkService.js`

Complete Firestore operations for link management.

### Available Functions

#### 1. `addLink(userId, linkData)`
Add a new link to Firestore.

**Parameters:**
- `userId` (string): User's unique ID
- `linkData` (object): Link data with following structure:
  ```javascript
  {
    title: string,
    description: string,
    url: string,
    category: string,
    month: string (YYYY-MM),
    isPublished: boolean
  }
  ```

**Returns:** Document ID of created link

**Example:**
```javascript
const linkId = await addLink(user.uid, {
  title: 'My Awesome Link',
  description: 'A great resource',
  url: 'https://example.com',
  category: 'resources',
  month: '2026-05',
  isPublished: true
})
```

#### 2. `updateLink(linkId, updates)`
Update an existing link.

**Parameters:**
- `linkId` (string): Link document ID
- `updates` (object): Fields to update

**Example:**
```javascript
await updateLink('link-id-123', {
  title: 'Updated Title',
  isPublished: false
})
```

#### 3. `deleteLink(linkId)`
Delete a link.

**Parameters:**
- `linkId` (string): Link document ID

**Example:**
```javascript
await deleteLink('link-id-123')
```

#### 4. `getLinks(userId)`
Get all links for a user (fetches all at once).

**Parameters:**
- `userId` (string): User's unique ID

**Returns:** Array of link objects

**Example:**
```javascript
const links = await getLinks(user.uid)
console.log('User has', links.length, 'links')
```

#### 5. `getLink(linkId)`
Get a single link by ID.

**Parameters:**
- `linkId` (string): Link document ID

**Returns:** Link object or null

**Example:**
```javascript
const link = await getLink('link-id-123')
```

#### 6. `subscribeToLinks(userId, callback)`
Subscribe to real-time updates for user's links. **Recommended for reactive updates.**

**Parameters:**
- `userId` (string): User's unique ID
- `callback` (function): Called with updated links array

**Returns:** Unsubscribe function

**Example:**
```javascript
const unsubscribe = subscribeToLinks(user.uid, (links) => {
  console.log('Links updated:', links)
  // Update component state
})

// Later: unsubscribe()
```

#### 7. `getLinksByCategory(userId, category)`
Get links filtered by category.

**Parameters:**
- `userId` (string): User's unique ID
- `category` (string): Category name

**Returns:** Array of link objects

**Example:**
```javascript
const resourceLinks = await getLinksByCategory(user.uid, 'resources')
```

#### 8. `getPublishedLinks(userId)`
Get only published links for a user.

**Parameters:**
- `userId` (string): User's unique ID

**Returns:** Array of published link objects

**Example:**
```javascript
const published = await getPublishedLinks(user.uid)
```

#### 9. `deleteLinks(linkIds)`
Batch delete multiple links.

**Parameters:**
- `linkIds` (array): Array of link document IDs

**Example:**
```javascript
await deleteLinks(['link-1', 'link-2', 'link-3'])
```

---

## Context & Hooks

### AuthContext

**File:** `src/context/AppContext.jsx`

Manages authentication state and provides methods throughout the app.

**Exports:**
- `AuthProvider`: Context provider component
- `useAuth()`: Custom hook to access auth context

### AuthContext Value

```javascript
{
  user,              // Current user object (or null)
  loading,           // Boolean - true while checking auth state
  error,             // String - error message if any
  isAuthenticating,  // Boolean - true during login/logout
  isAuthenticated,   // Boolean - true if user is logged in
  login,             // Function - async login(email, password)
  logout,            // Function - async logout()
  signUp,            // Function - async signUp(email, password, displayName)
  clearError         // Function - clear error message
}
```

### useAuth Hook

**Usage:**
```javascript
import { useAuth } from '../context/AppContext'

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  )
}
```

### useLinks Hook

**File:** `src/hooks/useCustomHooks.js`

Custom hook for managing links with real-time updates.

**Usage:**
```javascript
import { useLinks } from '../hooks/useCustomHooks'

function LinksList() {
  const { 
    links, 
    loading, 
    error, 
    addLink, 
    updateLink, 
    deleteLink 
  } = useLinks()
  
  const handleAddLink = async () => {
    try {
      await addLink({
        title: 'New Link',
        url: 'https://example.com',
        category: 'general'
      })
    } catch (err) {
      console.error('Failed to add link:', err)
    }
  }
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {links.map(link => (
        <div key={link.id}>{link.title}</div>
      ))}
      <button onClick={handleAddLink}>Add Link</button>
    </div>
  )
}
```

---

## Usage Examples

### Example 1: Login Form

```javascript
import { useAuth } from '../context/AppContext'
import { useFormState } from '../hooks/useCustomHooks'

function LoginForm() {
  const { login, error, isAuthenticating } = useAuth()
  const { values, handleChange, setError } = useFormState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(values.email, values.password)
      // Redirect to dashboard
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isAuthenticating}>
        {isAuthenticating ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Example 2: Protected Route

```javascript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AppContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/admin" replace />
  }

  return children
}

// Usage in App.jsx
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### Example 3: Link Management

```javascript
import { useLinks } from '../hooks/useCustomHooks'

function LinkManager() {
  const { links, loading, addLink, deleteLink, updateLink } = useLinks()

  const handleAddLink = async () => {
    try {
      await addLink({
        title: 'New Resource',
        description: 'A useful resource',
        url: 'https://example.com',
        category: 'learning',
        isPublished: true
      })
    } catch (error) {
      console.error('Failed to add link:', error)
    }
  }

  const handlePublishToggle = async (link) => {
    try {
      await updateLink(link.id, {
        isPublished: !link.isPublished
      })
    } catch (error) {
      console.error('Failed to update link:', error)
    }
  }

  const handleDeleteLink = async (linkId) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteLink(linkId)
      } catch (error) {
        console.error('Failed to delete link:', error)
      }
    }
  }

  return (
    <div>
      <button onClick={handleAddLink}>Add New Link</button>
      {loading ? (
        <p>Loading links...</p>
      ) : (
        <ul>
          {links.map(link => (
            <li key={link.id}>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <a href={link.url} target="_blank">{link.url}</a>
              <button onClick={() => handlePublishToggle(link)}>
                {link.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => handleDeleteLink(link.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

## Environment Variables

### File: `.env.local`

Configure Firebase credentials from Firebase Console.

**Required Variables:**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**How to Get Credentials:**
1. Go to https://console.firebase.google.com
2. Create a new project or select existing one
3. Go to Project Settings (gear icon)
4. Copy Web app configuration
5. Add values to `.env.local`

---

## Firestore Collections

### Collection: `links`

Document structure for storing user links:

```javascript
{
  userId: "user-uid",                    // Reference to user
  title: "Link Title",                   // Required
  description: "Link description",       // Optional
  url: "https://example.com",            // Required
  category: "general",                   // Category for organization
  month: "2026-05",                      // Month in YYYY-MM format
  isPublished: true,                     // Published status
  createdAt: Timestamp,                  // Server timestamp
  updatedAt: Timestamp                   // Server timestamp
}
```

**Indexes (if needed):**
- userId + createdAt (for sorting by user)
- userId + isPublished (for filtering published links)
- userId + category (for filtering by category)

---

## Error Handling

All services include comprehensive error handling:

**Auth Service Errors:**
- `auth/user-not-found` → "Email address not found"
- `auth/wrong-password` → "Incorrect password"
- `auth/email-already-in-use` → "Email already in use"
- `auth/weak-password` → "Password too weak"
- `auth/invalid-email` → "Invalid email"
- `auth/too-many-requests` → "Too many attempts"
- `auth/network-request-failed` → "Network error"

**Link Service Errors:**
- Firebase initialization errors
- Missing user ID
- Invalid link ID
- Network/database errors

**Error Handling Pattern:**
```javascript
try {
  const user = await login(email, password)
} catch (error) {
  // error.message contains user-friendly message
  console.error(error.message)
}
```

**Context Error State:**
```javascript
const { error, clearError } = useAuth()

if (error) {
  return <div className="error">{error}</div>
}
```

---

## Best Practices

1. **Always use `useAuth()` hook** instead of accessing context directly
2. **Use `useLinks()` hook** for real-time updates in components
3. **Handle loading states** while fetching data
4. **Show user-friendly error messages** from service functions
5. **Unsubscribe from listeners** in cleanup functions
6. **Check authentication before operations** that require user
7. **Use `serverTimestamp()`** for timestamps instead of client dates
8. **Validate user input** before sending to Firestore
9. **Use batch operations** for deleting multiple items
10. **Test with demo credentials first** before using real Firebase project

---

## Troubleshooting

**Problem:** Firebase not initialized warning
- **Solution:** Add credentials to `.env.local` from Firebase Console

**Problem:** "User not authenticated" errors
- **Solution:** Ensure user is logged in before performing operations

**Problem:** Realtime updates not working
- **Solution:** Check that `subscribeToLinks` is used instead of `getLinks`

**Problem:** Permission denied in Firestore
- **Solution:** Update Firestore security rules to allow read/write for authenticated users

**Problem:** Links not appearing after add
- **Solution:** Check Firestore collection name is exactly "links"

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)
