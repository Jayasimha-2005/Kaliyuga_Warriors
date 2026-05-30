import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
// Replace with your actual Firebase project credentials from Firebase Console
// Get these values from .env.local file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDummy123456789DummyKeyForDevelopment',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dummy-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dummy-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dummy-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abc123def456',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DUMMY123456'
}

// Initialize Firebase with error handling
let app
let auth = null
let db = null
let storage = null

try {
  // Check if using demo credentials
  const isDemo = firebaseConfig.projectId === 'dummy-project-id'
  
  if (isDemo) {
    console.warn('⚠️ Firebase using demo credentials. Install real credentials in .env.local')
    // Still initialize app to allow UI to render
    app = initializeApp(firebaseConfig)
  } else {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  }
} catch (error) {
  console.warn('⚠️ Firebase initialization warning:', error.message)
  // Continue without Firebase - app UI will still work
}

export { auth, db, storage }
export default app
