/**
 * @file ExpenseRepository - Expenses & Budgeting
 */

import { generateId } from './ids.js'
import { readTripStore, writeTripStore } from './storage.js'
import { EXPENSE_CATEGORIES } from './types.js'
import {
  sumExpenses,
  expensesByCategory,
  dailyTotals,
  remainingBudget,
} from './calculations.js'

export const ExpenseRepository = {
  /**
   * Returns all expenses for a trip
   * @param {string} tripId
   * @returns {import('./types.js').Expense[]}
   */
  listExpenses(tripId) {
    const store = readTripStore(tripId)
    return store?.expenses || []
  },

  /**
   * Creates an expense
   * @param {string} tripId
   * @param {Object} input
   * @param {string} input.name
   * @param {number} input.amount
   * @param {import('./types.js').ExpenseCategory} input.category
   * @param {string} [input.date]
   * @param {number[]} [input.dayIndices]
   * @param {string} [input.linkedTransportId]
   * @param {string} [input.linkedShopEntryId]
   * @returns {import('./types.js').Expense}
   */
  createExpense(tripId, input) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    if (!input.name || input.name.trim().length === 0) {
      throw { code: 'VALIDATION_ERROR', field: 'name', message: 'Expense description is required' }
    }

    const amount = Math.max(0, Number(input.amount) || 0)
    if (amount <= 0) {
      throw { code: 'VALIDATION_ERROR', field: 'amount', message: 'Amount must be greater than 0' }
    }

    const category = EXPENSE_CATEGORIES.includes(input.category) ? input.category : 'other'

    // Prevent duplicate expense for the same transport booking
    if (input.linkedTransportId) {
      const existing = (store.expenses || []).find(
        e => e.linkedTransportId === input.linkedTransportId
      )
      if (existing) {
        throw {
          code: 'DUPLICATE_EXPENSE',
          message: 'An expense is already linked to this transport booking',
        }
      }
    }

    // Prevent duplicate expense for the same shop guide entry
    if (input.linkedShopEntryId) {
      const existing = (store.expenses || []).find(
        e => e.linkedShopEntryId === input.linkedShopEntryId
      )
      if (existing) {
        throw {
          code: 'DUPLICATE_EXPENSE',
          message: 'An expense is already linked to this shopping item',
        }
      }
    }

    const now = new Date().toISOString()
    /** @type {import('./types.js').Expense} */
    const expense = {
      id: generateId(),
      tripId,
      name: input.name.trim().slice(0, 200),
      amount,
      category,
      date: input.date || store.trip.startDate,
      dayIndices: Array.isArray(input.dayIndices) ? input.dayIndices : [0],
      linkedTransportId: input.linkedTransportId,
      linkedShopEntryId: input.linkedShopEntryId,
      createdAt: now,
    }

    store.expenses = [...(store.expenses || []), expense]
    store.trip.updatedAt = now
    writeTripStore(tripId, store)
    return expense
  },

  /**
   * Updates an expense
   * @param {string} tripId
   * @param {string} expenseId
   * @param {Partial<import('./types.js').Expense>} patch
   * @returns {import('./types.js').Expense}
   */
  updateExpense(tripId, expenseId, patch) {
    const store = readTripStore(tripId)
    if (!store) throw { code: 'TRIP_NOT_FOUND', id: tripId }

    const index = (store.expenses || []).findIndex(e => e.id === expenseId)
    if (index === -1) throw { code: 'EXPENSE_NOT_FOUND', id: expenseId }

    const updated = {
      ...store.expenses[index],
      ...patch,
      amount: patch.amount !== undefined ? Math.max(0, Number(patch.amount)) : store.expenses[index].amount,
    }

    store.expenses[index] = updated
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
    return updated
  },

  /**
   * Deletes an expense
   * @param {string} tripId
   * @param {string} expenseId
   */
  deleteExpense(tripId, expenseId) {
    const store = readTripStore(tripId)
    if (!store) return

    store.expenses = (store.expenses || []).filter(e => e.id !== expenseId)
    store.trip.updatedAt = new Date().toISOString()
    writeTripStore(tripId, store)
  },

  // Pure functions
  sumExpenses,
  expensesByCategory,
  dailyTotals,
  remainingBudget,
}
