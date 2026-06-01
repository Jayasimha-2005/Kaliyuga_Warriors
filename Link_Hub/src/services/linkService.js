/**
 * Firestore Link Service
 * Handles all link-related database operations
 * Includes CRUD operations and real-time subscriptions
 */

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
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db, isInitialized } from '../firebase/firebase'

const LINKS_COLLECTION = 'links'

const toDate = (value) => value?.toDate?.() || new Date(0)

const normalizeLink = (docSnapshot) => {
  const data = docSnapshot.data()

  return {
    id: docSnapshot.id,
    ...data,
    reelUrl: data.reelUrl || '',
    featured: Boolean(data.featured),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt)
  }
}

const sortLinksByNewest = (links) =>
  links.sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())

/**
 * Get all published resources for the public homepage.
 * Backwards-compatible alias kept for existing callers.
 * @returns {Promise<Array>} Array of published links
 */
export const getPublicResources = async () => {
  try {
    if (!isInitialized || !db) {
      throw new Error('Firebase is not initialized.')
    }

    const q = query(
      collection(db, LINKS_COLLECTION),
      where('isPublished', '==', true)
    )
    const querySnapshot = await getDocs(q)
    const links = querySnapshot.docs.map(normalizeLink)
    return sortLinksByNewest(links)
  } catch (error) {
    console.error('Error fetching published resources:', error)
    return []
  }
}

export const getAdminLinks = getPublicResources

/**
 * Add a new link to Firestore
 * @param {string} userId - User ID (document owner)
 * @param {Object} linkData - Link data object
 * @returns {Promise<string>} Document ID of created link
 */
