# Firebase Integration - Quick Reference

## 🚀 Quick Start (5 minutes)

### 1. Add Firebase Credentials
Edit `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

### 2. Create Test User
Firebase Console → Authentication → Users → Add user
- Email: `test@example.com`
- Password: `Test@123456`

### 3. Restart Server
```bash
npm run dev
```

### 4. Test Login
Navigate to `http://localhost:3000/admin`

---

## 📦 Available Services

### Authentication Service
```javascript
import * as authService from '../services/authService'

// Sign up
await authService.signUp(email, password, displayName)

// Login
await authService.login(email, password)

// Logout
await authService.logout()

// Get current user
const user = await authService.getCurrentUser()

// Send password reset
await authService.sendPasswordReset(email)
```

### Link Service
```javascript
import * as linkService from '../services/linkService'

// Add link
const id = await linkService.addLink(userId, {
  title: 'Title',
  description: 'Desc',
  url: 'https://example.com',
  category: 'general',
  isPublished: true
})

// Get links
const links = await linkService.getLinks(userId)

// Subscribe (real-time) ⭐
const unsubscribe = linkService.subscribeToLinks(userId, (links) => {
  console.log('Links updated:', links)
})

// Update link
await linkService.updateLink(linkId, { title: 'New Title' })

// Delete link
await linkService.deleteLink(linkId)

// Get by category
const resourceLinks = await linkService.getLinksByCategory(userId, 'resources')

// Get published
const published = await linkService.getPublishedLinks(userId)
```

---

## 🪝 Available Hooks

### useAuth()
```javascript
import { useAuth } from '../context/AppContext'

const {
  user,              // User object
  loading,           // Initial load
  error,             // Error message
  isAuthenticating,  // Login/logout in progress
  isAuthenticated,   // Boolean
  login,             // async login(email, pwd)
  logout,            // async logout()
  signUp,            // async signUp(email, pwd, name)
  clearError         // Clear error
} = useAuth()
```

### useLinks()
```javascript
import { useLinks } from '../hooks/useCustomHooks'

const {
  links,                 // Array
  loading,               // Boolean
  error,                 // String
  addLink,               // async addLink(data)
  updateLink,            // async updateLink(id, updates)
  deleteLink,            // async deleteLink(id)
  getLink,               // async getLink(id)
  getLinksByCategory,    // async getLinksByCategory(cat)
  getPublishedLinks,     // async getPublishedLinks()
  deleteMultipleLinks,   // async deleteMultipleLinks(ids)
  clearError             // Clear error
} = useLinks()
```

### useFormState()
```javascript
import { useFormState } from '../hooks/useCustomHooks'

const {
  values,         // Form values object
  handleChange,   // onChange handler
  handleSetValue, // Set single value
  loading,        // Boolean
  error,          // String
  resetForm,      // Reset to initial
  clearError      // Clear error
} = useFormState({ email: '', password: '' })
```

---

## 💻 Common Patterns

### Pattern 1: Login Form
```javascript
import { useAuth } from '../context/AppContext'

function LoginForm() {
  const { login, error, isAuthenticating } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      // Redirect happens automatically
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="error">{error}</p>}
      <button disabled={isAuthenticating}>
        {isAuthenticating ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Pattern 2: Protected Route
```javascript
import { useAuth } from '../context/AppContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/admin" replace />
  
  return children
}

