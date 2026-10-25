/**
 * @file useTripStore - React Hook for Trip State and Persistence
 */

import { useState, useEffect, useCallback } from 'react'
import {
  TripRepository,
  PlaceRepository,
  VisitRepository,
  ExpenseRepository,
  TransportRepository,
  PackingRepository,
  TodoRepository,
  ShopGuideRepository,
  SeedLoader,
} from '../../itinerary/index.js'

export function useTripStore(tripId) {
  const [store, setStore] = useState(() => {
    if (!tripId) return null
    return TripRepository.getTrip(tripId)
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(() => {
    if (!tripId) {
      setStore(null)
      setIsLoading(false)
      return
    }
    try {
      const data = TripRepository.getTrip(tripId)
      setStore(data ? { ...data } : null)
      setError(null)
    } catch (err) {
      setError(err?.message || 'Failed to load trip')
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    setIsLoading(true)
    reload()
  }, [tripId, reload])

  // --- Trip Actions ---
  const updateTrip = useCallback((patch) => {
    if (!tripId) return
    const updated = TripRepository.updateTrip(tripId, patch)
    setStore({ ...updated })
  }, [tripId])

  // --- Place Actions ---
  const createPlace = useCallback((input) => {
    if (!tripId) return
    const place = PlaceRepository.createPlace(tripId, input)
    reload()
    return place
  }, [tripId, reload])

  const updatePlace = useCallback((placeId, patch) => {
    if (!tripId) return
    const place = PlaceRepository.updatePlace(tripId, placeId, patch)
    reload()
    return place
  }, [tripId, reload])

  const deletePlace = useCallback((placeId) => {
    if (!tripId) return
    PlaceRepository.deletePlace(tripId, placeId)
    reload()
  }, [tripId, reload])

  const togglePlaceFavorite = useCallback((placeId) => {
    if (!tripId) return
    PlaceRepository.toggleFavorite(tripId, placeId)
    reload()
  }, [tripId, reload])

  // --- Visit Actions ---
  const createVisit = useCallback((input) => {
    if (!tripId) return
    const visit = VisitRepository.createVisit(tripId, input)
    reload()
    return visit
  }, [tripId, reload])

  const reorderVisits = useCallback((dayId, orderedVisitIds) => {
    if (!tripId) return
    VisitRepository.reorderVisits(tripId, dayId, orderedVisitIds)
    reload()
  }, [tripId, reload])

  const deleteVisit = useCallback((visitId) => {
    if (!tripId) return
    VisitRepository.deleteVisit(tripId, visitId)
    reload()
  }, [tripId, reload])

  const updateVisit = useCallback((visitId, patch) => {
    if (!tripId) return
    VisitRepository.updateVisit(tripId, visitId, patch)
    reload()
  }, [tripId, reload])

  // --- Expense Actions ---
  const createExpense = useCallback((input) => {
    if (!tripId) return
    const exp = ExpenseRepository.createExpense(tripId, input)
    reload()
    return exp
  }, [tripId, reload])

  const updateExpense = useCallback((expenseId, patch) => {
    if (!tripId) return
    ExpenseRepository.updateExpense(tripId, expenseId, patch)
    reload()
  }, [tripId, reload])

  const deleteExpense = useCallback((expenseId) => {
    if (!tripId) return
    ExpenseRepository.deleteExpense(tripId, expenseId)
    reload()
  }, [tripId, reload])

  // --- Transport Actions ---
  const createBooking = useCallback((input) => {
    if (!tripId) return
    const booking = TransportRepository.createBooking(tripId, input)
    reload()
    return booking
  }, [tripId, reload])

  const updateBooking = useCallback((bookingId, patch) => {
    if (!tripId) return
    TransportRepository.updateBooking(tripId, bookingId, patch)
    reload()
  }, [tripId, reload])

  const deleteBooking = useCallback((bookingId) => {
    if (!tripId) return
    TransportRepository.deleteBooking(tripId, bookingId)
    reload()
  }, [tripId, reload])

  // --- Packing Actions ---
  const createPackingItem = useCallback((input) => {
    if (!tripId) return
    const item = PackingRepository.createItem(tripId, input)
    reload()
    return item
  }, [tripId, reload])

  const togglePackingItem = useCallback((itemId) => {
    if (!tripId) return
    PackingRepository.toggleItem(tripId, itemId)
    reload()
  }, [tripId, reload])

  const updatePackingItem = useCallback((itemId, patch) => {
    if (!tripId) return
    PackingRepository.updateItem(tripId, itemId, patch)
    reload()
  }, [tripId, reload])

  const deletePackingItem = useCallback((itemId) => {
    if (!tripId) return
    PackingRepository.deleteItem(tripId, itemId)
    reload()
  }, [tripId, reload])

  // --- Todo Actions ---
  const createTodoItem = useCallback((input) => {
    if (!tripId) return
    const item = TodoRepository.createItem(tripId, input)
    reload()
    return item
  }, [tripId, reload])

  const toggleTodoItem = useCallback((itemId) => {
    if (!tripId) return
    TodoRepository.toggleItem(tripId, itemId)
    reload()
  }, [tripId, reload])

  const updateTodoItem = useCallback((itemId, patch) => {
    if (!tripId) return
    TodoRepository.updateItem(tripId, itemId, patch)
    reload()
  }, [tripId, reload])

  const deleteTodoItem = useCallback((itemId) => {
    if (!tripId) return
    TodoRepository.deleteItem(tripId, itemId)
    reload()
  }, [tripId, reload])

  // --- Shop Guide Actions ---
  const toggleFoodTried = useCallback((entryId) => {
    if (!tripId) return
    ShopGuideRepository.toggleFoodTried(tripId, entryId)
    reload()
  }, [tripId, reload])

  const toggleShopBought = useCallback((entryId) => {
    if (!tripId) return
    ShopGuideRepository.toggleShopBought(tripId, entryId)
    reload()
  }, [tripId, reload])

  // --- Seed Reset Action ---
  const resetDemoSeed = useCallback(() => {
    SeedLoader.resetSeed()
    reload()
  }, [reload])

  return {
    store,
    isLoading,
    error,
    notFound: !isLoading && !store,
    reload,
    updateTrip,
    createPlace,
    updatePlace,
    deletePlace,
    togglePlaceFavorite,
    createVisit,
    reorderVisits,
    deleteVisit,
    updateVisit,
    createExpense,
    updateExpense,
    deleteExpense,
    createBooking,
    updateBooking,
    deleteBooking,
    createPackingItem,
    togglePackingItem,
    updatePackingItem,
    deletePackingItem,
    createTodoItem,
    toggleTodoItem,
    updateTodoItem,
    deleteTodoItem,
    toggleFoodTried,
    toggleShopBought,
    resetDemoSeed,
  }
}
