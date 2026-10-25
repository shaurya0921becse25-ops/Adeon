/**
 * @file OverviewTab.jsx - Native React Overview Tab
 * Faithfully restoring final/overview-tab.txt
 */

import React, { useState, useMemo } from 'react'
import {
  TripRepository,
  convertCurrencyMock,
  formatMoney,
  durationDays,
  packingProgress,
} from '../../../itinerary/index.js'
import { getDestinationById } from '../../data/destinations.js'
import './OverviewTab.css'

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const JAPAN_COLLECTIONS = [
  {
    name: 'Coffee worth crossing town for',
    count: 8,
    img: 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Onsen and public baths',
    count: 8,
    img: 'https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Next time: Japan',
    count: 8,
    img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Bookshops and paper',
    count: 4,
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Views worth the climb',
    count: 6,
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rainy day, indoors',
    count: 5,
    img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
  },
]

export default function OverviewTab({
  store,
  onNavigateToTab,
  onResetDemo,
  onEditTrip,
  onDuplicateTrip,
  onArchiveTrip,
  onDeleteTrip,
}) {
  const trip = store?.trip
  const places = useMemo(() => {
    if (store?.places && store.places.length > 0) return store.places
    const dest = getDestinationById(trip?.destination)
    return dest?.places || []
  }, [store?.places, trip?.destination])
  const packingItems = useMemo(() => store?.packingItems || [], [store?.packingItems])
  const expenses = useMemo(() => store?.expenses || [], [store?.expenses])

  // Currency Converter State
  const [fxAmount, setFxAmount] = useState(100)
  const [fxFrom, setFxFrom] = useState(() => (trip?.currency === 'JPY' ? 'USD' : 'JPY'))
  const [fxTo, setFxTo] = useState(() => (trip?.currency || 'JPY'))

  // Confirmation dialog for Reset Demo
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Derive global statistics across all trips in repository
  const allTrips = useMemo(() => TripRepository.listTrips(), [])
  const totalDaysAcrossTrips = useMemo(() => {
    return allTrips.reduce((acc, t) => acc + (durationDays(t?.startDate, t?.endDate) || 0), 0)
  }, [allTrips])
  const totalPlacesAcrossTrips = useMemo(() => {
    return allTrips.reduce((acc, t) => acc + (t.placeCount || 0), 0)
  }, [allTrips])
  const approximateDistanceKm = totalPlacesAcrossTrips * 850 + allTrips.length * 5200

  if (!trip) {
    return (
      <div className="overview-page-wrapper">
        <p>No trip selected.</p>
      </div>
    )
  }

  // Current trip derived values
  const tripDays = durationDays(trip.startDate, trip.endDate)
  const totalSpent = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
  const remainingBudget = (Number(trip.budget) || 0) - totalSpent
  const packingStats = packingProgress(packingItems)

  // Parse start and end date components for Hero Pass ticket
  const startParts = (trip.startDate || '2026-10-18').split('-').map(Number)
  const endParts = (trip.endDate || '2026-10-24').split('-').map(Number)
  const startDayNum = startParts[2] || 18
  const startMonthStr = MONTHS_SHORT[(startParts[1] || 10) - 1] || 'Oct'
  const endDayNum = endParts[2] || 24
  const endMonthStr = MONTHS_SHORT[(endParts[1] || 10) - 1] || 'Oct'

  // Calculate countdown to start date
  const now = new Date()
  const startDateObj = new Date(startParts[0] || 2026, (startParts[1] || 10) - 1, startDayNum)
  const diffDays = Math.max(0, Math.ceil((startDateObj - now) / 86400000))
  const countdownBadge = diffDays > 0 ? `${diffDays} days` : tripDays ? `${tripDays} days` : '11 days'

  // Conversion result
  const fxResult = convertCurrencyMock(fxAmount, fxFrom, fxTo)

  const handleSwapCurrencies = () => {
    const temp = fxFrom
    setFxFrom(fxTo)
    setFxTo(temp)
  }

  return (
    <div className="overview-page-wrapper">
      <div className="dashboard-container">
        
        {/* MAIN CONTENT COLUMN */}
        <main className="main-content">
          
          {/* HERO TRIP CARD */}
          <div className="hero-trip">
            <img
              src={
                trip.coverImageUrl ||
                'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80'
              }
              alt={trip.destination}
              className="hero-bg"
            />
            <div className="hero-scrim" />

            <div className="hero-content">
              <div className="hero-top">
                <div className="hero-badge">{countdownBadge}</div>
              </div>

              <div className="hero-title-block">
                <h2 className="hero-title" style={{ color: '#ffffff' }}>{trip.title || trip.destination}</h2>
              </div>

              {/* HERO PASS TICKET WITH CUTOUTS & DASHED DIVIDERS */}
              <div className="hero-pass-wrap">
                <div className="hero-pass" role="presentation">
                  <div className="hero-pass-inner">
                    
                    {/* Cell 1: Buddies */}
                    <div className="pass-cell buddies">
                      <div className="pass-label">Buddies</div>
                      <div className="buddies-avatars">
                        <div className="buddy-avatar">DU</div>
                      </div>
                      <div className="date-month" style={{ marginTop: 2 }}>1 traveler</div>
                    </div>

                    {/* Cell 2: Trip Dates */}
                    <div className="pass-cell dates-combined">
                      <div className="pass-label">Trip dates</div>
                      <div className="dates-row">
                        <div className="date-block">
                          <div className="date-num mono">{startDayNum}</div>
                          <div className="date-month">{startMonthStr}</div>
                        </div>
                        <div className="date-arrow">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </div>
                        <div className="date-block">
                          <div className="date-num mono">{endDayNum}</div>
                          <div className="date-month">{endMonthStr}</div>
                        </div>
                      </div>
                    </div>

                    {/* Cell 3: Countdown */}
                    <div className="pass-cell countdown">
                      <div className="pass-label">Trip starts in</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <div className="date-num mono">{diffDays}</div>
                        <div className="date-month">DAYS</div>
                      </div>
                    </div>

                    {/* Cell 4: Places Preview */}
                    <div
                      className="pass-cell places"
                      style={{ cursor: 'pointer' }}
                      title="Click to view in Plan tab"
                      onClick={() => onNavigateToTab && onNavigateToTab('plan')}
                    >
                      <div className="pass-label">Places</div>
                      <div className="places-preview">
                        {places.slice(0, 3).map((p) => (
                          <div key={p.id} className="place-av" title={p.name}>
                            <img
                              src={
                                p.imageUrl ||
                                'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=100&auto=format&fit=crop&q=80'
                              }
                              alt={p.name}
                            />
                          </div>
                        ))}
                        {places.length > 3 && (
                          <div className="place-more">+{places.length - 3}</div>
                        )}
                        {places.length === 0 && (
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>0 places</span>
                        )}
                      </div>
                      <div className="date-month">{places.length} DESTINATIONS</div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ATLAS METRICS SECTION */}
          <section className="atlas" aria-label="Travel statistics">
            
            <div className="atlas-card passport">
              <div className="label">Atlas · Countries visited</div>
              <div className="value mono">
                15 <span className="unit" style={{ color: 'rgba(255,255,255,0.55)' }}>of 195</span>
              </div>
              <div className="passport-flags">
                <span className="flag" title="Japan">
                  <img alt="JP" loading="lazy" src="https://flagcdn.com/w40/jp.png" />
                </span>
                <span className="flag" title="Switzerland">
                  <img alt="CH" loading="lazy" src="https://flagcdn.com/w40/ch.png" />
                </span>
                <span className="flag" title="Denmark">
                  <img alt="DK" loading="lazy" src="https://flagcdn.com/w40/dk.png" />
                </span>
                <span className="flag" title="Germany">
                  <img alt="DE" loading="lazy" src="https://flagcdn.com/w40/de.png" />
                </span>
                <span className="flag more">+11</span>
              </div>
            </div>

            <div className="atlas-card">
              <div>
                <div className="label">Trips total</div>
                <div className="value mono">{allTrips.length || 3}</div>
                <div className="delta">{places.length} places mapped</div>
              </div>
              <svg className="spark" width="80" height="36" viewBox="0 0 80 36">
                <polyline
                  points="0,30 12,26 22,28 32,18 44,22 56,10 68,14 80,4"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="atlas-card">
              <div>
                <div className="label">Days traveled</div>
                <div className="value mono">
                  {totalDaysAcrossTrips || 28} <span className="unit">days</span>
                </div>
                <div className="delta">across all trips</div>
              </div>
              <svg className="spark" width="80" height="36" viewBox="0 0 80 36">
                <path
                  d="M0 30 Q10 24 20 26 T40 20 T60 14 T80 10"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* DISTANCE FLOWN */}
            <div className="atlas-card">
              <div>
                <div className="label">Distance flown</div>
                <div className="value mono">
                  {(approximateDistanceKm / 1000).toFixed(0)} <span className="unit">km</span>
                </div>
                <div className="delta">≈ 0.25× around the equator</div>
              </div>
              <svg className="spark" width="80" height="36" viewBox="0 0 80 36">
                <path
                  d="M0 32 Q25 8 50 16 T80 6"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

          </section>

          {/* PLACES & DESTINATIONS RESTORED SECTION */}
          <section className="overview-places-section" aria-label="Itinerary Places">
            <div className="section-header">
              <div className="section-title">
                <h3>Places &amp; Itinerary Highlights</h3>
                <span className="places-count-tag">{places.length} places</span>
              </div>
              <button
                type="button"
                className="view-all-btn"
                onClick={() => onNavigateToTab && onNavigateToTab('plan')}
              >
                Open in Plan Tab &rarr;
              </button>
            </div>

            <div className="overview-places-grid">
              {places.map((place) => {
                const catColor =
                  place.category === 'nature'
                    ? '#22c55e'
                    : place.category === 'restaurant'
                    ? '#ef4444'
                    : place.category === 'activity'
                    ? '#14b8a6'
                    : '#3b82f6'

                return (
                  <div
                    key={place.id}
                    className="overview-place-card"
                    onClick={() => onNavigateToTab && onNavigateToTab('plan')}
                    title={`View ${place.name} in Plan Tab`}
                  >
                    <div className="place-thumb-wrap">
                      <img
                        src={
                          place.imageUrl ||
                          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&auto=format&fit=crop&q=80'
                        }
                        alt={place.name}
                      />
                      <span className="place-cat-chip" style={{ background: catColor }}>
                        {place.category || 'Sight'}
                      </span>
                    </div>
                    <div className="place-card-body">
                      <h4 className="place-title">{place.name}</h4>
                      <p className="place-desc">{place.note || 'Highlights in Tokyo, Japan.'}</p>
                      <div className="place-meta-row">
                        {place.estimatedCost > 0 ? (
                          <span className="place-cost">
                            {formatMoney(place.estimatedCost, trip.currency || 'JPY')}
                          </span>
                        ) : (
                          <span style={{ color: '#059669', fontWeight: 600 }}>Free entry</span>
                        )}
                        <span className="place-tip">
                          {place.tip ? `💡 ${place.tip}` : 'Verified Japan attraction'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

        </main>

        {/* SIDEBAR TOOLS */}
        <aside className="sidebar overview-sidebar">
          
          {/* CURRENCY / TOTAL COST */}
          <div className="tool">
            <div className="tool-head">
              <div className="tool-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                Total Cost &amp; FX
              </div>
              <button
                type="button"
                className="tool-action"
                aria-label="Refresh rates"
                title="Refresh rates"
                onClick={() => setFxAmount((prev) => prev)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </button>
            </div>

            <div className="fx-input">
              <div className="fx-field">
                <div className="lbl">From</div>
                <input
                  className="mono"
                  type="number"
                  min="0"
                  value={fxAmount}
                  onChange={(e) => setFxAmount(Math.max(0, Number(e.target.value) || 0))}
                />
                <select
                  className="fx-select"
                  aria-label="From currency"
                  value={fxFrom}
                  onChange={(e) => setFxFrom(e.target.value)}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  <option value="ISK">ISK</option>
                </select>
              </div>

              <button
                type="button"
                className="fx-swap"
                aria-label="Swap currencies"
                title="Swap currencies"
                onClick={handleSwapCurrencies}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 3 4 4-4 4" />
                  <path d="M20 7H4" />
                  <path d="m8 21-4-4 4-4" />
                  <path d="M4 17h16" />
                </svg>
              </button>

              <div className="fx-field">
                <div className="lbl">To</div>
                <input
                  className="mono"
                  type="text"
                  readOnly
                  value={fxResult.result.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                />
                <select
                  className="fx-select"
                  aria-label="To currency"
                  value={fxTo}
                  onChange={(e) => setFxTo(e.target.value)}
                >
                  <option value="JPY">JPY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  <option value="ISK">ISK</option>
                </select>
              </div>
            </div>

            <div className="fx-rate">
              <span>
                1 {fxFrom} = {fxResult.rate.toFixed(4)} {fxTo} (Demo rate)
              </span>
            </div>
          </div>

          {/* HIGHLIGHTS / COLLECTIONS WIDGET */}
          <div className="tool">
            <div className="tool-head">
              <div className="tool-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
                Highlights &amp; Collections
              </div>
              <button
                type="button"
                className="tool-action"
                aria-label="Collections"
                title="Collections"
                onClick={() => onNavigateToTab && onNavigateToTab('plan')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="col-badges">
              {JAPAN_COLLECTIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className="col-badge"
                  onClick={() => onNavigateToTab && onNavigateToTab('plan')}
                >
                  <img className="col-badge-media" alt="" src={c.img} />
                  <div className="col-badge-tint" />
                  <div className="col-badge-body">
                    <span className="col-badge-name">{c.name}</span>
                    <span className="col-badge-count">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {c.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* BUDGET OVERVIEW */}
          <div className="tool">
            <div className="tool-head">
              <span className="tool-title">Budget Overview</span>
              <button
                type="button"
                onClick={() => onNavigateToTab && onNavigateToTab('cost')}
                style={{
                  background: 'none',
                  border: 0,
                  fontSize: 12,
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                View Cost Tab &rarr;
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Total Budget:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  {formatMoney(trip.budget || 0, trip.currency || 'JPY')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Total Spent:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  {formatMoney(totalSpent, trip.currency || 'JPY')}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: 8,
                }}
              >
                <span style={{ color: '#64748b' }}>Remaining:</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: remainingBudget >= 0 ? '#16a34a' : '#dc2626',
                  }}
                >
                  {formatMoney(remainingBudget, trip.currency || 'JPY')}
                </span>
              </div>
            </div>
          </div>

          {/* PACKING CHECKLIST PREVIEW */}
          <div className="tool">
            <div className="tool-head">
              <span className="tool-title">Packing Checklist</span>
              <button
                type="button"
                onClick={() => onNavigateToTab && onNavigateToTab('lists')}
                style={{
                  background: 'none',
                  border: 0,
                  fontSize: 12,
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                View Lists &rarr;
              </button>
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: '#64748b' }}>
                  {packingStats.completed} of {packingStats.total} packed
                </span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{packingStats.pct}%</span>
              </div>
              <div
                style={{
                  height: 6,
                  background: '#f1f5f9',
                  borderRadius: 99,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${packingStats.pct}%`,
                    height: '100%',
                    background: '#10b981',
                    borderRadius: 99,
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>
          </div>

        </aside>

      </div>

      {/* Confirmation Dialog for Demo Reset */}
      {showResetConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 18,
              padding: 24,
              maxWidth: 420,
              width: '100%',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
            }}
          >
            <h4 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Reset Japan Demo Trip?
            </h4>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
              This will restore the 7 verified Japanese demo places, visits, food guide, and transport bookings to their original state.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false)
                  if (onResetDemo) onResetDemo()
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: 0,
                  background: '#0f172a',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