// Usage
<Route path="/admin/dashboard" element={
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### Pattern 3: List Items with Real-Time Updates
```javascript
import { useLinks } from '../hooks/useCustomHooks'

function LinksList() {
  const { links, loading, error, deleteLink } = useLinks()

  if (loading) return <div>Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <ul>
      {links.map(link => (
        <li key={link.id}>
          <h3>{link.title}</h3>
          <a href={link.url}>{link.url}</a>
          <button onClick={() => deleteLink(link.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
```

### Pattern 4: Add/Edit Form with useFormState
```javascript
import { useFormState } from '../hooks/useCustomHooks'
import { useLinks } from '../hooks/useCustomHooks'

function AddLinkForm() {
  const { values, handleChange, resetForm, error } = useFormState({
    title: '',
    url: '',
    category: 'general'
  })
  const { addLink } = useLinks()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addLink(values)
      resetForm()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="title" 
        value={values.title} 
        onChange={handleChange}
      />
      <input 
        name="url" 
        value={values.url} 
        onChange={handleChange}
      />
      <select 
        name="category" 
        value={values.category} 
        onChange={handleChange}
      >
        <option>general</option>
        <option>resources</option>
      </select>
      {error && <p className="error">{error}</p>}
      <button>Add Link</button>
    </form>
  )
}
```

---

## 🔗 Link Data Structure

```javascript
{
  id: 'auto-generated',
  userId: 'user-uid',
  title: 'Link Title',
  description: 'Optional description',
  url: 'https://example.com',
  category: 'general',
  month: '2026-05',
  isPublished: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🛡️ Error Handling

Auth errors:
- `auth/user-not-found` → "Email not found"
- `auth/wrong-password` → "Incorrect password"
- `auth/email-already-in-use` → "Email already in use"
- `auth/weak-password` → "Password too weak"
- `auth/network-request-failed` → "Network error"

All errors are automatically converted to user-friendly messages!

---

## 🌐 Environment Variables

```env
# Required for Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Optional API
VITE_API_URL=http://localhost:3001/api
```

Get these from: Firebase Console → Project Settings → Web App Config

---

## 📋 Firestore Rules

For development (test mode):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /links/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

For production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /links/{linkId} {
      allow read, write: if request.auth != null && 
                           request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🔍 Debugging

### Check if Firebase is initialized
```javascript
import { isInitialized } from '../firebase/firebase'
console.log('Firebase ready:', isInitialized)
```

### Log auth state
```javascript
import { auth } from '../firebase/firebase'
auth?.onAuthStateChanged(user => {
  console.log('Auth user:', user)
})
```

### Monitor Firestore reads/writes
Firebase Console → Firestore → Usage tab

### Check errors
Browser Console (F12) - all errors logged with context

---

## 📱 Component Setup Checklist

- [ ] Import useAuth or useLinks
- [ ] Get data from hook
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Render component
- [ ] Add user interactions
- [ ] Call service functions
- [ ] Test with real Firebase

---

## 🚀 Deploy Checklist

- [ ] `.env.local` has real Firebase credentials
- [ ] Firestore database created
- [ ] Security rules updated for production
- [ ] Email verification enabled (optional)
- [ ] Password reset enabled
- [ ] Error monitoring set up
- [ ] Tested with production credentials
- [ ] Built with `npm run build`
- [ ] Tested production build locally

---

## 📖 Full Documentation

- `FIREBASE_SETUP.md` - Complete setup guide
- `FIREBASE_INTEGRATION.md` - API reference
- `FIREBASE_IMPLEMENTATION.md` - Implementation examples
- `FIREBASE_COMPLETE_SUMMARY.md` - Overview

---

## 🆘 Quick Troubleshooting

**App not loading?**
- Check browser console for errors (F12)
- Ensure `.env.local` has all values
- Restart dev server: `npm run dev`

**Can't login?**
- Is test user created in Firebase?
- Is Email/Password auth enabled?
- Check console for specific error message

**Links not saving?**
- Does Firestore database exist?
- Is security rule allowing writes?
- Check userId is being sent

**Real-time updates not working?**
- Use `subscribeToLinks()` not `getLinks()`
- Check collection name is "links"
- Verify Firestore rules

**Permission denied?**
- Update Firestore security rules
- Check `userId` field matches `auth.uid`

---

## 📞 Support

1. Check error message in console
2. Look up error code in documentation
3. Review relevant guide file
4. Check example code patterns
5. Test with demo credentials first

**You have everything needed to build with Firebase!**
