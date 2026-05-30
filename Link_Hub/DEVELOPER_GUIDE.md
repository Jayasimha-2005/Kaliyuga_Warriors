# Developer Guide & Code Examples

## Using Link Hub Components and Services

This guide provides practical examples of how to use various features in Link Hub.

---

## Components

### Using the Navbar

The Navbar is already integrated in `App.jsx` but here's how to use it:

```jsx
import { Navbar } from './components'

function App() {
  return (
    <>
      <Navbar />
      {/* Rest of your app */}
    </>
  )
}
```

### Using the Footer

The Footer is already integrated in `App.jsx` but here's how to customize it:

```jsx
import Footer from './components/Footer'

function App() {
  return (
    <>
      {/* Main content */}
      <Footer />
    </>
  )
}
```

---

## Services

### Firebase Authentication Service

```jsx
import { signIn, signUp, logOut } from './firebase/auth'

// Sign in user
async function handleLogin(email, password) {
  try {
    const user = await signIn(email, password)
    console.log('Logged in:', user)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Sign up new user
async function handleSignUp(email, password, name) {
  try {
    const user = await signUp(email, password, name)
    console.log('User created:', user)
  } catch (error) {
    console.error('Signup failed:', error)
  }
}

// Sign out
async function handleLogout() {
  try {
    await logOut()
    console.log('Logged out')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
```

### Firebase Database Service

```jsx
import { 
  createLink, 
  getUserLinks, 
  updateLink, 
  deleteLink 
} from './services/firebaseService'

// Create a new link
async function addNewLink(userId) {
  try {
    const linkId = await createLink(userId, {
      title: 'My Awesome Link',
      url: 'https://example.com',
      description: 'This is a great resource',
      category: 'learning'
    })
    console.log('Link created:', linkId)
  } catch (error) {
    console.error('Error creating link:', error)
  }
}

// Get all user links
async function loadUserLinks(userId) {
  try {
    const links = await getUserLinks(userId)
    console.log('User links:', links)
  } catch (error) {
    console.error('Error fetching links:', error)
  }
}

// Update a link
async function editLink(linkId) {
  try {
    await updateLink(linkId, {
      title: 'Updated Title',
      description: 'Updated description'
    })
    console.log('Link updated')
  } catch (error) {
    console.error('Error updating link:', error)
  }
}

// Delete a link
async function removeLink(linkId) {
  try {
    await deleteLink(linkId)
    console.log('Link deleted')
  } catch (error) {
    console.error('Error deleting link:', error)
  }
}
```

### API Service

```jsx
import { apiGet, apiPost, apiPut, apiDelete } from './services/apiService'

// Make GET request
async function fetchData() {
  try {
    const data = await apiGet('/links')
    console.log('Data:', data)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Make POST request
async function createData() {
  try {
    const response = await apiPost('/links', {
      title: 'New Link',
      url: 'https://example.com'
    })
    console.log('Created:', response)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Make PUT request
async function updateData() {
  try {
    const response = await apiPut('/links/123', {
      title: 'Updated Link'
    })
    console.log('Updated:', response)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Make DELETE request
async function deleteData() {
  try {
    await apiDelete('/links/123')
    console.log('Deleted')
  } catch (error) {
    console.error('Error:', error)
  }
}
```

---

## Custom Hooks

### useLocalStorage Hook

```jsx
import { useLocalStorage } from './hooks/useCustomHooks'

function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark')
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme: {theme}
    </button>
  )
}
```

### useFetch Hook

```jsx
import { useFetch } from './hooks/useCustomHooks'

function LinksList() {
  const { data, loading, error } = useFetch('/api/links')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <ul>
      {data?.map(link => (
        <li key={link.id}>{link.title}</li>
      ))}
    </ul>
  )
}
```

### useDebounce Hook

```jsx
import { useDebounce } from './hooks/useCustomHooks'
import { useState } from 'react'

function SearchLinks() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  
  return (
    <>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search links..."
      />
      <p>Searching for: {debouncedSearchTerm}</p>
    </>
  )
}
```

### useToggle Hook

```jsx
import { useToggle } from './hooks/useCustomHooks'

function ToggleMenu() {
  const [isOpen, toggle] = useToggle(false)
  
  return (
    <>
      <button onClick={toggle}>
        {isOpen ? 'Close' : 'Open'} Menu
      </button>
      {isOpen && <div>Menu content</div>}
    </>
  )
}
```

### useCounter Hook

```jsx
import { useCounter } from './hooks/useCustomHooks'

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

---

## Context API

### Using Auth Context

First, wrap your app with AuthProvider in `main.jsx`:

```jsx
import { AuthProvider } from './context/AppContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
```

Then use it in components:

```jsx
import { useAuth } from './context/AppContext'

