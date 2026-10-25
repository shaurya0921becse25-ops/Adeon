/**
 * @file App.jsx - Main Application Router & Shell
 */

import React, { useEffect, useState } from 'react'
import MainPage from './components/MainPage.jsx'
import TripApp from './components/TripApp.jsx'
import { SeedLoader, TripRepository } from '../itinerary/index.js'

function getInitialRoute() {
  const primaryId = SeedLoader.ensureInitialSeedLoaded()
  const path = window.location.pathname
  if (path.startsWith('/trips/')) {
    const parts = path.split('/').filter(Boolean)
    const tripId = parts[1] || primaryId
    return { page: 'trip', tripId }
  }
  if (path === '/trips') {
    return { page: 'trip', tripId: primaryId }
  }
  return { page: 'main', tripId: null }
}

export default function App() {
  const [route, setRoute] = useState(getInitialRoute)
  const [overviewThenPlan, setOverviewThenPlan] = useState(false)

  // Listen to popstate for browser Back / Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setRoute(getInitialRoute())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateToTrip = (tripId, options = {}) => {
    const id = tripId || SeedLoader.ensureInitialSeedLoaded()
    window.history.pushState({}, '', `/trips/${id}`)
    setOverviewThenPlan(options.overviewThenPlan === true)
    setRoute({ page: 'trip', tripId: id })
  }

  const navigateToMain = () => {
    window.history.pushState({}, '', '/')
    setRoute({ page: 'main', tripId: null })
  }

  if (route.page === 'main') {
    return (
      <MainPage
        onNavigateToTrip={(id) => navigateToTrip(id, { overviewThenPlan: true })}
      />
    )
  }

  return (
    <TripApp
      tripId={route.tripId}
      onNavigateToMain={navigateToMain}
      overviewThenPlan={overviewThenPlan}
      onEditTrip={(id) => {
        navigateToMain()
      }}
      onDuplicateTrip={(id) => {
        const dup = TripRepository.duplicateTrip(id)
        navigateToTrip(dup.trip.id)
      }}
      onArchiveTrip={(id) => {
        TripRepository.archiveTrip(id)
        navigateToMain()
      }}
      onDeleteTrip={(id) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
          TripRepository.deleteTrip(id)
          navigateToMain()
        }
      }}
    />
  )
}
