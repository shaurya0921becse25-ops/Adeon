/**
 * @file TodoRepository - To-do Tasks Management
 */

import { generateId } from './ids.js'
import { readTripStore, writeTripStore } from './storage.js'
import { todoProgress } from './calculations.js'

export const TodoRepository = {
  /**
   * Returns all to-do tasks for a trip
   * @param {string} tripId
   * @returns {import('./types.js').TodoItem[]}
   */
  listItems(tripId) {
    const store = readTripStore(tripId)
    return (store?.todoItems || []).sort((a, b) => a.order - b.order)
  },

  /**
   * Creates a to-do item
   * @param {string} tripId
   * @param {Object} input
   * @param {string} input.title
   * @param {string} [input.description]
   * @param {import('./types.js').TodoPriority} [input.priority]
   * @param {string} [input.dueDate]
   * @returns {import('./types.js').TodoItem}
   */
  createItem(tripId, input) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    if (!input.title || input.title.trim().length === 0) {
      throw { code: 'VALIDATION_ERROR', field: 'title', message: 'Task title is required' }
    }

    const currentItems = store.todoItems || []
    const nextOrder = currentItems.length > 0 ? Math.max(...currentItems.map(i => i.order)) + 1 : 0

    /** @type {import('./types.js').TodoItem} */
    const item = {
      id: generateId(),
      tripId,
      title: input.title.trim().slice(0, 200),
      description: (input.description || '').trim().slice(0, 1000),
      done: false,
      priority: ['none', 'p1', 'p2', 'p3'].includes(input.priority) ? input.priority : 'none',
      dueDate: input.dueDate || '',
      order: nextOrder,
      createdAt: new Date().toISOString(),
    }

    store.todoItems = [...currentItems, item]
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return item
  },

  /**
   * Toggles completion status
   * @param {string} tripId
   * @param {string} itemId
   * @returns {import('./types.js').TodoItem}
   */
  toggleItem(tripId, itemId) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const index = (store.todoItems || []).findIndex(i => i.id === itemId)
    if (index === -1) throw { code: 'TASK_NOT_FOUND', id: itemId }

    const updated = {
      ...store.todoItems[index],
      done: !store.todoItems[index].done,
    }

    store.todoItems[index] = updated
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return updated
  },

  /**
   * Updates a to-do item
   * @param {string} tripId
   * @param {string} itemId
   * @param {Partial<import('./types.js').TodoItem>} patch
   * @returns {import('./types.js').TodoItem}
   */
  updateItem(tripId, itemId, patch) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const index = (store.todoItems || []).findIndex(i => i.id === itemId)
    if (index === -1) throw { code: 'TASK_NOT_FOUND', id: itemId }

    const updated = {
      ...store.todoItems[index],
      ...patch,
    }

    store.todoItems[index] = updated
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return updated
  },

  /**
   * Deletes a to-do item
   * @param {string} tripId
   * @param {string} itemId
   */
  deleteItem(tripId, itemId) {
    const store = readTripStore(tripId)
    if (!store) return

    store.todoItems = (store.todoItems || []).filter(i => i.id !== itemId)
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
  },

  progress: todoProgress,
}