function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {isAuthenticated ? (
        <h1>Welcome, {user?.email}</h1>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

### Using App Context

```jsx
import { useApp } from './context/AppContext'

function LinksList() {
  const { links, showNotification } = useApp()
  
  const handleDelete = () => {
    // Delete link logic
    showNotification('Link deleted successfully!', 'success')
  }
  
  return (
    <>
      {links.map(link => (
        <div key={link.id}>
          <h3>{link.title}</h3>
          <button onClick={handleDelete}>Delete</button>
        </div>
      ))}
    </>
  )
}
```

---

## Utility Functions

### Using Helper Functions

```jsx
import { 
  formatDate, 
  validateEmail, 
  truncateText,
  formatNumber,
  copyToClipboard,
  isValidUrl,
  getDomainFromUrl 
} from './utils/helpers'

// Format date
const dateString = formatDate(new Date())
// Output: "May 30, 2024"

// Validate email
const isValidEmail = validateEmail('user@example.com')
// Output: true

// Truncate text
const shortText = truncateText('This is a very long text', 10)
// Output: "This is a ..."

// Format number
const formatted = formatNumber(1000000)
// Output: "1,000,000"

// Copy to clipboard
copyToClipboard('https://example.com')

// Validate URL
const isValid = isValidUrl('https://example.com')
// Output: true

// Get domain from URL
const domain = getDomainFromUrl('https://www.example.com')
// Output: "example.com"
```

### Using Constants

```jsx
import { 
  COLORS, 
  VALIDATION_RULES, 
  MESSAGES,
  USER_ROLES 
} from './utils/constants'

// Access colors
const primaryColor = COLORS.PRIMARY
// Output: "#64b5f6"

// Check password validation
if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
  alert('Password too short')
}

// Show messages
console.log(MESSAGES.SUCCESS)
// Output: "Operation completed successfully!"

// Check user role
if (user.role === USER_ROLES.ADMIN) {
  // Show admin features
}
```

---

## Creating New Pages

### Step 1: Create Page Component

`src/pages/Profile.jsx`:
```jsx
import React from 'react'
import './Profile.css'

function Profile() {
  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {/* Profile content */}
    </div>
  )
}

export default Profile
```

### Step 2: Create Page Styles

`src/pages/Profile.css`:
```css
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
```

### Step 3: Add Route in App.jsx

```jsx
import Profile from './pages/Profile'

// Inside Router/Routes
<Route path="/profile" element={<Profile />} />
```

### Step 4: Export from pages/index.js

```jsx
export { default as Profile } from './Profile'
```

---

## Creating New Components

### Step 1: Create Component

`src/components/LinkCard.jsx`:
```jsx
import React from 'react'
import './LinkCard.css'
import { FaLink, FaCopy } from 'react-icons/fa'

function LinkCard({ link }) {
  return (
    <div className="link-card glass glass-hover">
      <div className="link-card-header">
        <FaLink />
        <h3>{link.title}</h3>
      </div>
      <p className="link-url">{link.url}</p>
      <p className="link-description">{link.description}</p>
      <button className="copy-btn">
        <FaCopy /> Copy Link
      </button>
    </div>
  )
}

export default LinkCard
```

### Step 2: Create Component Styles

`src/components/LinkCard.css`:
```css
.link-card {
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.link-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.link-url {
  color: #64b5f6;
  word-break: break-all;
}

.copy-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(100, 181, 246, 0.2);
  border: 1px solid rgba(100, 181, 246, 0.4);
  color: #64b5f6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: rgba(100, 181, 246, 0.4);
}
```

### Step 3: Use Component in Pages

```jsx
import LinkCard from '../components/LinkCard'

function Home() {
  const links = [
    { id: 1, title: 'Link 1', url: 'https://example1.com', description: 'Description 1' },
    { id: 2, title: 'Link 2', url: 'https://example2.com', description: 'Description 2' }
  ]
  
  return (
    <div>
      {links.map(link => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  )
}
```

---

## Protected Routes (Future Implementation)

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AppContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return isAuthenticated ? children : <Navigate to="/admin" />
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

---

## Common Patterns

### Form Handling

```jsx
import { useState } from 'react'

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form data:', formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### List with Loading and Error States

```jsx
import { useFetch } from './hooks/useCustomHooks'

function LinksList() {
  const { data: links, loading, error } = useFetch('/api/links')

  if (loading) return <div className="loading">Loading links...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!links?.length) return <div>No links found</div>

  return (
    <ul>
      {links.map(link => (
        <li key={link.id}>{link.title}</li>
      ))}
    </ul>
  )
}
```

---

## Best Practices

1. **Always use error boundaries** for better error handling
2. **Keep components small and focused** on single responsibility
3. **Use custom hooks** to extract reusable logic
4. **Use Context API** for global state
5. **Validate user input** using helpers
6. **Use semantic HTML** for accessibility
7. **Test responsive design** on multiple devices
8. **Keep Firebase credentials in .env.local**
9. **Use meaningful variable and function names**
10. **Add comments for complex logic**

---

## Troubleshooting Common Issues

### Issue: "Cannot read property 'map' of undefined"
**Solution**: Check if data exists before mapping
```jsx
{data?.map(item => <Item key={item.id} />)}
```

### Issue: "Too many re-renders"
**Solution**: Check useEffect dependencies
```jsx
useEffect(() => {
  // Code here
}, [dependency]) // Make sure dependencies are correct
```

### Issue: "Firebase not initialized"
**Solution**: Check .env.local variables start with VITE_

### Issue: "Styles not updating"
**Solution**: Clear cache and restart dev server

---

## Resources for Further Learning

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Router Tutorial](https://reactrouter.com)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Happy Coding! 🎉**
