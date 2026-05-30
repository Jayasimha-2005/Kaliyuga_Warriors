/**
 * Authentication Service
 * Handles user authentication operations with Firebase Auth
 * Includes error handling and user state management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword
} from 'firebase/auth'
import { auth, isInitialized } from '../firebase/firebase'

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name (optional)
 * @returns {Promise<Object>} User object
 */
export const signUp = async (email, password, displayName = '') => {
  try {
    if (!isInitialized || !auth) {
      throw new Error('Firebase is not initialized. Please configure your Firebase credentials.')
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName
      })
    }

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      emailVerified: userCredential.user.emailVerified
    }
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error.code)
    throw new Error(errorMessage)
  }
}

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object
 */
export const login = async (email, password) => {
  try {
    if (!isInitialized || !auth) {
      throw new Error('Firebase is not initialized. Please configure your Firebase credentials.')
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      emailVerified: userCredential.user.emailVerified
    }
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error.code)
    throw new Error(errorMessage)
  }
}

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    if (!isInitialized || !auth) {
      throw new Error('Firebase is not initialized.')
    }

    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error)
    throw new Error('Failed to logout. Please try again.')
  }
}

/**
 * Get currently authenticated user
 * @returns {Promise<Object|null>} User object or null
 */
export const getCurrentUser = async () => {
  try {
    if (!isInitialized || !auth) {
      return null
    }

    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        if (user) {
          resolve({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          })
        } else {
          resolve(null)
        }
      }, reject)
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function that receives user object
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAuth = (callback) => {
  if (!isInitialized || !auth) {
    console.warn('Firebase is not initialized. Auth subscription not available.')
    return () => {}
  }

  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      })
    } else {
      callback(null)
    }
  }, (error) => {
    console.error('Auth state change error:', error)
  })
}

/**
 * Update user profile
 * @param {Object} updates - Object with displayName and/or photoURL
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (updates) => {
  try {
    if (!isInitialized || !auth || !auth.currentUser) {
      throw new Error('User is not authenticated.')
    }

    await updateProfile(auth.currentUser, updates)
  } catch (error) {
    console.error('Update profile error:', error)
    throw new Error('Failed to update profile. Please try again.')
  }
}

/**
 * Update user email
 * @param {string} newEmail - New email address
 * @returns {Promise<void>}
 */
export const updateUserEmail = async (newEmail) => {
  try {
    if (!isInitialized || !auth || !auth.currentUser) {
      throw new Error('User is not authenticated.')
    }

    await updateEmail(auth.currentUser, newEmail)
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error.code)
    throw new Error(errorMessage)
  }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const updateUserPassword = async (newPassword) => {
  try {
    if (!isInitialized || !auth || !auth.currentUser) {
      throw new Error('User is not authenticated.')
    }

    await updatePassword(auth.currentUser, newPassword)
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error.code)
    throw new Error(errorMessage)
  }
}

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const sendPasswordReset = async (email) => {
  try {
    if (!isInitialized || !auth) {
      throw new Error('Firebase is not initialized.')
    }

    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error.code)
    throw new Error(errorMessage)
  }
}

/**
 * Map Firebase error codes to user-friendly messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/user-not-found': 'Email address not found. Please sign up or check your email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'Email address is already in use. Please login or use a different email.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/invalid-email': 'Invalid email address. Please check and try again.',
    'auth/user-disabled': 'This user account has been disabled.',
    'auth/operation-not-allowed': 'Operation not allowed. Please contact support.',
    'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/internal-error': 'An internal error occurred. Please try again.',
  }

  return errorMessages[errorCode] || 'An authentication error occurred. Please try again.'
}

export default {
  signUp,
  login,
  logout,
  getCurrentUser,
  subscribeToAuth,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  sendPasswordReset
}
