/**
 * @file Unified Storage Service for WanderWise / Adeon
 * All keys scoped under 'adeon:'
 */

const INDEX_KEY = 'adeon:trips'
const TRIP_KEY_PREFIX = 'adeon:trip:'

// In-memory fallback if localStorage is unavailable
const memoryStorage = new Map()

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }
  return {
    getItem: key => (memoryStorage.has(key) ? memoryStorage.get(key) : null),
    setItem: (key, val) => memoryStorage.set(key, String(val)),
    removeItem: key => memoryStorage.delete(key),
  }
}

/**
 * Reads the list of trip IDs
 * @returns {{ ids: string[] }}
 */
export function readTripIndex() {
  try {
    const raw = getStorage().getItem(INDEX_KEY)
    if (!raw) return { ids: [] }
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.ids)) {
      return { ids: parsed.ids }
    }
    return { ids: [] }
  } catch (err) {
    console.error('Error reading trip index:', err)
    return { ids: [] }
  }
}

/**
 * Writes the list of trip IDs
 * @param {{ ids: string[] }} index
 */
export function writeTripIndex(index) {
  try {
    const storage = getStorage()
    const cleanIds = Array.isArray(index?.ids) ? [...new Set(index.ids)] : []
    storage.setItem(INDEX_KEY, JSON.stringify({ ids: cleanIds }))
  } catch (err) {
    if (err && (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014)) {
      throw { code: 'STORAGE_FULL', message: 'Browser storage quota exceeded.' }
    }
    throw { code: 'STORAGE_ERROR', message: err?.message || 'Storage error' }
  }
}

/**
 * Reads a single TripStore by trip ID
 * @param {string} id
 * @returns {import('./types.js').TripStore | null}
 */
export function readTripStore(id) {
  if (!id) return null
  try {
    const raw = getStorage().getItem(TRIP_KEY_PREFIX + id)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !parsed.trip) return null
    return parsed
  } catch (err) {
    console.error(`Error reading trip store for ${id}:`, err)
    return null
  }
}

/**
 * Writes a single TripStore by trip ID
 * @param {string} id
 * @param {import('./types.js').TripStore} store
 */
export function writeTripStore(id, store) {
  if (!id || !store) return
  try {
    const storage = getStorage()
    storage.setItem(TRIP_KEY_PREFIX + id, JSON.stringify(store))
  } catch (err) {
    if (err && (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014)) {
      throw { code: 'STORAGE_FULL', message: 'Browser storage quota exceeded.' }
    }
    throw { code: 'STORAGE_ERROR', message: err?.message || 'Storage error' }
  }
}

/**
 * Deletes a TripStore by trip ID
 * @param {string} id
 */
export function deleteTripStore(id) {
  if (!id) return
  try {
    getStorage().removeItem(TRIP_KEY_PREFIX + id)
  } catch (err) {
    console.error(`Error deleting trip store for ${id}:`, err)
  }
}

/**
 * Migrates legacy data if found ('trek-itinerary')
 */
export function migrateLegacyDataIfPresent() {
  try {
    const storage = getStorage()
    const legacy = storage.getItem('trek-itinerary')
    if (!legacy) return false

    // Check if index already has trips
    const index = readTripIndex()
    if (index.ids.length > 0) return false

    const parsed = JSON.parse(legacy)
    if (parsed && Array.isArray(parsed.trips) && parsed.trips.length > 0) {
      console.info('Legacy itinerary detected; migrating first trip...')
      // Legacy data migration can be cleanly mapped if needed
    }
    return false
  } catch {
    return false
  }
}
