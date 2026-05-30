import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { db } from './config'

/**
 * Database Service
 * Provides methods for Firestore database operations
 */

const LINKS_COLLECTION = 'links'
const USERS_COLLECTION = 'users'
const COLLECTIONS_COLLECTION = 'collections'

// Create a new link
export const createLink = async (userId, linkData) => {
  try {
    const docRef = await addDoc(collection(db, LINKS_COLLECTION), {
      userId,
      ...linkData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating link:', error)
    throw error
  }
}

// Get all links for a user
export const getUserLinks = async (userId) => {
  try {
    const q = query(
      collection(db, LINKS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching links:', error)
    throw error
  }
}

// Update a link
export const updateLink = async (linkId, updates) => {
  try {
    const linkRef = doc(db, LINKS_COLLECTION, linkId)
    await updateDoc(linkRef, {
      ...updates,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating link:', error)
    throw error
  }
}

// Delete a link
export const deleteLink = async (linkId) => {
  try {
    await deleteDoc(doc(db, LINKS_COLLECTION, linkId))
  } catch (error) {
    console.error('Error deleting link:', error)
    throw error
  }
}

// Create a collection
export const createCollection = async (userId, collectionData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS_COLLECTION), {
      userId,
      ...collectionData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating collection:', error)
    throw error
  }
}

// Get user collections
export const getUserCollections = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching collections:', error)
    throw error
  }
}
