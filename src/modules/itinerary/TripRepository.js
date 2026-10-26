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
    const store = readTripStore(id)
    if (!store) return null

    let dirty = false
    if (!Array.isArray(store.packingItems) || store.packingItems.length < 18) {
      const defaultPacking = [
        { id: 'pack-101', tripId: id, text: 'Comfortable slip-on walking shoes (temple visits)', category: 'CLOTHING', quantity: 1, checked: true, user: 'Demo User', order: 0 },
        { id: 'pack-102', tripId: id, text: 'Lightweight water-repellent windbreaker jacket', category: 'CLOTHING', quantity: 1, checked: false, user: 'Demo User', order: 1 },
        { id: 'pack-103', tripId: id, text: 'Merino base layers and quick-dry t-shirts', category: 'CLOTHING', quantity: 3, checked: false, user: 'Demo User', order: 2 },
        { id: 'pack-104', tripId: id, text: 'Breathable walking socks & thermal sleepwear', category: 'CLOTHING', quantity: 5, checked: false, user: 'Demo User', order: 3 },
        { id: 'pack-105', tripId: id, text: 'Warm fleece jacket or packable down vest', category: 'CLOTHING', quantity: 1, checked: false, user: 'Demo User', order: 4 },
        { id: 'pack-201', tripId: id, text: 'Pocket Wi-Fi / Japanese eSIM confirmation', category: 'ELECTRONICS', quantity: 1, checked: true, user: 'Demo User', order: 5 },
        { id: 'pack-202', tripId: id, text: 'Type A 2-prong power adapters (Japan standard)', category: 'ELECTRONICS', quantity: 2, checked: true, user: 'Demo User', order: 6 },
        { id: 'pack-203', tripId: id, text: '10,000mAh portable power bank for day trips', category: 'ELECTRONICS', quantity: 1, checked: false, user: 'Demo User', order: 7 },
        { id: 'pack-204', tripId: id, text: 'USB-C fast charging cables & noise-cancelling buds', category: 'ELECTRONICS', quantity: 2, checked: false, user: 'Demo User', order: 8 },
        { id: 'pack-301', tripId: id, text: 'Passport & Visit Japan Web QR Code', category: 'DOCUMENTS', quantity: 1, checked: true, user: 'Demo User', order: 9 },
        { id: 'pack-302', tripId: id, text: 'Credit card with zero foreign transaction fees', category: 'DOCUMENTS', quantity: 1, checked: true, user: 'Demo User', order: 10 },
        { id: 'pack-303', tripId: id, text: 'Physical passport color copies & travel insurance card', category: 'DOCUMENTS', quantity: 1, checked: false, user: 'Demo User', order: 11 },
        { id: 'pack-304', tripId: id, text: 'Emergency contacts & accommodation confirmations', category: 'DOCUMENTS', quantity: 1, checked: false, user: 'Demo User', order: 12 },
        { id: 'pack-401', tripId: id, text: 'Compact coin purse (essential for ¥100 / ¥500 coins)', category: 'OTHER & ACCESSORIES', quantity: 1, checked: false, user: 'Demo User', order: 13 },
        { id: 'pack-402', tripId: id, text: 'Reusable tote bag for shopping & street snacks', category: 'OTHER & ACCESSORIES', quantity: 2, checked: false, user: 'Demo User', order: 14 },
        { id: 'pack-403', tripId: id, text: 'Compact travel umbrella (for sudden rain showers)', category: 'OTHER & ACCESSORIES', quantity: 1, checked: false, user: 'Demo User', order: 15 },
        { id: 'pack-404', tripId: id, text: 'Travel skincare set, lip balm & SPF 50 sunscreen', category: 'OTHER & ACCESSORIES', quantity: 1, checked: false, user: 'Demo User', order: 16 },
        { id: 'pack-405', tripId: id, text: 'Small hand towel (many public restrooms lack hand dryers)', category: 'OTHER & ACCESSORIES', quantity: 1, checked: false, user: 'Demo User', order: 17 },
      ]
      const existingMap = new Map((store.packingItems || []).map(i => [i.id, i]))
      const merged = defaultPacking.map(def => existingMap.get(def.id) || def)
      const defIds = new Set(defaultPacking.map(d => d.id))
      const customs = (store.packingItems || []).filter(i => !defIds.has(i.id))
      store.packingItems = [...merged, ...customs]
      dirty = true
    }

    if (!Array.isArray(store.todoItems) || store.todoItems.length < 5) {
      const defaultTodos = [
        { id: 'demo-todo-1', tripId: id, title: 'Book the rental car with gravel protection', description: 'Ensure comprehensive insurance coverage and GPS navigation included.', done: true, priority: 'p1', dueDate: '2027-03-05', assignee: 'Jonas Weber', order: 0 },
        { id: 'demo-todo-2', tripId: id, title: 'Add digital Suica / Pasmo transit card to phone wallet', description: 'Enables contactless tapping on all Tokyo subways, buses, and convenience stores.', done: true, priority: 'p1', dueDate: '2026-10-15', assignee: 'Jonas Weber', order: 1 },
        { id: 'demo-todo-3', tripId: id, title: 'Confirm teamLab Planets timed entry reservation', description: 'Pre-booked for Day 5 at 14:00. Save ticket barcodes.', done: false, priority: 'p1', dueDate: '2026-10-16', assignee: 'Jonas Weber', order: 2 },
        { id: 'demo-todo-4', tripId: id, title: 'Notify bank of international travel and withdraw initial Yen cash', description: 'Many traditional food stalls in Asakusa and Tsukiji remain cash-only.', done: false, priority: 'p2', dueDate: '2026-10-17', assignee: 'Jonas Weber', order: 3 },
        { id: 'demo-todo-5', tripId: id, title: 'Download Tokyo offline maps on phone', description: 'Save offline area in Google Maps for Central Tokyo, Asakusa, and Shibuya.', done: false, priority: 'p3', dueDate: '2026-10-18', assignee: 'Jonas Weber', order: 4 },
      ]
      const existingTodoMap = new Map((store.todoItems || []).map(t => [t.id, t]))
      const mergedTodos = defaultTodos.map(def => existingTodoMap.get(def.id) || def)
      const defTodoIds = new Set(defaultTodos.map(d => d.id))
      const customTodos = (store.todoItems || []).filter(t => !defTodoIds.has(t.id))
      store.todoItems = [...mergedTodos, ...customTodos]
      dirty = true
    }

    if (dirty) {
      try {
        writeTripStore(id, store)
      } catch {}
    }

    return store
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
