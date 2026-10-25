import { describe, it, expect, beforeEach } from 'vitest'
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
  durationDays,
  sumExpenses,
  remainingBudget,
  expensesByCategory,
  convertCurrencyMock,
  packingProgress,
  todoProgress,
} from '../../itinerary/index.js'
import japanSeed from '../../data/seeds/japan.json'

describe('Pure Calculations', () => {
  it('calculates duration in days correctly', () => {
    expect(durationDays('2026-10-18', '2026-10-24')).toBe(7)
    expect(durationDays('2026-10-18', '2026-10-18')).toBe(1)
    expect(durationDays('2026-10-18', '2026-10-19')).toBe(2)
  })

  it('calculates expense totals and category breakdowns', () => {
    const expenses = [
      { id: '1', amount: 5000, category: 'food' },
      { id: '2', amount: 15000, category: 'accommodation' },
      { id: '3', amount: 2000, category: 'food' },
    ]
    expect(sumExpenses(expenses)).toBe(22000)
    expect(remainingBudget(30000, expenses)).toBe(8000)

    const cats = expensesByCategory(expenses)
    expect(cats.food).toBe(7000)
    expect(cats.accommodation).toBe(15000)
    expect(cats.transport).toBe(0)
  })

  it('calculates packing and to-do progress', () => {
    const packing = [
      { id: '1', checked: true },
      { id: '2', checked: false },
      { id: '3', checked: true },
      { id: '4', checked: true },
    ]
    expect(packingProgress(packing)).toEqual({ completed: 3, total: 4, pct: 75 })

    const todos = [
      { id: '1', done: false },
      { id: '2', done: true },
    ]
    expect(todoProgress(todos)).toEqual({ completed: 1, total: 2, pct: 50 })
  })

  it('provides a truthful offline mock currency converter', () => {
    const conv = convertCurrencyMock(100, 'USD', 'JPY')
    expect(conv.isMock).toBe(true)
    expect(conv.result).toBe(15500)

    const convReverse = convertCurrencyMock(15500, 'JPY', 'USD')
    expect(convReverse.result).toBe(100)
  })
})

describe('Trip Repository & Seed Loader', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  it('loads Japan seed idempotently without duplicates', () => {
    const res1 = SeedLoader.loadSeed(japanSeed)
    expect(res1.loaded).toBe(true)
    expect(res1.tripId).toBe('japan-demo-trip-2026')

    const res2 = SeedLoader.loadSeed(japanSeed)
    expect(res2.loaded).toBe(false)
    expect(res2.reason).toBe('already_exists')

    const trips = TripRepository.listTrips()
    expect(trips.filter(t => t.id === 'japan-demo-trip-2026').length).toBe(1)
  })

  it('creates and retrieves a new trip', () => {
    const created = TripRepository.createTrip({
      title: 'Hokkaido Winter Journey',
      destination: 'Sapporo, Japan',
      startDate: '2026-12-01',
      endDate: '2026-12-05',
      currency: 'JPY',
      budget: 200000,
    })

    expect(created.trip.id).toBeDefined()
    expect(created.trip.title).toBe('Hokkaido Winter Journey')
    expect(created.days.length).toBe(5)

    const retrieved = TripRepository.getTrip(created.trip.id)
    expect(retrieved).not.toBeNull()
    expect(retrieved?.trip.destination).toBe('Sapporo, Japan')
  })

  it('validates dates on trip creation and rejects inverted dates', () => {
    expect(() => {
      TripRepository.createTrip({
        title: 'Invalid Trip',
        destination: 'Somewhere',
        startDate: '2026-12-10',
        endDate: '2026-12-05',
      })
    }).toThrow()
  })

  it('duplicates a trip with new IDs and isolated entities', () => {
    SeedLoader.loadSeed(japanSeed, { force: true })
    const dup = TripRepository.duplicateTrip('japan-demo-trip-2026')

    expect(dup.trip.id).not.toBe('japan-demo-trip-2026')
    expect(dup.trip.title).toContain('(Copy)')
    expect(dup.places.length).toBe(7)
    expect(dup.places[0].id).not.toBe(japanSeed.places[0].id)
    expect(dup.places[0].tripId).toBe(dup.trip.id)

    // Ensure changing duplicated place does not affect original
    PlaceRepository.updatePlace(dup.trip.id, dup.places[0].id, { name: 'Renamed Place' })
    const original = TripRepository.getTrip('japan-demo-trip-2026')
    expect(original?.places[0].name).toBe(japanSeed.places[0].name)
  })

  it('deletes a trip cleanly', () => {
    const created = TripRepository.createTrip({
      title: 'Temporary Trip',
      destination: 'Tokyo',
      startDate: '2026-11-01',
      endDate: '2026-11-03',
    })
    expect(TripRepository.getTrip(created.trip.id)).not.toBeNull()

    TripRepository.deleteTrip(created.trip.id)
    expect(TripRepository.getTrip(created.trip.id)).toBeNull()
  })
})

describe('Place & Visit Cross-Trip Protection', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  it('creates place with verified coordinates', () => {
    const trip = TripRepository.createTrip({
      title: 'Test Trip',
      destination: 'Tokyo',
      startDate: '2026-10-01',
      endDate: '2026-10-03',
    })

    const place = PlaceRepository.createPlace(trip.trip.id, {
      name: 'Senso-ji',
      category: 'sight',
      latitude: 35.7148,
      longitude: 139.7967,
    })

    expect(place.id).toBeDefined()
    expect(place.latitude).toBe(35.7148)
    expect(place.longitude).toBe(139.7967)

    const list = PlaceRepository.listPlaces(trip.trip.id)
    expect(list.length).toBe(1)
  })

  it('prevents cross-trip visit references', () => {
    const trip1 = TripRepository.createTrip({
      title: 'Trip 1',
      destination: 'Tokyo',
      startDate: '2026-10-01',
      endDate: '2026-10-03',
    })
    const trip2 = TripRepository.createTrip({
      title: 'Trip 2',
      destination: 'Kyoto',
      startDate: '2026-10-01',
      endDate: '2026-10-03',
    })

    const place1 = PlaceRepository.createPlace(trip1.trip.id, {
      name: 'Place in Trip 1',
      category: 'sight',
    })

    // Attempting to schedule place1 in trip2 must throw CROSS_TRIP_REFERENCE
    expect(() => {
      VisitRepository.createVisit(trip2.trip.id, {
        dayId: trip2.days[0].id,
        placeId: place1.id,
      })
    }).toThrow()
  })
})

describe('Expense & Transport Bookings', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  it('links transport booking to expense and prevents duplicate double-counting', () => {
    const trip = TripRepository.createTrip({
      title: 'Budget Test',
      destination: 'Tokyo',
      startDate: '2026-10-01',
      endDate: '2026-10-03',
      budget: 100000,
      currency: 'JPY',
    })

    const booking = TransportRepository.createBooking(trip.trip.id, {
      type: 'flight',
      status: 'confirmed',
      title: 'Flight to Haneda',
      price: 45000,
    })

    // First link creates expense successfully
    const exp = ExpenseRepository.createExpense(trip.trip.id, {
      name: 'Flight Booking Expense',
      amount: booking.price,
      category: 'transport',
      linkedTransportId: booking.id,
    })
    expect(exp.id).toBeDefined()

    // Second link with same linkedTransportId throws DUPLICATE_EXPENSE
    expect(() => {
      ExpenseRepository.createExpense(trip.trip.id, {
        name: 'Duplicate Flight',
        amount: booking.price,
        category: 'transport',
        linkedTransportId: booking.id,
      })
    }).toThrow()
  })
})
