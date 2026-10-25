/**
 * @file PlaceRepository - Place management for a trip
 */

import { generateId } from './ids.js'
import { readTripStore, writeTripStore } from './storage.js'
import { PLACE_CATEGORIES } from './types.js'

export const PlaceRepository = {
  /**
   * Returns all places for a trip
   * @param {string} tripId
   * @returns {import('./types.js').Place[]}
   */
  listPlaces(tripId) {
    const store = readTripStore(tripId)
    return store?.places || []
  },

  /**
   * Creates a new place
   * @param {string} tripId
   * @param {Object} input
   * @returns {import('./types.js').Place}
   */
  createPlace(tripId, input) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    if (!input.name || input.name.trim().length === 0) {
      throw { code: 'VALIDATION_ERROR', field: 'name', message: 'Place name is required' }
    }

    const category = PLACE_CATEGORIES.includes(input.category) ? input.category : 'sight'

    let latitude = typeof input.latitude === 'number' ? input.latitude : undefined
    let longitude = typeof input.longitude === 'number' ? input.longitude : undefined

    if (latitude !== undefined && longitude === undefined) {
      throw { code: 'VALIDATION_ERROR', message: 'Longitude required when latitude is set' }
    }
    if (longitude !== undefined && latitude === undefined) {
      throw { code: 'VALIDATION_ERROR', message: 'Latitude required when longitude is set' }
    }

    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      throw { code: 'VALIDATION_ERROR', message: 'Latitude must be between -90 and 90' }
    }
    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      throw { code: 'VALIDATION_ERROR', message: 'Longitude must be between -180 and 180' }
    }

    const now = new Date().toISOString()
    /** @type {import('./types.js').Place} */
    const place = {
      id: generateId(),
      tripId,
      name: input.name.trim().slice(0, 200),
      category,
      note: (input.note || '').trim().slice(0, 1000),
      tip: (input.tip || '').trim().slice(0, 500),
      imageUrl: input.imageUrl || '',
      latitude,
      longitude,
      estimatedCost: Math.max(0, Number(input.estimatedCost) || 0),
      isFavorite: Boolean(input.isFavorite),
      createdAt: now,
      updatedAt: now,
    }

    store.places = [...(store.places || []), place]
    store.trip.updatedAt = now
    writeTripStore(tripId, store)
    return place
  },

  /**
   * Updates an existing place
   * @param {string} tripId
   * @param {string} placeId
   * @param {Partial<import('./types.js').Place>} patch
   * @returns {import('./types.js').Place}
   */
  updatePlace(tripId, placeId, patch) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const index = (store.places || []).findIndex(p => p.id === placeId)
    if (index === -1) throw { code: 'PLACE_NOT_FOUND', id: placeId }

    const existing = store.places[index]
    const updated = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    store.places[index] = updated
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return updated
  },

  /**
   * Deletes a place and removes all visits referencing it
   * @param {string} tripId
   * @param {string} placeId
   */
  deletePlace(tripId, placeId) {
    const store = readTripStore(tripId)
    if (!store) return

    store.places = (store.places || []).filter(p => p.id !== placeId)
    store.visits = (store.visits || []).filter(v => v.placeId !== placeId)
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
  },

  /**
   * Toggles favorite status on a place
   * @param {string} tripId
   * @param {string} placeId
   * @returns {import('./types.js').Place}
   */
  toggleFavorite(tripId, placeId) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const place = (store.places || []).find(p => p.id === placeId)
    if (!place) throw { code: 'PLACE_NOT_FOUND', id: placeId }

    place.isFavorite = !place.isFavorite
    place.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return place
  },
}
