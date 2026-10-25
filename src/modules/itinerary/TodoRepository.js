/**
 * @file TodoRepository - To-do Tasks Management
 */

import { generateId } from './ids.js'
import { readTripStore, writeTripStore } from './storage.js'
import { todoProgress } from './calculations.js'

const DEFAULT_TODO_ITEMS = [
  { id: 'todo-jp-1', title: 'Pick up Pocket Wi-Fi at Haneda Airport terminal 3 counter', description: 'Show reservation voucher and passport at the Global WiFi counter.', priority: 'p1', dueDate: '2026-10-18', done: true },
  { id: 'todo-jp-2', title: 'Book Shinkansen bullet train tickets (Tokyo → Kyoto)', description: 'Reserve oversized luggage seat on Nozomi express using SmartEX.', priority: 'p1', dueDate: '2026-10-19', done: false },
  { id: 'todo-jp-3', title: 'Purchase teamLab Planets Tokyo admission pass', description: 'Timed morning entry slot; remember shorts for shallow water exhibits.', priority: 'p1', dueDate: '2026-10-18', done: true },
  { id: 'todo-jp-4', title: 'Exchange Japan Rail (JR) Pass physical voucher', description: 'JR East Travel Service Center at Tokyo Station Marunouchi North.', priority: 'p2', dueDate: '2026-10-19', done: false },
  { id: 'todo-jp-5', title: 'Reserve dinner table at Omoide Yokocho Yakitori alley', description: 'Authentic smoky Izakaya experience in Shinjuku.', priority: 'p2', dueDate: '2026-10-21', done: false },
  { id: 'todo-jp-6', title: 'Notify bank & credit cards of Japan travel dates', description: 'Prevent fraud alert lockouts for foreign ATM yen withdrawals.', priority: 'p3', dueDate: '2026-10-16', done: true },
  { id: 'todo-jp-7', title: 'Download offline Google Maps of Tokyo & Kyoto', description: 'Save Greater Tokyo transit and temple areas for offline navigating.', priority: 'p2', dueDate: '2026-10-17', done: true },
]

function getInitialTodo(tripId) {
  return DEFAULT_TODO_ITEMS.map((t, idx) => ({
    id: t.id,
    tripId: tripId || 'japan-demo-trip-2026',
    title: t.title,
    description: t.description || '',
    priority: t.priority || 'none',
    dueDate: t.dueDate || '',
    done: Boolean(t.done),
    order: idx,
    createdAt: new Date().toISOString(),
  }))
}

export const TodoRepository = {
  /**
   * Returns all to-do tasks for a trip
   * @param {string} tripId
   * @returns {import('./types.js').TodoItem[]}
   */
  listItems(tripId) {
    const store = readTripStore(tripId)
    if (!store) return []
    if (!Array.isArray(store.todoItems) || store.todoItems.length === 0) {
      store.todoItems = getInitialTodo(tripId)
      writeTripStore(tripId, store)
      return store.todoItems
    }
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

    if (!Array.isArray(store.todoItems) || store.todoItems.length === 0) {
      store.todoItems = getInitialTodo(tripId)
    }

    const currentItems = store.todoItems || []
    const nextOrder = currentItems.length > 0 ? Math.max(...currentItems.map(i => i.order || 0)) + 1 : 0

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
    if (store.trip) store.trip.updatedAt = new Date().toISOString()
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

    if (!Array.isArray(store.todoItems) || store.todoItems.length === 0) {
      store.todoItems = getInitialTodo(tripId)
    }

    let index = (store.todoItems || []).findIndex(i => i.id === itemId)
    if (index === -1) {
      const match = DEFAULT_TODO_ITEMS.find(d => d.id === itemId)
      if (match) {
        const newItem = {
          id: itemId,
          tripId,
          title: match.title,
          description: match.description,
          priority: match.priority,
          dueDate: match.dueDate,
          done: !match.done,
          order: store.todoItems.length,
          createdAt: new Date().toISOString(),
        }
        store.todoItems.push(newItem)
        index = store.todoItems.length - 1
      } else {
        return null
      }
    }

    const updated = {
      ...store.todoItems[index],
      done: !store.todoItems[index].done,
    }

    store.todoItems[index] = updated
    if (store.trip) store.trip.updatedAt = new Date().toISOString()
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
