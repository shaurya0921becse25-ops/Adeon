import { describe, it, expect } from 'vitest'
import { DESTINATIONS, DESTINATION_LIST, getDestinationById } from '../../src/data/destinations.js'
import { generateItinerary } from '../../src/services/itineraryGenerator.js'

describe('Phase 4: Multi-Destination Demo Datasets & Itinerary Generator', () => {
  const destinationKeys = ['shimla', 'jaipur', 'japan', 'dubai', 'chandigarh']

  it('provides all 5 required destinations with correct metadata', () => {
    expect(DESTINATION_LIST.length).toBe(5)
    destinationKeys.forEach((key) => {
      const dest = DESTINATIONS[key]
      expect(dest).toBeDefined()
      expect(dest.id).toBe(key)
      expect(dest.name).toBeTruthy()
      expect(dest.currency).toBeTruthy()
      expect(typeof dest.defaultBudget).toBe('number')
      expect(dest.defaultBudget).toBeGreaterThan(0)
      expect(typeof dest.coordinates.lat).toBe('number')
      expect(typeof dest.coordinates.lng).toBe('number')
      expect(dest.heroImage).toBeTruthy()
    })
  })

  it('each of the 5 destinations has at least 7 verified place records (total >= 35)', () => {
    let totalPlaces = 0
    destinationKeys.forEach((key) => {
      const dest = DESTINATIONS[key]
      expect(dest.places.length).toBeGreaterThanOrEqual(7)
      totalPlaces += dest.places.length

      dest.places.forEach((p) => {
        expect(p.id).toBeTruthy()
        expect(p.name).toBeTruthy()
        expect(p.description || p.note).toBeTruthy()
        expect(p.image || p.imageUrl).toBeTruthy()
        expect(typeof p.latitude).toBe('number')
        expect(typeof p.longitude).toBe('number')
        expect(p.currency).toBeTruthy()
        expect(typeof p.rating).toBe('number')
        expect(p.rating).toBeGreaterThan(0)
      })
    })
    expect(totalPlaces).toBeGreaterThanOrEqual(35)
  })

  it('destination lookup handles casing and aliases like Tokyo or Kyoto', () => {
    expect(getDestinationById('SHIMLA').id).toBe('shimla')
    expect(getDestinationById('Jaipur, India').id).toBe('jaipur')
    expect(getDestinationById('Tokyo').id).toBe('japan')
    expect(getDestinationById('Kyoto').id).toBe('japan')
    expect(getDestinationById('Dubai').id).toBe('dubai')
    expect(getDestinationById('Chandigarh').id).toBe('chandigarh')
  })

  it('generates a 3-day itinerary with distributed places and budget expenses', () => {
    const res = generateItinerary({
      destinationId: 'dubai',
      durationDays: 3,
      budget: 10000,
    })

    expect(res.days.length).toBe(3)
    expect(res.destination.id).toBe('dubai')
    expect(res.currency).toBe('AED')
    expect(res.totalBudget).toBe(10000)
    expect(res.visits.length).toBeGreaterThanOrEqual(3)
    expect(res.expenses.length).toBe(5)

    // Sum of demo expenses should match total budget
    const sumExpenses = res.expenses.reduce((s, e) => s + e.amount, 0)
    expect(sumExpenses).toBe(10000)
  })

  it('generates a 7-day itinerary for Shimla with correct INR currency', () => {
    const res = generateItinerary({
      destinationId: 'shimla',
      durationDays: 7,
      budget: 40000,
    })

    expect(res.days.length).toBe(7)
    expect(res.currency).toBe('INR')
    expect(res.totalBudget).toBe(40000)
    expect(res.visits.length).toBe(7)
    res.visits.forEach((v) => {
      expect(v.startTime).toBeTruthy()
      expect(v.endTime).toBeTruthy()
    })
  })
})
