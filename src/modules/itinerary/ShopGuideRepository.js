/**
 * @file ShopGuideRepository - Food & Shopping Recommendations and Status
 */

import { generateId } from './ids.js'
import { readTripStore, writeTripStore } from './storage.js'

export const ShopGuideRepository = {
  /**
   * Returns all food guide entries for a trip
   * @param {string} tripId
   * @returns {import('./types.js').FoodGuideEntry[]}
   */
  listFoodEntries(tripId) {
    const store = readTripStore(tripId)
    return (store?.foodGuide || []).sort((a, b) => a.order - b.order)
  },

  /**
   * Returns all shopping guide entries for a trip
   * @param {string} tripId
   * @returns {import('./types.js').ShopGuideEntry[]}
   */
  listShopEntries(tripId) {
    const store = readTripStore(tripId)
    return (store?.shopGuide || []).sort((a, b) => a.order - b.order)
  },

  /**
   * Toggles 'tried' status on a food recommendation
   * @param {string} tripId
   * @param {string} entryId
   * @returns {import('./types.js').FoodGuideEntry}
   */
  toggleFoodTried(tripId, entryId) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const index = (store.foodGuide || []).findIndex(f => f.id === entryId)
    if (index === -1) throw { code: 'ENTRY_NOT_FOUND', id: entryId }

    const updated = {
      ...store.foodGuide[index],
      tried: !store.foodGuide[index].tried,
    }

    store.foodGuide[index] = updated
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return updated
  },

  /**
   * Toggles 'bought' status on a shopping recommendation
   * @param {string} tripId
   * @param {string} entryId
   * @returns {import('./types.js').ShopGuideEntry}
   */
  toggleShopBought(tripId, entryId) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const index = (store.shopGuide || []).findIndex(s => s.id === entryId)
    if (index === -1) throw { code: 'ENTRY_NOT_FOUND', id: entryId }

    const updated = {
      ...store.shopGuide[index],
      bought: !store.shopGuide[index].bought,
    }

    store.shopGuide[index] = updated
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return updated
  },

  /**
   * Adds a custom food entry
   * @param {string} tripId
   * @param {Object} input
   * @returns {import('./types.js').FoodGuideEntry}
   */
  addFoodEntry(tripId, input) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const nextOrder = (store.foodGuide || []).length
    /** @type {import('./types.js').FoodGuideEntry} */
    const entry = {
      id: generateId(),
      tripId,
      name: input.name.trim().slice(0, 100),
      emoji: input.emoji || '🍽️',
      tagLine: input.tagLine || '',
      story: input.story || '',
      whereToFind: input.whereToFind || '',
      tip: input.tip || '',
      gradientColors: input.gradientColors || ['#c2410c', '#7c2d12'],
      tried: false,
      order: nextOrder,
    }

    store.foodGuide = [...(store.foodGuide || []), entry]
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return entry
  },

  /**
   * Adds a custom shop entry
   * @param {string} tripId
   * @param {Object} input
   * @returns {import('./types.js').ShopGuideEntry}
   */
  addShopEntry(tripId, input) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const nextOrder = (store.shopGuide || []).length
    /** @type {import('./types.js').ShopGuideEntry} */
    const entry = {
      id: generateId(),
      tripId,
      name: input.name.trim().slice(0, 100),
      emoji: input.emoji || '🛍️',
      tagLine: input.tagLine || '',
      story: input.story || '',
      whereToBuy: input.whereToBuy || '',
      tip: input.tip || '',
      gradientColors: input.gradientColors || ['#7c3aed', '#4c1d95'],
      bought: false,
      order: nextOrder,
    }

    store.shopGuide = [...(store.shopGuide || []), entry]
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return entry
  },
}
