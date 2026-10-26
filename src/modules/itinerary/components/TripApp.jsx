/**
 * @file TripApp.jsx - Main Trip Workspace Shell (100% Native React, No Iframes)
 */

import React, { useState } from 'react'
import { useTripStore } from '../hooks/useTripStore.js'
import TripTabs from './TripTabs.jsx'
import OverviewTab from './TripWorkspace/OverviewTab.jsx'
import PlanTab from './TripWorkspace/PlanTab.jsx'
import ShopTab from './TripWorkspace/ShopTab.jsx'
import ListsTab from './TripWorkspace/ListsTab.jsx'
import CostTab from './TripWorkspace/CostTab.jsx'
import TransportTab from './TripWorkspace/TransportTab.jsx'
import './trip.css'

export default function TripApp({
  tripId,
  onNavigateToMain,
  overviewThenPlan = false,
  onEditTrip,
  onDuplicateTrip,
  onArchiveTrip,
  onDeleteTrip,
}) {
  const [activeTab, setActiveTab] = useState(overviewThenPlan ? 'overview' : 'plan')

  const {
    store,
    isLoading,
    notFound,
    updateTrip,
    createPlace,
    updatePlace,
    deletePlace,
    createVisit,
    reorderVisits,
    deleteVisit,
    updateVisit,
    createExpense,
    deleteExpense,
    createBooking,
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
  } = useTripStore(tripId)

  if (isLoading) {
    return (
      <div className="trek-app" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'rgb(238, 242, 236)' }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#64748b' }}>Loading your itinerary...</p>
      </div>
    )
  }

  if (notFound || !store) {
    return (
      <div className="trek-app" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#f8fafc', padding: 24, textAlign: 'center' }}>
        <div style={{ maxWidth: 440, background: '#ffffff', padding: 36, borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Trip Not Found</h2>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
            The trip you requested does not exist or has been deleted.
          </p>
          <button
            type="button"
            onClick={onNavigateToMain}
            style={{
              padding: '10px 24px',
              borderRadius: 12,
              border: 0,
              background: '#0f172a',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Return to My Trips
          </button>
        </div>
      </div>
    )
  }

  let content = null
  switch (activeTab) {
    case 'overview':
      content = (
        <OverviewTab
          store={store}
          onNavigateToTab={setActiveTab}
          onResetDemo={resetDemoSeed}
          onEditTrip={onEditTrip}
          onDuplicateTrip={onDuplicateTrip}
          onArchiveTrip={onArchiveTrip}
          onDeleteTrip={onDeleteTrip}
        />
      )
      break
    case 'plan':
      content = (
        <PlanTab
          store={store}
          createPlace={createPlace}
          updatePlace={updatePlace}
          deletePlace={deletePlace}
          createVisit={createVisit}
          reorderVisits={reorderVisits}
          deleteVisit={deleteVisit}
          updateVisit={updateVisit}
          updateTrip={updateTrip}
        />
      )
      break
    case 'shop':
      content = (
        <ShopTab
          store={store}
          toggleFoodTried={toggleFoodTried}
          toggleShopBought={toggleShopBought}
        />
      )
      break
    case 'lists':
      content = (
        <ListsTab
          store={store}
          createPackingItem={createPackingItem}
          togglePackingItem={togglePackingItem}
          updatePackingItem={updatePackingItem}
          deletePackingItem={deletePackingItem}
          createTodoItem={createTodoItem}
          toggleTodoItem={toggleTodoItem}
          updateTodoItem={updateTodoItem}
          deleteTodoItem={deleteTodoItem}
        />
      )
      break
    case 'cost':
      content = (
        <CostTab
          store={store}
          createExpense={createExpense}
          deleteExpense={deleteExpense}
          updateTrip={updateTrip}
        />
      )
      break
    case 'transport':
      content = (
        <TransportTab
          store={store}
          createBooking={createBooking}
          deleteBooking={deleteBooking}
          createExpense={createExpense}
        />
      )
      break
    default:
      content = <PlanTab store={store} />
  }

  return (
    <div className="trek-app">
      <TripTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        onBack={onNavigateToMain}
      />
      {content}
      <span className="sr-only" role="status" aria-live="polite">
        {activeTab} tab
      </span>
    </div>
  )
}
