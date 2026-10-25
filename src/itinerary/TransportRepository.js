/**
 * @file TransportRepository - Travel & Transport Bookings
 */

import { generateId } from './ids.js'
import { readTripStore, writeTripStore } from './storage.js'
import { TRANSPORT_TYPES } from './types.js'

export const TransportRepository = {
  /**
   * Returns all bookings for a trip
   * @param {string} tripId
   * @returns {import('./types.js').TransportBooking[]}
   */
  listBookings(tripId) {
    const store = readTripStore(tripId)
    return store?.transports || []
  },

  /**
   * Creates a transport booking
   * @param {string} tripId
   * @param {Object} input
   * @returns {import('./types.js').TransportBooking}
   */
  createBooking(tripId, input) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    if (!input.title || input.title.trim().length === 0) {
      throw { code: 'VALIDATION_ERROR', field: 'title', message: 'Booking title is required' }
    }

    const type = TRANSPORT_TYPES.includes(input.type) ? input.type : 'other'
    const status = ['confirmed', 'pending', 'cancelled'].includes(input.status)
      ? input.status
      : 'confirmed'

    const now = new Date().toISOString()
    /** @type {import('./types.js').TransportBooking} */
    const booking = {
      id: generateId(),
      tripId,
      type,
      status,
      title: input.title.trim().slice(0, 200),
      confirmationCode: (input.confirmationCode || '').trim(),
      carrier: (input.carrier || '').trim(),
      from: (input.from || '').trim(),
      to: (input.to || '').trim(),
      flightNumber: (input.flightNumber || '').trim(),
      seatNumber: (input.seatNumber || '').trim(),
      departureDate: input.departureDate || '',
      arrivalDate: input.arrivalDate || '',
      price: Math.max(0, Number(input.price) || 0),
      currency: input.currency || store.trip.currency || 'USD',
      notes: (input.notes || '').trim().slice(0, 500),
      createdAt: now,
      updatedAt: now,
    }

    store.transports = [...(store.transports || []), booking]
    store.trip.updatedAt = now
    writeTripStore(tripId, store)
    return booking
  },

  /**
   * Updates a transport booking
   * @param {string} tripId
   * @param {string} bookingId
   * @param {Partial<import('./types.js').TransportBooking>} patch
   * @returns {import('./types.js').TransportBooking}
   */
  updateBooking(tripId, bookingId, patch) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const index = (store.transports || []).findIndex(t => t.id === bookingId)
    if (index === -1) throw { code: 'BOOKING_NOT_FOUND', id: bookingId }

    const updated = {
      ...store.transports[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    store.transports[index] = updated
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return updated
  },

  /**
   * Deletes a transport booking
   * @param {string} tripId
   * @param {string} bookingId
   */
  deleteBooking(tripId, bookingId) {
    const store = readTripStore(tripId)
    if (!store) return

    store.transports = (store.transports || []).filter(t => t.id !== bookingId)
    // Also unlink or remove linked expense reference to prevent dangling FK
    store.expenses = (store.expenses || []).map(e => {
      if (e.linkedTransportId === bookingId) {
        const { linkedTransportId, ...rest } = e
        return rest
      }
      return e
    })

    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
  },
}