export const addLink = async (userId, linkData) => {
  try {
    if (!isInitialized || !db) {
      throw new Error('Firebase is not initialized.')
    }

    if (!userId) {
      throw new Error('User ID is required.')
    }

    const docRef = await addDoc(collection(db, LINKS_COLLECTION), {
      userId,
      title: linkData.title || '',
      description: linkData.description || '',
      url: linkData.url || '',
      reelUrl: linkData.reelUrl || '',
      featured: Boolean(linkData.featured),
      category: linkData.category || 'general',
      month: linkData.month || new Date().toISOString().substring(0, 7),
      isPublished: Boolean(linkData.isPublished),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return docRef.id
  } catch (error) {
    console.error('Error adding link:', error)
    throw new Error(error.message || 'Failed to add link. Please try again.')
  }
}

/**
 * Update an existing link
 * @param {string} linkId - Link document ID
 * @param {Object} updates - Update data object
 * @returns {Promise<void>}
 */
export const updateLink = async (linkId, updates) => {
  try {
    if (!isInitialized || !db) {
      throw new Error('Firebase is not initialized.')
    }

    if (!linkId) {
      throw new Error('Link ID is required.')
    }

    const linkRef = doc(db, LINKS_COLLECTION, linkId)

    await updateDoc(linkRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating link:', error)
    throw new Error(error.message || 'Failed to update link. Please try again.')
  }
}

/**
 * Delete a link
 * @param {string} linkId - Link document ID
 * @returns {Promise<void>}
 */
export const deleteLink = async (linkId) => {
  try {
    if (!isInitialized || !db) {
      throw new Error('Firebase is not initialized.')
    }

    if (!linkId) {
      throw new Error('Link ID is required.')
    }

    await deleteDoc(doc(db, LINKS_COLLECTION, linkId))
  } catch (error) {
    console.error('Error deleting link:', error)
    throw new Error(error.message || 'Failed to delete link. Please try again.')
  }
}

/**
 * Get all links for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of link objects
 */
export const getLinks = async (userId) => {
  try {
    if (!isInitialized || !db) {
      throw new Error('Firebase is not initialized.')
    }

    if (!userId) {
      throw new Error('User ID is required.')
    }

    const q = query(
      collection(db, LINKS_COLLECTION),
      where('userId', '==', userId)
    )

    const querySnapshot = await getDocs(q)
    return sortLinksByNewest(querySnapshot.docs.map(normalizeLink))
  } catch (error) {
    console.error('Error fetching links:', error)
    throw new Error(error.message || 'Failed to fetch links. Please try again.')
  }
}

/**
 * Get a single link by ID
 * @param {string} linkId - Link document ID
 * @returns {Promise<Object|null>} Link object or null if not found
 */
export const getLink = async (linkId) => {
  try {
    if (!isInitialized || !db) {
      throw new Error('Firebase is not initialized.')
    }

    if (!linkId) {
      throw new Error('Link ID is required.')
    }

    const docSnap = await getDoc(doc(db, LINKS_COLLECTION, linkId))

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        reelUrl: data.reelUrl || '',
        featured: Boolean(data.featured),
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching link:', error)
    throw new Error(error.message || 'Failed to fetch link. Please try again.')
  }
}

/**
 * Subscribe to real-time updates for user's links
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function that receives array of links
 * @returns {Function} Unsubscribe function
 */
export const subscribeToLinks = (userId, callback) => {
  try {
    if (!isInitialized || !db) {
      console.warn('Firebase is not initialized. Cannot subscribe to links.')
      return () => {}
    }

    if (!userId) {
      console.warn('User ID is required for subscription.')
      return () => {}
    }

    const q = query(
      collection(db, LINKS_COLLECTION),
      where('userId', '==', userId)
    )

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        callback(sortLinksByNewest(querySnapshot.docs.map(normalizeLink)))
      },
      (error) => {
        console.error('Error in links subscription:', error)
      }
    )

    return unsubscribe
  } catch (error) {
    console.error('Error subscribing to links:', error)
    return () => {}
  }
}

/**
 * Get links filtered by category
 * @param {string} userId - User ID
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of link objects
 */
export const getLinksByCategory = async (userId, category) => {
  try {
    if (!isInitialized || !db) {
      throw new Error('Firebase is not initialized.')
    }

    const q = query(
      collection(db, LINKS_COLLECTION),
      where('userId', '==', userId),
      where('category', '==', category)
    )

    const querySnapshot = await getDocs(q)
    return sortLinksByNewest(querySnapshot.docs.map(normalizeLink))
  } catch (error) {
    console.error('Error fetching links by category:', error)
    throw new Error(error.message || 'Failed to fetch links. Please try again.')
  }
}

/**
 * Get published links for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of published link objects
 */
export const getPublishedLinks = async (userId) => {
  try {
    if (!isInitialized || !db) {
      throw new Error('Firebase is not initialized.')
    }

    const q = query(
      collection(db, LINKS_COLLECTION),
      where('userId', '==', userId),
      where('isPublished', '==', true)
    )

    const querySnapshot = await getDocs(q)
    return sortLinksByNewest(querySnapshot.docs.map(normalizeLink))
  } catch (error) {
    console.error('Error fetching published links:', error)
    throw new Error(error.message || 'Failed to fetch published links.')
  }
}

/**
 * Batch delete links
 * @param {Array<string>} linkIds - Array of link document IDs
 * @returns {Promise<void>}
 */
export const deleteLinks = async (linkIds) => {
  try {
    if (!isInitialized || !db) {
      throw new Error('Firebase is not initialized.')
    }

    if (!Array.isArray(linkIds) || linkIds.length === 0) {
      throw new Error('Link IDs array is required.')
    }

    await Promise.all(linkIds.map((id) => deleteLink(id)))
  } catch (error) {
    console.error('Error deleting links:', error)
    throw new Error(error.message || 'Failed to delete links. Please try again.')
  }
}

export default {
  addLink,
  updateLink,
  deleteLink,
  getLinks,
  getLink,
  subscribeToLinks,
  getLinksByCategory,
  getPublishedLinks,
  deleteLinks,
  getAdminLinks,
  getPublicResources
}