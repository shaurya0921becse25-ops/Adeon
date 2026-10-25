/**
 * @file TripRepository - Trip Entity and Store Management
 */

import { generateId } from './ids.js'
import {
  readTripIndex,
  writeTripIndex,
  readTripStore,
  writeTripStore,
  deleteTripStore,
} from './storage.js'
import { getDatesBetween } from './calculations.js'

export const TripRepository = {
  /**
   * Returns list of all trips (summaries with calculated counts)
   * @returns {Array<import('./types.js').Trip & { placeCount: number, durationDays: number, totalExpenses: number }>}
   */
  listTrips() {
    const index = readTripIndex()
    const result = []

    for (const id of index.ids) {
      const store = readTripStore(id)
      if (store && store.trip) {
        const placeCount = Array.isArray(store.places) ? store.places.length : 0
        const totalExpenses = Array.isArray(store.expenses)
          ? store.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
          : 0
        const durationDays = getDatesBetween(store.trip.startDate, store.trip.endDate).length

        result.push({
          ...store.trip,
          placeCount,
          durationDays,
          totalExpenses,
        })
      }
    }
    return result
  },

  /**
   * Returns full trip store for a given trip ID
   * @param {string} id
   * @returns {import('./types.js').TripStore | null}
   */
  getTrip(id) {
    if (!id) return null
    return readTripStore(id)
  },

  /**
   * Creates a new trip and initialises its store and calendar Days
   * @param {Object} input
   * @param {string} input.title
   * @param {string} input.destination
   * @param {string} [input.description]
   * @param {string} [input.coverImageUrl]
   * @param {string} input.startDate
   * @param {string} input.endDate
   * @param {string} [input.currency]
   * @param {number} [input.budget]
   * @param {string[]} [input.tags]
   * @returns {import('./types.js').TripStore}
   */
  createTrip(input) {
    if (!input.title || !input.destination) {
      throw { code: 'VALIDATION_ERROR', message: 'Title and destination are required' }
    }
    if (!input.startDate || !input.endDate) {
      throw { code: 'INVALID_DATES', message: 'Start and end dates are required' }
    }
    if (input.endDate < input.startDate) {
      throw { code: 'INVALID_DATES', message: 'End date cannot be before start date' }
    }

    const tripId = generateId()
    const now = new Date().toISOString()
    const dates = getDatesBetween(input.startDate, input.endDate)

    /** @type {import('./types.js').Day[]} */
    const days = dates.map((date, idx) => ({
      id: generateId(),
      tripId,
      date,
      title: `Day ${idx + 1}`,
      dayNote: '',
      transportNote: '',
    }))

    /** @type {import('./types.js').Trip} */
    const trip = {
      id: tripId,
      title: input.title.trim(),
      destination: input.destination.trim(),
      description: (input.description || '').trim(),
      coverImageUrl: input.coverImageUrl || '',
      startDate: input.startDate,
      endDate: input.endDate,
      currency: (input.currency || 'USD').toUpperCase(),
      budget: Math.max(0, Number(input.budget) || 0),
      tags: Array.isArray(input.tags) ? input.tags : [],
      status: 'planned',
      createdAt: now,
      updatedAt: now,
    }

    /** @type {import('./types.js').TripStore} */
    const store = {
      trip,
      places: Array.isArray(input.places) ? input.places : [],
      days: Array.isArray(input.days) && input.days.length > 0 ? input.days : days,
      visits: Array.isArray(input.visits) ? input.visits : [],
      expenses: Array.isArray(input.expenses) ? input.expenses : [],
      transports: Array.isArray(input.transports) ? input.transports : [],
      packingItems: Array.isArray(input.packingItems) ? input.packingItems : [],
      todoItems: Array.isArray(input.todoItems) ? input.todoItems : [],
      foodGuide: Array.isArray(input.foodGuide) ? input.foodGuide : [],
      shopGuide: Array.isArray(input.shopGuide) ? input.shopGuide : [],
    }

    writeTripStore(tripId, store)
    const index = readTripIndex()
    writeTripIndex({ ids: [tripId, ...index.ids.filter(i => i !== tripId)] })

    return store
  },

  /**
   * Updates trip attributes and regenerates Days if dates change
   * @param {string} id
   * @param {Partial<import('./types.js').Trip>} patch
   * @returns {import('./types.js').TripStore}
   */
  updateTrip(id, patch) {
    const store = readTripStore(id)
    if (!store || !store.trip) {
      throw { code: 'TRIP_NOT_FOUND', id }
    }

    const newStart = patch.startDate || store.trip.startDate
    const newEnd = patch.endDate || store.trip.endDate
    if (newEnd < newStart) {
      throw { code: 'INVALID_DATES', message: 'End date cannot be before start date' }
    }

    const datesChanged = newStart !== store.trip.startDate || newEnd !== store.trip.endDate
    let days = store.days || []

    if (datesChanged) {
      const dates = getDatesBetween(newStart, newEnd)
      const existingDateMap = new Map((days || []).map(d => [d.date, d]))

      days = dates.map((date, idx) => {
        if (existingDateMap.has(date)) {
          return existingDateMap.get(date)
        }
        return {
          id: generateId(),
          tripId: id,
          date,
          title: `Day ${idx + 1}`,
          dayNote: '',
          transportNote: '',
        }
      })
    }

    store.trip = {
      ...store.trip,
      ...patch,
      startDate: newStart,
      endDate: newEnd,
      updatedAt: new Date().toISOString(),
    }
    store.days = days

    writeTripStore(id, store)
    return store
  },

  /**
   * Sets status to 'archived'
   * @param {string} id
   * @returns {import('./types.js').Trip}
   */
  archiveTrip(id) {
    const store = readTripStore(id)
    if (!store || !store.trip) {
      throw { code: 'TRIP_NOT_FOUND', id }
    }
    store.trip.status = store.trip.status === 'archived' ? 'planned' : 'archived'
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(id, store)
    return store.trip
  },

  /**
   * Deep-clones the trip with new IDs and remapped foreign keys
   * @param {string} id
   * @returns {import('./types.js').TripStore}
   */
  duplicateTrip(id) {
    const original = readTripStore(id)
    if (!original || !original.trip) {
      throw { code: 'TRIP_NOT_FOUND', id }
    }

    const newTripId = generateId()
    const now = new Date().toISOString()

    // Map old day IDs to new day IDs
    const dayIdMap = new Map()
    const newDays = (original.days || []).map(d => {
      const newId = generateId()
      dayIdMap.set(d.id, newId)
      return { ...d, id: newId, tripId: newTripId }
    })

    // Map old place IDs to new place IDs
    const placeIdMap = new Map()
    const newPlaces = (original.places || []).map(p => {
      const newId = generateId()
      placeIdMap.set(p.id, newId)
      return { ...p, id: newId, tripId: newTripId, createdAt: now, updatedAt: now }
    })

    // Map visits
    const newVisits = (original.visits || []).map(v => ({
      ...v,
      id: generateId(),
      tripId: newTripId,
      dayId: dayIdMap.get(v.dayId) || v.dayId,
      placeId: placeIdMap.get(v.placeId) || v.placeId,
    }))

    // Map transports
    const transportIdMap = new Map()
    const newTransports = (original.transports || []).map(t => {
      const newId = generateId()
      transportIdMap.set(t.id, newId)
      return { ...t, id: newId, tripId: newTripId, createdAt: now, updatedAt: now }
    })

    // Map expenses
    const newExpenses = (original.expenses || []).map(e => ({
      ...e,
      id: generateId(),
      tripId: newTripId,
      linkedTransportId: e.linkedTransportId ? transportIdMap.get(e.linkedTransportId) : undefined,
      createdAt: now,
    }))

    const newPacking = (original.packingItems || []).map(pi => ({
      ...pi,
      id: generateId(),
      tripId: newTripId,
      createdAt: now,
    }))

    const newTodos = (original.todoItems || []).map(ti => ({
      ...ti,
      id: generateId(),
      tripId: newTripId,
      createdAt: now,
    }))

    const newFood = (original.foodGuide || []).map(f => ({
      ...f,
      id: generateId(),
      tripId: newTripId,
    }))

    const newShop = (original.shopGuide || []).map(s => ({
      ...s,
      id: generateId(),
      tripId: newTripId,
    }))

    /** @type {import('./types.js').TripStore} */
    const newStore = {
      trip: {
        ...original.trip,
        id: newTripId,
        title: `${original.trip.title} (Copy)`,
        createdAt: now,
        updatedAt: now,
        seedId: undefined, // duplicated trips are user-owned
      },
      places: newPlaces,
      days: newDays,
      visits: newVisits,
      expenses: newExpenses,
      transports: newTransports,
      packingItems: newPacking,
      todoItems: newTodos,
      foodGuide: newFood,
      shopGuide: newShop,
    }

    writeTripStore(newTripId, newStore)
    const index = readTripIndex()
    writeTripIndex({ ids: [newTripId, ...index.ids] })

    return newStore
  },

  /**
   * Deletes a trip and its store
   * @param {string} id
   */
  deleteTrip(id) {
    if (!id) return
    deleteTripStore(id)
    const index = readTripIndex()
    writeTripIndex({ ids: index.ids.filter(i => i !== id) })
  },
}
