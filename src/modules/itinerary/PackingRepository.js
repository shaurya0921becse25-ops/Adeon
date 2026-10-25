/**
 * @file PackingRepository - Packing List Management
 */

import { generateId } from './ids.js'
import { readTripStore, writeTripStore } from './storage.js'
import { packingProgress } from './calculations.js'

const DEFAULT_PACKING_ITEMS = [
  { id: 'pack-101', text: 'Comfortable slip-on walking shoes (temple visits)', category: 'CLOTHING', quantity: 1, checked: true },
  { id: 'pack-102', text: 'Lightweight water-repellent windbreaker jacket', category: 'CLOTHING', quantity: 1, checked: false },
  { id: 'pack-103', text: 'Merino base layers and quick-dry t-shirts', category: 'CLOTHING', quantity: 3, checked: false },
  { id: 'pack-104', text: 'Breathable walking socks & thermal sleepwear', category: 'CLOTHING', quantity: 5, checked: false },
  { id: 'pack-105', text: 'Warm fleece jacket or packable down vest', category: 'CLOTHING', quantity: 1, checked: false },
  { id: 'pack-201', text: 'Pocket Wi-Fi / Japanese eSIM confirmation', category: 'ELECTRONICS', quantity: 1, checked: true },
  { id: 'pack-202', text: 'Type A 2-prong power adapters (Japan standard)', category: 'ELECTRONICS', quantity: 2, checked: true },
  { id: 'pack-203', text: '10,000mAh portable power bank for day trips', category: 'ELECTRONICS', quantity: 1, checked: false },
  { id: 'pack-204', text: 'USB-C fast charging cables & noise-cancelling buds', category: 'ELECTRONICS', quantity: 2, checked: false },
  { id: 'pack-301', text: 'Passport & Visit Japan Web QR Code', category: 'DOCUMENTS', quantity: 1, checked: true },
  { id: 'pack-302', text: 'Credit card with zero foreign transaction fees', category: 'DOCUMENTS', quantity: 1, checked: true },
  { id: 'pack-303', text: 'Physical passport color copies & travel insurance card', category: 'DOCUMENTS', quantity: 1, checked: false },
  { id: 'pack-304', text: 'Emergency contacts & accommodation confirmations', category: 'DOCUMENTS', quantity: 1, checked: false },
  { id: 'pack-401', text: 'Compact coin purse (essential for ¥100 / ¥500 coins)', category: 'OTHER & ACCESSORIES', quantity: 1, checked: false },
  { id: 'pack-402', text: 'Reusable tote bag for shopping & street snacks', category: 'OTHER & ACCESSORIES', quantity: 2, checked: false },
  { id: 'pack-403', text: 'Compact travel umbrella (for sudden rain showers)', category: 'OTHER & ACCESSORIES', quantity: 1, checked: false },
  { id: 'pack-404', text: 'Travel skincare set, lip balm & SPF 50 sunscreen', category: 'OTHER & ACCESSORIES', quantity: 1, checked: false },
  { id: 'pack-405', text: 'Small hand towel (many public restrooms lack hand dryers)', category: 'OTHER & ACCESSORIES', quantity: 1, checked: false },
]

function getInitialPacking(tripId) {
  return DEFAULT_PACKING_ITEMS.map((it, idx) => ({
    id: it.id,
    tripId: tripId || 'japan-demo-trip-2026',
    text: it.text,
    category: it.category,
    quantity: it.quantity,
    checked: Boolean(it.checked),
    order: idx,
    createdAt: new Date().toISOString(),
  }))
}

export const PackingRepository = {
  /**
   * Returns all packing items for a trip
   * @param {string} tripId
   * @returns {import('./types.js').PackingItem[]}
   */
  listItems(tripId) {
    const store = readTripStore(tripId)
    if (!store) return []
    if (!Array.isArray(store.packingItems) || store.packingItems.length === 0) {
      store.packingItems = getInitialPacking(tripId)
      writeTripStore(tripId, store)
      return store.packingItems
    }
    return (store.packingItems || []).sort((a, b) => a.order - b.order)
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

    if (!Array.isArray(store.packingItems) || store.packingItems.length === 0) {
      store.packingItems = getInitialPacking(tripId)
    }

    const currentItems = store.packingItems || []
    const nextOrder = currentItems.length > 0 ? Math.max(...currentItems.map(i => i.order || 0)) + 1 : 0

    /** @type {import('./types.js').PackingItem} */
    const item = {
      id: generateId(),
      tripId,
      text: input.text.trim().slice(0, 200),
      category: (input.category || 'OTHER & ACCESSORIES').trim().slice(0, 50),
      quantity: Math.max(1, Number(input.quantity) || 1),
      checked: false,
      order: nextOrder,
      createdAt: new Date().toISOString(),
    }

    store.packingItems = [...currentItems, item]
    if (store.trip) store.trip.updatedAt = new Date().toISOString()
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
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    if (!Array.isArray(store.packingItems) || store.packingItems.length === 0) {
      store.packingItems = getInitialPacking(tripId)
    }

    let index = (store.packingItems || []).findIndex(
      i => i.id === itemId ||
           i.id === `pack-${itemId}` ||
           `pack-${i.id}` === itemId ||
           String(i.id).replace('pack-', '') === String(itemId).replace('pack-', '')
    )

    if (index === -1) {
      const match = DEFAULT_PACKING_ITEMS.find(
        d => d.id === itemId ||
             d.id === `pack-${itemId}` ||
             `pack-${d.id}` === itemId ||
             String(d.id).replace('pack-', '') === String(itemId).replace('pack-', '')
      )
      if (match) {
        const newItem = {
          id: itemId,
          tripId,
          text: match.text,
          category: match.category,
          quantity: match.quantity,
          checked: !match.checked,
          order: store.packingItems.length,
          createdAt: new Date().toISOString(),
        }
        store.packingItems.push(newItem)
        index = store.packingItems.length - 1
      } else {
        const newItem = {
          id: itemId,
          tripId,
          text: String(itemId),
          category: 'OTHER & ACCESSORIES',
          quantity: 1,
          checked: true,
          order: store.packingItems.length,
          createdAt: new Date().toISOString(),
        }
        store.packingItems.push(newItem)
        index = store.packingItems.length - 1
      }
    }

    const updated = {
      ...store.packingItems[index],
      checked: !store.packingItems[index].checked,
    }

    store.packingItems[index] = updated
    if (store.trip) store.trip.updatedAt = new Date().toISOString()
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
    if (index === -1) throw { code: 'ITEM_NOT_FOUND', id: itemId }

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
