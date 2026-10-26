/**
 * @file PackingRepository - Packing List Management
 */

import { generateId } from './ids.js'
import { readTripStore, writeTripStore } from './storage.js'
import { packingProgress } from './calculations.js'

export const PackingRepository = {
  /**
   * Returns all packing items for a trip
   * @param {string} tripId
   * @returns {import('./types.js').PackingItem[]}
   */
  listItems(tripId) {
    const store = readTripStore(tripId)
    return (store?.packingItems || []).sort((a, b) => a.order - b.order)
  },

  /**
   * Creates a packing item
   * @param {string} tripId
   * @param {Object} input
   * @param {string} input.text
   * @param {string} [input.category]
   * @param {number} [input.quantity]
   * @returns {import('./types.js').PackingItem}
   */
  createItem(tripId, input) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    if (!input.text || input.text.trim().length === 0) {
      throw { code: 'VALIDATION_ERROR', field: 'text', message: 'Item text is required' }
    }

    const currentItems = store.packingItems || []
    const nextOrder = currentItems.length > 0 ? Math.max(...currentItems.map(i => i.order)) + 1 : 0

    /** @type {import('./types.js').PackingItem} */
    const item = {
      id: generateId(),
      tripId,
      text: input.text.trim().slice(0, 200),
      category: (input.category || 'General').trim().slice(0, 50),
      quantity: Math.max(1, Number(input.quantity) || 1),
      checked: false,
      order: nextOrder,
      createdAt: new Date().toISOString(),
    }

    store.packingItems = [...currentItems, item]
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return item
  },

  /**
   * Toggles checked status
   * @param {string} tripId
   * @param {string} itemId
   * @returns {import('./types.js').PackingItem}
   */
  toggleItem(tripId, itemId) {
    const store = readTripStore(tripId)
    if (!store) return null

    const index = (store.packingItems || []).findIndex(i => i.id === itemId)
    if (index === -1) {
      const newItem = {
        id: itemId,
        tripId,
        text: 'Item',
        category: 'General',
        quantity: 1,
        checked: true,
        order: (store.packingItems || []).length,
        createdAt: new Date().toISOString(),
      }
      store.packingItems = [...(store.packingItems || []), newItem]
      store.trip.updatedAt = new Date().toISOString()
      writeTripStore(tripId, store)
      return newItem
    }

    const updated = {
      ...store.packingItems[index],
      checked: !store.packingItems[index].checked,
    }

    store.packingItems[index] = updated
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return updated
  },

  /**
   * Updates a packing item
   * @param {string} tripId
   * @param {string} itemId
   * @param {Partial<import('./types.js').PackingItem>} patch
   * @returns {import('./types.js').PackingItem}
   */
  updateItem(tripId, itemId, patch) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const index = (store.packingItems || []).findIndex(i => i.id === itemId)
    if (index === -1) {
      const newItem = {
        id: itemId,
        tripId,
        text: patch.text || 'Item',
        category: patch.category || 'General',
        quantity: patch.quantity || 1,
        checked: Boolean(patch.checked),
        order: (store.packingItems || []).length,
        createdAt: new Date().toISOString(),
        ...patch,
      }
      store.packingItems = [...(store.packingItems || []), newItem]
      store.trip.updatedAt = new Date().toISOString()
      writeTripStore(tripId, store)
      return newItem
    }

    const updated = {
      ...store.packingItems[index],
      ...patch,
    }

    store.packingItems[index] = updated
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return updated
  },

  /**
   * Deletes a packing item
   * @param {string} tripId
   * @param {string} itemId
   */
  deleteItem(tripId, itemId) {
    const store = readTripStore(tripId)
    if (!store) return

    store.packingItems = (store.packingItems || []).filter(i => i.id !== itemId)
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
  },

  /**
   * Reorders packing items
   * @param {string} tripId
   * @param {string[]} orderedItemIds
   * @returns {import('./types.js').PackingItem[]}
   */
  reorderItems(tripId, orderedItemIds) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const idToOrder = new Map(orderedItemIds.map((id, index) => [id, index]))
    store.packingItems = (store.packingItems || []).map(item => {
      if (idToOrder.has(item.id)) {
        return { ...item, order: idToOrder.get(item.id) }
      }
      return item
    })

    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return store.packingItems.sort((a, b) => a.order - b.order)
  },

  progress: packingProgress,
}
