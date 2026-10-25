/**
 * @file SeedLoader - Idempotent Seed Loading and Resetting
 */

import japanSeed from '../data/seeds/japan.json'
import {
  readTripIndex,
  writeTripIndex,
  readTripStore,
  writeTripStore,
  deleteTripStore,
} from './storage.js'

export const SeedLoader = {
  /**
   * Loads seed data idempotently
   * @param {import('./types.js').TripStore} [seedData]
   * @param {Object} [options]
   * @param {boolean} [options.force=false]
   * @returns {{ loaded: boolean, tripId: string, reason: 'already_exists' | 'loaded' }}
   */
  loadSeed(seedData = japanSeed, options = { force: false }) {
    if (!seedData || !seedData.trip || !seedData.trip.id) {
      throw new Error('Invalid seed data')
    }

    const tripId = seedData.trip.id
    const existing = readTripStore(tripId)

    if (existing && !options.force) {
      // Ensure it's in the index
      const index = readTripIndex()
      if (!index.ids.includes(tripId)) {
        writeTripIndex({ ids: [tripId, ...index.ids] })
      }
      return { loaded: false, tripId, reason: 'already_exists' }
    }

    // Write the seed store
    writeTripStore(tripId, seedData)

    const index = readTripIndex()
    if (!index.ids.includes(tripId)) {
      writeTripIndex({ ids: [tripId, ...index.ids] })
    }

    return { loaded: true, tripId, reason: 'loaded' }
  },

  /**
   * Resets only the seed trip back to initial seed data without touching user trips
   * @param {import('./types.js').TripStore} [seedData]
   * @returns {{ tripId: string }}
   */
  resetSeed(seedData = japanSeed) {
    if (!seedData || !seedData.trip || !seedData.trip.id) {
      throw new Error('Invalid seed data for reset')
    }
    const tripId = seedData.trip.id

    // Delete existing
    deleteTripStore(tripId)

    // Write fresh deep copy of seed
    const freshCopy = JSON.parse(JSON.stringify(seedData))
    freshCopy.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, freshCopy)

    const index = readTripIndex()
    if (!index.ids.includes(tripId)) {
      writeTripIndex({ ids: [tripId, ...index.ids] })
    }

    return { tripId }
  },

  /**
   * Ensures the single Japan demo trip is loaded on a fresh installation
   * If there are no trips at all, loads Japan seed.
   * @returns {string} The ID of the primary trip (first in index or seeded Japan)
   */
  ensureInitialSeedLoaded() {
    const index = readTripIndex()
    if (index.ids.length === 0) {
      this.loadSeed(japanSeed, { force: true })
      return japanSeed.trip.id
    }
    return index.ids[0]
  },
}
