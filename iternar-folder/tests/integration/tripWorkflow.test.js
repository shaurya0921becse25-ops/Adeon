import { describe, it, expect, beforeEach } from 'vitest'
import {
  TripRepository,
  PlaceRepository,
  ExpenseRepository,
  TransportRepository,
  PackingRepository,
  TodoRepository,
  ShopGuideRepository,
  SeedLoader,
  remainingBudget,
} from '../../itinerary/index.js'
import japanSeed from '../../data/seeds/japan.json'

describe('End-to-End Travel Planning Data Integration', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  it('initializes Japan seed with 7 verified places across all 6 tabs', () => {
    SeedLoader.loadSeed(japanSeed, { force: true })
    const store = TripRepository.getTrip('japan-demo-trip-2026')

    expect(store).not.toBeNull()
    expect(store.trip.destination).toBe('Tokyo, Japan')
    expect(store.places.length).toBe(7)
    expect(store.days.length).toBe(7)
    expect(store.foodGuide.length).toBe(4)
    expect(store.shopGuide.length).toBe(6)
    expect(store.transports.length).toBe(3)
    expect(store.packingItems.length).toBe(7)
    expect(store.todoItems.length).toBe(4)

    // Verify all 7 places have valid real coordinates in Japan
    store.places.forEach((p) => {
      expect(typeof p.latitude).toBe('number')
      expect(typeof p.longitude).toBe('number')
      expect(p.latitude).toBeGreaterThan(35.0)
      expect(p.latitude).toBeLessThan(36.0)
      expect(p.longitude).toBeGreaterThan(139.0)
      expect(p.longitude).toBeLessThan(140.0)
    })
  })

  it('reflects cross-tab changes: adding place updates place count', () => {
    const tripStore = TripRepository.createTrip({
      title: 'Kyoto Journey',
      destination: 'Kyoto, Japan',
      startDate: '2026-11-01',
      endDate: '2026-11-04',
      budget: 150000,
      currency: 'JPY',
    })
    const tripId = tripStore.trip.id

    expect(TripRepository.getTrip(tripId).places.length).toBe(0)

    PlaceRepository.createPlace(tripId, {
      name: 'Fushimi Inari Shrine',
      category: 'sight',
      latitude: 34.9671,
      longitude: 135.7727,
    })

    const updated = TripRepository.getTrip(tripId)
    expect(updated.places.length).toBe(1)
    expect(updated.places[0].name).toBe('Fushimi Inari Shrine')

    const summary = TripRepository.listTrips().find((t) => t.id === tripId)
    expect(summary.placeCount).toBe(1)
  })

  it('reflects budget mutations and expense calculations across tabs', () => {
    const tripStore = TripRepository.createTrip({
      title: 'Osaka Food Trip',
      destination: 'Osaka, Japan',
      startDate: '2026-11-10',
      endDate: '2026-11-14',
      budget: 100000,
      currency: 'JPY',
    })
    const tripId = tripStore.trip.id

    // Record an expense
    ExpenseRepository.createExpense(tripId, {
      name: 'Dotonbori Street Food',
      amount: 15000,
      category: 'food',
    })

    let current = TripRepository.getTrip(tripId)
    expect(current.expenses.length).toBe(1)
    expect(remainingBudget(current.trip.budget, current.expenses)).toBe(85000)

    // Edit budget
    TripRepository.updateTrip(tripId, { budget: 120000 })
    current = TripRepository.getTrip(tripId)
    expect(remainingBudget(current.trip.budget, current.expenses)).toBe(105000)
  })

  it('persists packing checks and food tried statuses across simulated reload', () => {
    SeedLoader.loadSeed(japanSeed, { force: true })
    const tripId = 'japan-demo-trip-2026'

    // Toggle packing item
    const packingItem = TripRepository.getTrip(tripId).packingItems[4] // currently false
    expect(packingItem.checked).toBe(false)
    PackingRepository.toggleItem(tripId, packingItem.id)

    // Toggle food tried
    const foodItem = TripRepository.getTrip(tripId).foodGuide[1] // currently false
    expect(foodItem.tried).toBe(false)
    ShopGuideRepository.toggleFoodTried(tripId, foodItem.id)

    // Re-read store (simulated reload from localStorage)
    const reloaded = TripRepository.getTrip(tripId)
    const reloadedPacking = reloaded.packingItems.find((p) => p.id === packingItem.id)
    const reloadedFood = reloaded.foodGuide.find((f) => f.id === foodItem.id)

    expect(reloadedPacking.checked).toBe(true)
    expect(reloadedFood.tried).toBe(true)
  })

  it('keeps two trips completely isolated without leaking data', () => {
    const tripA = TripRepository.createTrip({
      title: 'Trip A',
      destination: 'Tokyo',
      startDate: '2026-10-01',
      endDate: '2026-10-05',
    })
    const tripB = TripRepository.createTrip({
      title: 'Trip B',
      destination: 'Seoul',
      startDate: '2026-10-10',
      endDate: '2026-10-15',
    })

    PackingRepository.createItem(tripA.trip.id, { text: 'Tokyo Metro Pass' })
    expect(TripRepository.getTrip(tripA.trip.id).packingItems.length).toBe(1)
    expect(TripRepository.getTrip(tripB.trip.id).packingItems.length).toBe(0)

    ExpenseRepository.createExpense(tripB.trip.id, { name: 'Seoul Hotel', amount: 50000, category: 'accommodation' })
    expect(TripRepository.getTrip(tripA.trip.id).expenses.length).toBe(0)
    expect(TripRepository.getTrip(tripB.trip.id).expenses.length).toBe(1)
  })
})
