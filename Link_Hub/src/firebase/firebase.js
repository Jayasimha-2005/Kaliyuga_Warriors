/**
 * Firebase Configuration and Initialization
 * Centralizes Firebase app, auth, and database initialization
 * Uses environment variables for configuration
 */

import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Validate Firebase configuration
const isConfigured = Object.values(firebaseConfig).every(value => 
  value && value.startsWith('VITE_') === false && value !== 'undefined'
)

if (!isConfigured) {
  console.warn(
    '⚠️ Firebase is not fully configured. Please add your Firebase credentials to .env.local\n' +
    'Get these values from Firebase Console: https://console.firebase.google.com'
  )
}

// Initialize Firebase
let app
let auth = null
let db = null
let storage = null
let isInitialized = false

try {
  app = initializeApp(firebaseConfig)
  
  if (isConfigured) {
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    
    // Enable persistence for auth state
    setPersistence(auth, browserLocalPersistence)
      .catch(error => {
        console.warn('⚠️ Failed to enable auth persistence:', error.message)
      })
    
    isInitialized = true
    console.log('✅ Firebase initialized successfully')
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message)
  app = null
}

export { app, auth, db, storage, isInitialized }
