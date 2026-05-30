import { 
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth } from './config'

/**
 * Authentication Service
 * Provides methods for user authentication using Firebase
 */

// Sign up with email and password
export const signUp = async (email, password, displayName) => {
  if (!auth) {
    throw new Error('Firebase not initialized. Check your .env.local file.')
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      })
    }
    
    return userCredential.user
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

// Sign in with email and password
export const signIn = async (email, password) => {
  if (!auth) {
    throw new Error('Firebase not initialized. Check your .env.local file.')
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

// Sign out
export const logOut = async () => {
  if (!auth) {
    console.warn('Firebase not initialized')
    return
  }
  
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

// Get current user
export const getCurrentUser = () => {
  return auth?.currentUser || null
}

// Subscribe to authentication state changes
export const onAuthChange = (callback) => {
  if (!auth) {
    console.warn('Firebase not initialized. Callback will not be triggered.')
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

// Update user profile
export const updateUserProfile = async (updates) => {
  if (!auth?.currentUser) {
    throw new Error('No user logged in')
  }
  
  try {
    await updateProfile(auth.currentUser, updates)
  } catch (error) {
    console.error('Update profile error:', error)
    throw error
  }
}
