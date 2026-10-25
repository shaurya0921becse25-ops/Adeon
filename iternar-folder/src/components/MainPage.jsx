/**
 * @file MainPage.jsx - Native React Rebuild of Main Page & Trip Manager
 */

import React, { useState, useEffect, useRef } from 'react'
import { TripRepository, SeedLoader, durationDays, formatDateRange } from '../../itinerary/index.js'
import { generateItinerary } from '../services/itineraryGenerator.js'
import { getDestinationById, DESTINATION_LIST } from '../data/destinations.js'
import { getFoodGuideForDestination } from '../data/foodGuideData.js'
import './MainPage.css'

export default function MainPage({ onNavigateToTrip }) {
  // Ensure the single Japan demo trip is seeded on fresh installation
  useEffect(() => {
    SeedLoader.ensureInitialSeedLoaded()
  }, [])

  const [trips, setTrips] = useState([])
  const [filter, setFilter] = useState('planned') // 'planned' | 'archived' | 'completed'

  // Form states
  const [editingTripId, setEditingTripId] = useState(null)
  const [destination, setDestination] = useState('Japan')
  const [title, setTitle] = useState('Tokyo & Beyond Discovery')
  const [description, setDescription] = useState('Summer trip exploring Tokyo, Kyoto, and Mt. Fuji.')
  const [startDate, setStartDate] = useState('2026-11-05')
  const [endDate, setEndDate] = useState('2026-11-18')
  const [budget, setBudget] = useState(3500)
  const [currency, setCurrency] = useState('USD')
  const [tags, setTags] = useState(['Dinner', 'Adventure', 'Trek'])
  const [coverImageUrl, setCoverImageUrl] = useState('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80')

  // Tag creation
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newTagText, setNewTagText] = useState('')

  // Date picker popover state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2026, 10, 1))
  const [choosingEndDate, setChoosingEndDate] = useState(false)

  // Confirmation dialog state
  const [confirmDeleteTripId, setConfirmDeleteTripId] = useState(null)

  const destinationInputRef = useRef(null)
  const calendarRef = useRef(null)

  const loadTrips = () => {
    const list = TripRepository.listTrips()
    setTrips(list)
  }

  useEffect(() => {
    loadTrips()
  }, [])

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setIsCalendarOpen(false)
      }
    }
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCalendarOpen])

  const calculatedDays = durationDays(startDate, endDate)

  const handleSaveItinerary = (e) => {
    e?.preventDefault()
    if (!destination.trim()) {
      alert('Please enter a destination.')
      return
    }

    const tripTitle = title.trim() || destination.trim()

    if (editingTripId) {
      TripRepository.updateTrip(editingTripId, {
        title: tripTitle,
        destination: destination.trim(),
        description: description.trim(),
        startDate,
        endDate,
        budget: Number(budget) || 0,
        currency,
        tags,
        coverImageUrl,
      })
      const savedId = editingTripId
      setEditingTripId(null)
      loadTrips()
      if (onNavigateToTrip) onNavigateToTrip(savedId)
    } else {
      const destInfo = getDestinationById(destination)
      const numDays = Math.max(1, durationDays(startDate, endDate) || 7)
      const parsedBudget = Number(budget) > 0 ? Number(budget) : destInfo.defaultBudget
      const generated = generateItinerary({
        destinationId: destInfo.id,
        durationDays: numDays,
        budget: parsedBudget,
        startDate,
      })

      const created = TripRepository.createTrip({
        title: tripTitle,
        destination: destination.trim(),
        description: description.trim() || destInfo.description,
        startDate,
        endDate,
        budget: parsedBudget,
        currency: currency || destInfo.currency,
        tags,
        coverImageUrl: coverImageUrl || destInfo.heroImage,
        places: generated.places,
        days: generated.days,
        visits: generated.visits,
        expenses: generated.expenses,
        foodGuide: getFoodGuideForDestination(destInfo.id),
      })
      loadTrips()
      if (onNavigateToTrip) onNavigateToTrip(created.trip.id)
    }
  }

  const handleEditTrip = (e, trip) => {
    e.stopPropagation()
    setEditingTripId(trip.id)
    setTitle(trip.title)
    setDestination(trip.destination)
    setDescription(trip.description || '')
    setStartDate(trip.startDate)
    setEndDate(trip.endDate)
    setBudget(trip.budget || 0)
    setCurrency(trip.currency || 'USD')
    setTags(trip.tags || [])
    if (trip.coverImageUrl) setCoverImageUrl(trip.coverImageUrl)

    window.scrollTo({ top: 0, behavior: 'smooth' })
    destinationInputRef.current?.focus()
  }

  const handleDuplicateTrip = (e, tripId) => {
    e.stopPropagation()
    TripRepository.duplicateTrip(tripId)
    loadTrips()
  }

  const handleArchiveTrip = (e, tripId) => {
    e.stopPropagation()
    TripRepository.archiveTrip(tripId)
    loadTrips()
  }

  const handleDeleteTripConfirm = () => {
    if (confirmDeleteTripId) {
      TripRepository.deleteTrip(confirmDeleteTripId)
      setConfirmDeleteTripId(null)
      loadTrips()
    }
  }

  const handleAddTag = () => {
    const trimmed = newTagText.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setNewTagText('')
    setIsAddingTag(false)
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  // Calendar rendering helper
  const renderCalendarDays = () => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const prevMonthDays = new Date(year, month, 0).getDate()

    const dayCells = []

    for (let i = 0; i < 42; i++) {
      const offset = i - firstWeekday + 1
      let cellDate
      let isOutside = false

      if (offset < 1) {
        cellDate = new Date(year, month - 1, prevMonthDays + offset)
        isOutside = true
      } else if (offset > daysInMonth) {
        cellDate = new Date(year, month + 1, offset - daysInMonth)
        isOutside = true
      } else {
        cellDate = new Date(year, month, offset)
      }

      const y = cellDate.getFullYear()
      const m = String(cellDate.getMonth() + 1).padStart(2, '0')
      const d = String(cellDate.getDate()).padStart(2, '0')
      const isoStr = `${y}-${m}-${d}`

      const isStart = isoStr === startDate
      const isEnd = isoStr === endDate
      const isInRange = isoStr >= startDate && isoStr <= endDate

      let className = 'calendar-day'
      if (isOutside) className += ' is-outside'
      if (isStart) className += ' is-range-start'
      if (isEnd) className += ' is-range-end'
      if (isInRange) className += ' is-in-range'

      dayCells.push(
        <button
          key={isoStr}
          type="button"
          className={className}
          onClick={() => {
            if (!choosingEndDate) {
              setStartDate(isoStr)
              setEndDate(isoStr)
              setChoosingEndDate(true)
            } else {
              if (isoStr < startDate) {
                setEndDate(startDate)
                setStartDate(isoStr)
              } else {
                setEndDate(isoStr)
              }
              setChoosingEndDate(false)
              setIsCalendarOpen(false)
            }
          }}
        >
          {cellDate.getDate()}
        </button>
      )
    }

    return dayCells
  }

  const filteredTrips = trips.filter(t => {
    if (filter === 'archived') return t.status === 'archived'
    if (filter === 'completed') return t.status === 'completed'
    return t.status !== 'archived' && t.status !== 'completed'
  })

  // Calendar .ics export
  const handleExportICS = () => {
    const plannedTrips = trips.filter(t => t.status === 'planned')
    if (plannedTrips.length === 0) {
      alert('No scheduled trips to subscribe.')
      return
    }
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//WanderWise//Travel Planner//EN',
    ]

    for (const trip of plannedTrips) {
      const s = trip.startDate.replace(/-/g, '')
      const e = trip.endDate.replace(/-/g, '')
      icsContent.push(
        'BEGIN:VEVENT',
        `SUMMARY:${trip.title} (${trip.destination})`,
        `DESCRIPTION:${trip.description || ''}`,
        `DTSTART;VALUE=DATE:${s}`,
        `DTEND;VALUE=DATE:${e}`,
        'END:VEVENT'
      )
    }
    icsContent.push('END:VCALENDAR')

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wanderwise_trips.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="main-page-shell">
      <div className="main-page-backdrop-overlay" />

      <main className="main-page-content">
        <header className="page-intro">
          <p className="page-eyebrow">YOUR NEXT ADVENTURE STARTS HERE</p>
          <h1>Make every journey unforgettable.</h1>
          <p className="page-tagline">A little planning. A lot more exploring.</p>
        </header>

        {/* TOP SECTION: Itinerary Info Form */}
        <section className="main-glass-panel" aria-label="Itinerary Form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0f172a' }}>
              {editingTripId ? 'Edit Itinerary' : 'Itinerary Info'}
            </h2>
            {editingTripId && (
              <button
                type="button"
                onClick={() => {
                  setEditingTripId(null)
                  setDestination('Japan')
                  setTitle('Tokyo & Beyond Discovery')
                  setDescription('Summer trip exploring Tokyo, Kyoto, and Mt. Fuji.')
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '4px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSaveItinerary}>
            <div className="form-grid">
              {/* Left Column: Cover & Main Info */}
              <div className="sub-panel">
                <div>
                  <label className="panel-label">Cover Image</label>
                  <div
                    style={{
                      height: 120,
                      borderRadius: 12,
                      border: '2px dashed #cbd5e1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onClick={() => {
                      const url = window.prompt('Enter image URL or leave default:', coverImageUrl)
                      if (url) setCoverImageUrl(url)
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      color: '#ffffff',
                      fontSize: 13,
                      fontWeight: 600,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                      {coverImageUrl ? 'Change cover image' : 'Add cover image'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="panel-label">
                    Destination <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    ref={destinationInputRef}
                    required
                    type="text"
                    placeholder="e.g. Japan"
                    className="input-control"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {DESTINATION_LIST.map((dest) => {
                      const isActive = destination.toLowerCase().includes(dest.id)
                      return (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => {
                            setDestination(dest.name)
                            setTitle(dest.title)
                            setDescription(dest.description)
                            setCoverImageUrl(dest.heroImage)
                            setBudget(dest.defaultBudget)
                            setCurrency(dest.currency)
                          }}
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            border: isActive ? '1px solid #2563eb' : '1px solid #cbd5e1',
                            background: isActive ? '#2563eb' : '#ffffff',
                            color: isActive ? '#ffffff' : '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {dest.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="panel-label">Trip Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Tokyo & Beyond Discovery"
                    className="input-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="panel-label">Description</label>
                  <textarea
                    rows={2}
                    placeholder="What is this trip about?"
                    className="input-control"
                    style={{ resize: 'none' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Column: Dates, Budget, Tags */}
              <div className="sub-panel">
                <div className="date-range-container" ref={calendarRef}>
                  <label className="panel-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path d="M8 2v4M16 2v4M3 10h18" />
                    </svg>
                    Trip Dates
                  </label>
                  <button
                    type="button"
                    className="date-range-trigger"
                    onClick={() => {
                      setIsCalendarOpen(!isCalendarOpen)
                      setChoosingEndDate(false)
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path d="M8 2v4M16 2v4M3 10h18" />
                    </svg>
                    <span>{formatDateRange(startDate, endDate)}</span>
                  </button>

                  {isCalendarOpen && (
                    <div className="date-range-calendar" role="dialog" aria-label="Choose trip date range">
                      <div className="calendar-header">
                        <button
                          type="button"
                          className="calendar-nav"
                          onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                        >
                          ‹
                        </button>
                        <strong>
                          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(calendarMonth)}
                        </strong>
                        <button
                          type="button"
                          className="calendar-nav"
                          onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                        >
                          ›
                        </button>
                      </div>
                      <div className="calendar-weekdays">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      </div>
                      <div className="calendar-days">
                        {renderCalendarDays()}
                      </div>
                      <p className="calendar-hint">
                        {choosingEndDate ? 'Now select an end date' : 'Select a start date'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="panel-label">Number of Days</label>
                  <input
                    type="text"
                    readOnly
                    className="input-control"
                    value={calculatedDays}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                  <div>
                    <label className="panel-label">Budget</label>
                    <input
                      type="number"
                      placeholder="e.g. 3500"
                      className="input-control"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="panel-label">Currency</label>
                    <select
                      className="input-control"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="AED">AED (AED)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="panel-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2H2v10l11.29 11.29a1 1 0 0 0 1.41 0l7.59-7.59a1 1 0 0 0 0-1.41L12 2z" />
                    </svg>
                    Tags
                  </label>
                  <div className="tag-group">
                    {tags.map((tag) => (
                      <span key={tag} className="tag-item">
                        <span>{tag}</span>
                        <button
                          type="button"
                          className="tag-remove"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {isAddingTag ? (
                      <div className="tag-add-form">
                        <input
                          autoFocus
                          type="text"
                          className="tag-add-input"
                          placeholder="New tag"
                          value={newTagText}
                          onChange={(e) => setNewTagText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddTag()
                            }
                          }}
                        />
                        <button type="button" className="tag-add-submit" onClick={handleAddTag}>
                          Add
                        </button>
                        <button
                          type="button"
                          className="tag-add-cancel"
                          onClick={() => {
                            setNewTagText('')
                            setIsAddingTag(false)
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="tag-add-button"
                        onClick={() => setIsAddingTag(true)}
                      >
                        + Add Tag
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.16)', paddingTop: 16 }}>
              <button type="submit" className="save-trip-btn">
                {editingTripId ? 'Update Itinerary' : 'Save Itinerary'}
              </button>
            </div>
          </form>
        </section>

        {/* BOTTOM SECTION: My Trips */}
        <section>
          <div className="trips-section-head">
            <h3>My Trips</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="filter-pills">
                <button
                  type="button"
                  className={`filter-pill ${filter === 'planned' ? 'is-active' : ''}`}
                  onClick={() => setFilter('planned')}
                >
                  Planned
                </button>
                <button
                  type="button"
                  className={`filter-pill ${filter === 'archived' ? 'is-active' : ''}`}
                  onClick={() => setFilter('archived')}
                >
                  Archived
                </button>
                <button
                  type="button"
                  className={`filter-pill ${filter === 'completed' ? 'is-active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
              </div>

              <button
                type="button"
                className="calendar-sub-btn"
                title="Subscribe to calendar (.ics export)"
                aria-label="Subscribe to calendar"
                onClick={handleExportICS}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M8 2v4M16 2v4M3 10h18M16 19h6M19 16v6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="trips-grid">
            {filteredTrips.map((trip) => {
              const days = durationDays(trip.startDate, trip.endDate)
              return (
                <div
                  key={trip.id}
                  className="trip-card"
                  onClick={() => onNavigateToTrip && onNavigateToTrip(trip.id)}
                >
                  {/* Action buttons top-right on trip card */}
                  <div className="trip-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="trip-action-btn"
                      title="Edit trip"
                      aria-label="Edit"
                      onClick={(e) => handleEditTrip(e, trip)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="trip-action-btn"
                      title="Duplicate trip"
                      aria-label="Duplicate"
                      onClick={(e) => handleDuplicateTrip(e, trip.id)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="trip-action-btn"
                      title={trip.status === 'archived' ? 'Unarchive trip' : 'Archive trip'}
                      aria-label="Archive"
                      onClick={(e) => handleArchiveTrip(e, trip.id)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="20" height="5" x="2" y="3" rx="1" />
                        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="trip-action-btn"
                      title="Delete trip"
                      aria-label="Delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        setConfirmDeleteTripId(trip.id)
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>

                  <div className="trip-cover">
                    <img
                      src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'}
                      alt={trip.destination}
                    />
                    <div className="trip-status">
                      <span className="indicator" />
                      {trip.status === 'archived' ? 'Archived' : trip.status === 'completed' ? 'Completed' : 'Planned'}
                    </div>
                    <div className="trip-cover-content">
                      <h4 className="trip-name">{trip.title || trip.destination}</h4>
                    </div>
                  </div>

                  <div className="trip-body">
                    <div className="trip-dates">
                      <span>{trip.startDate}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      <span>{trip.endDate}</span>
                    </div>

                    <div className="trip-meta">
                      <div>
                        <span className="n">{days}</span>
                        <span className="k">Days</span>
                      </div>
                      <div>
                        <span className="n">{trip.placeCount || 0}</span>
                        <span className="k">Places</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* "+ New Trip" card button */}
            <button
              type="button"
              className="add-trip-card"
              onClick={() => {
                setEditingTripId(null)
                setTitle('')
                setDestination('')
                setDescription('')
                window.scrollTo({ top: 0, behavior: 'smooth' })
                destinationInputRef.current?.focus()
              }}
            >
              <div>
                <div className="circ">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5v14" />
                  </svg>
                </div>
                <div className="ttl">New Trip</div>
                <div className="sub">Plan a new trip from scratch</div>
              </div>
            </button>

            {filteredTrips.length === 0 && (
              <div className="empty-trips-banner">
                <p style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600 }}>No trips yet. Create your first trip.</p>
                <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>Use the form above to add your first destination and dates.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Confirmation Dialog for Deletion */}
      {confirmDeleteTripId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 18,
              padding: 24,
              maxWidth: 400,
              width: '100%',
              color: '#0f172a',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            }}
          >
            <h4 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Delete Trip</h4>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete this trip and all its associated itinerary places, bookings, and lists? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setConfirmDeleteTripId(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTripConfirm}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: 0,
                  background: '#dc2626',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
