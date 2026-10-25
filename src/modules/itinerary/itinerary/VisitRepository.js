/**
 * @file VisitRepository - Scheduling Places onto Days
 */

import { generateId } from './ids.js'
import { readTripStore, writeTripStore } from './storage.js'

export const VisitRepository = {
  /**
   * Returns all visits for a specific day sorted by order
   * @param {string} tripId
   * @param {string} dayId
   * @returns {import('./types.js').Visit[]}
   */
  listVisitsForDay(tripId, dayId) {
    const store = readTripStore(tripId)
    if (!store) return []
    return (store.visits || [])
      .filter(v => v.dayId === dayId)
      .sort((a, b) => a.order - b.order)
  },

  /**
   * Assigns a place to a day
   * @param {string} tripId
   * @param {Object} input
   * @param {string} input.dayId
   * @param {string} input.placeId
   * @param {string} [input.scheduledTime]
   * @param {string} [input.notes]
   * @returns {import('./types.js').Visit}
   */
  createVisit(tripId, input) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    // Validate cross-trip reference
    const place = (store.places || []).find(p => p.id === input.placeId)
    if (!place || place.tripId !== tripId) {
      throw { code: 'CROSS_TRIP_REFERENCE', message: 'Place does not belong to this trip' }
    }

    const day = (store.days || []).find(d => d.id === input.dayId)
    if (!day || day.tripId !== tripId) {
      throw { code: 'CROSS_TRIP_REFERENCE', message: 'Day does not belong to this trip' }
    }

    const currentVisits = (store.visits || []).filter(v => v.dayId === input.dayId)
    const nextOrder = currentVisits.length > 0
      ? Math.max(...currentVisits.map(v => v.order)) + 1
      : 0

    /** @type {import('./types.js').Visit} */
    const visit = {
      id: generateId(),
      tripId,
      dayId: input.dayId,
      placeId: input.placeId,
      order: nextOrder,
      scheduledTime: input.scheduledTime || '',
      notes: input.notes || '',
    }

    store.visits = [...(store.visits || []), visit]
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return visit
  },

  /**
   * Reorders visits within a day
   * @param {string} tripId
   * @param {string} dayId
   * @param {string[]} orderedVisitIds
   * @returns {import('./types.js').Visit[]}
   */
  reorderVisits(tripId, dayId, orderedVisitIds) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const idToOrder = new Map(orderedVisitIds.map((id, index) => [id, index]))

    store.visits = (store.visits || []).map(v => {
      if (v.dayId === dayId && idToOrder.has(v.id)) {
        return { ...v, order: idToOrder.get(v.id) }
      }
      return v
    })

    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)

    return (store.visits || [])
      .filter(v => v.dayId === dayId)
      .sort((a, b) => a.order - b.order)
  },

  /**
   * Updates visit fields (e.g. scheduledTime, notes, or day assignment)
   * @param {string} tripId
   * @param {string} visitId
   * @param {Partial<import('./types.js').Visit>} patch
   * @returns {import('./types.js').Visit}
   */
  updateVisit(tripId, visitId, patch) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const index = (store.visits || []).findIndex(v => v.id === visitId)
    if (index === -1) throw { code: 'VISIT_NOT_FOUND', id: visitId }

    const updated = {
      ...store.visits[index],
      ...patch,
    }

    store.visits[index] = updated
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return updated
  },

  /**
   * Deletes a visit
   * @param {string} tripId
   * @param {string} visitId
   */
  deleteVisit(tripId, visitId) {
    const store = readTripStore(tripId)
    if (!store) return

    store.visits = (store.visits || []).filter(v => v.id !== visitId)
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
  },
}
