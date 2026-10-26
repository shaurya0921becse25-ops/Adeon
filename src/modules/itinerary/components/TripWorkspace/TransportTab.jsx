/**
 * @file TransportTab.jsx - Native React Travel & Transport Manager
 * Faithfully restoring final/transport-tab.txt
 */

import React, { useState, useMemo } from 'react'
import { formatMoney } from '../../../itinerary/index.js'
import './TransportTab.css'

const BOOKING_TYPES = [
  {
    name: 'Flight',
    icon: (
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    ),
  },
  {
    name: 'Train',
    icon: (
      <>
        <rect width="16" height="16" x="4" y="3" rx="2" />
        <path d="M4 11h16" />
        <path d="M12 3v8" />
        <path d="m8 19-2 3" />
        <path d="m18 22-2-3" />
        <path d="M8 15h0" />
        <path d="M16 15h0" />
      </>
    ),
  },
  {
    name: 'Bus',
    icon: (
      <>
        <path d="M8 6v6" />
        <path d="M15 6v6" />
        <path d="M2 12h19.6" />
        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 18h5" />
        <circle cx="16" cy="18" r="2" />
      </>
    ),
  },
  {
    name: 'Car',
    icon: (
      <>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </>
    ),
  },
  {
    name: 'Taxi',
    icon: (
      <>
        <path d="M10 2h4" />
        <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" />
        <path d="M7 14h.01" />
        <path d="M17 14h.01" />
        <rect width="18" height="8" x="3" y="10" rx="2" />
        <path d="M5 18v2" />
        <path d="M19 18v2" />
      </>
    ),
  },
  {
    name: 'Bicycle',
    icon: (
      <>
        <circle cx="18.5" cy="17.5" r="3.5" />
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="15" cy="5" r="1" />
        <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
      </>
    ),
  },
  {
    name: 'Cruise',
    icon: (
      <>
        <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
        <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
        <path d="M12 10v4" />
        <path d="M12 2v3" />
      </>
    ),
  },
  {
    name: 'Ferry',
    icon: (
      <>
        <path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" />
        <path d="M21 14 10 2 3 14h18Z" />
        <path d="M10 2v16" />
      </>
    ),
  },
  {
    name: 'Other',
    icon: (
      <>
        <circle cx="6" cy="19" r="3" />
        <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
        <circle cx="18" cy="5" r="3" />
      </>
    ),
  },
]

export default function TransportTab({
  store,
  createBooking,
  deleteBooking,
  createExpense,
}) {
  const trip = store?.trip || {}
  const transports = useMemo(() => store?.transports || [], [store?.transports])
  const expenses = useMemo(() => store?.expenses || [], [store?.expenses])

  // Filters & Accordion
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState('all')
  const [isSectionOpen, setIsSectionOpen] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('manual') // 'manual' | 'auto'
  const [editBookingId, setEditBookingId] = useState(null)

  // Form Fields
  const [formType, setFormType] = useState('Flight')
  const [formTitle, setFormTitle] = useState('')
  const [formFrom, setFormFrom] = useState('')
  const [formDepDate, setFormDepDate] = useState('')
  const [formDepTime, setFormDepTime] = useState('')
  const [formCarrier, setFormCarrier] = useState('')
  const [formFlightNo, setFormFlightNo] = useState('')
  const [formSeat, setFormSeat] = useState('')
  const [formTo, setFormTo] = useState('')
  const [formArrDate, setFormArrDate] = useState('')
  const [formArrTime, setFormArrTime] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formStatus, setFormStatus] = useState('Confirmed')
  const [formPrice, setFormPrice] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [attachedFileName, setAttachedFileName] = useState('')

  // Map of linked transport booking IDs that already have an expense recorded
  const linkedExpenseBookingIds = useMemo(() => {
    return new Set(expenses.map((e) => e.linkedTransportId).filter(Boolean))
  }, [expenses])

  // Open Add Modal
  const openAddModal = () => {
    setEditBookingId(null)
    setFormType('Flight')
    setFormTitle('')
    setFormFrom('')
    setFormDepDate(trip.startDate || '')
    setFormDepTime('10:00')
    setFormCarrier('')
    setFormFlightNo('')
    setFormSeat('')
    setFormTo('')
    setFormArrDate(trip.startDate || '')
    setFormArrTime('12:00')
    setFormCode('')
    setFormStatus('Confirmed')
    setFormPrice('')
    setFormNotes('')
    setAttachedFileName('')
    setModalMode('manual')
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const openEditModal = (id) => {
    const item = transports.find((t) => t.id === id)
    if (!item) return

    setEditBookingId(id)
    setFormType(
      item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase() : 'Flight'
    )
    setFormTitle(item.title || '')
    setFormFrom(item.from || '')
    setFormDepDate(item.departureDate ? item.departureDate.slice(0, 10) : '')
    setFormDepTime(item.departureTime || '')
    setFormCarrier(item.carrier || '')
    setFormFlightNo(item.flightNumber || '')
    setFormSeat(item.seatNumber || '')
    setFormTo(item.to || '')
    setFormArrDate(item.arrivalDate ? item.arrivalDate.slice(0, 10) : '')
    setFormArrTime(item.arrivalTime || '')
    setFormCode(item.confirmationCode || '')
    setFormStatus(item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : 'Confirmed')
    setFormPrice(item.price ? String(item.price) : '')
    setFormNotes(item.notes || '')
    setAttachedFileName('')
    setIsModalOpen(true)
  }

  // Handle Form Submission
  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!formTitle.trim()) {
      alert('Please enter a booking title.')
      return
    }

    const payload = {
      title: formTitle.trim(),
      type: formType.toLowerCase(),
      status: formStatus.toLowerCase(),
      carrier: formCarrier.trim(),
      confirmationCode: formCode.trim(),
      from: formFrom.trim(),
      to: formTo.trim(),
      departureDate: formDepDate ? `${formDepDate}T${formDepTime || '00:00'}:00.000Z` : undefined,
      arrivalDate: formArrDate ? `${formArrDate}T${formArrTime || '00:00'}:00.000Z` : undefined,
      departureTime: formDepTime,
      arrivalTime: formArrTime,
      flightNumber: formFlightNo.trim(),
      seatNumber: formSeat.trim(),
      price: Number(formPrice) || 0,
      currency: trip.currency || 'JPY',
      notes: formNotes.trim(),
    }

    if (editBookingId) {
      if (deleteBooking) deleteBooking(editBookingId)
      if (createBooking) createBooking({ id: editBookingId, ...payload })
    } else {
      if (createBooking) createBooking(payload)
    }

    setIsModalOpen(false)
  }

  // Create linked expense shortcut
  const handleCreateLinkedExpense = (booking) => {
    if (linkedExpenseBookingIds.has(booking.id)) {
      alert('This booking is already recorded in your expenses.')
      return
    }

    if (createExpense) {
      try {
        createExpense({
          name: `${booking.title} (${booking.carrier || booking.type})`,
          amount: Number(booking.price) || 0,
          category: 'transport',
          date: booking.departureDate ? booking.departureDate.slice(0, 10) : trip.startDate,
          linkedTransportId: booking.id,
        })
        alert('✓ Booking recorded as an expense in Cost Tab!')
      } catch (err) {
        alert(err?.message || 'Could not record expense')
      }
    }
  }

  // Counts by category
  const counts = useMemo(() => {
    const flight = transports.filter((t) => t.type?.toLowerCase() === 'flight').length
    const car = transports.filter((t) => t.type?.toLowerCase() === 'car').length
    const train = transports.filter((t) => t.type?.toLowerCase() === 'train').length
    return { all: transports.length, flight, car, train }
  }, [transports])

  // Filtered transports list
  const filteredTransports = useMemo(() => {
    if (currentCategoryFilter === 'all') return transports
    return transports.filter((t) => t.type?.toLowerCase() === currentCategoryFilter)
  }, [transports, currentCategoryFilter])

  return (
    <div className="transport-page-wrapper">
      <div className="transport-container">
        
        {/* HEADER SUB-MENU / ACTION TOOLBAR */}
        <div className="transport-toolbar">
          <h2>Transports</h2>
          <div className="v-divider" />

          {/* Filter Pill Buttons */}
          <div className="transport-filters">
            <button
              type="button"
              className={`trans-filter-btn ${currentCategoryFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setCurrentCategoryFilter('all')}
            >
              All <span className="badge-cnt">{counts.all}</span>
            </button>

            <button
              type="button"
              className={`trans-filter-btn ${currentCategoryFilter === 'flight' ? 'is-active' : ''}`}
              onClick={() => setCurrentCategoryFilter('flight')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
              Flight <span className="badge-cnt">{counts.flight}</span>
            </button>

            <button
              type="button"
              className={`trans-filter-btn ${currentCategoryFilter === 'train' ? 'is-active' : ''}`}
              onClick={() => setCurrentCategoryFilter('train')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="16" height="16" x="4" y="3" rx="2" />
                <path d="M4 11h16" />
                <path d="M12 3v8" />
                <path d="m8 19-2 3" />
                <path d="m18 22-2-3" />
              </svg>
              Train <span className="badge-cnt">{counts.train}</span>
            </button>

            <button
              type="button"
              className={`trans-filter-btn ${currentCategoryFilter === 'car' ? 'is-active' : ''}`}
              onClick={() => setCurrentCategoryFilter('car')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
              Car <span className="badge-cnt">{counts.car}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="trans-actions">
            <button
              type="button"
              className="trans-btn-import"
              onClick={() => alert('Import confirmations file ready (supports JSON/PDF confirmations).')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Import from file
            </button>

            <button
              type="button"
              className="trans-btn-add"
              onClick={openAddModal}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Transport
            </button>
          </div>
        </div>

        {/* SECTION COLLAPSIBLE HEADER */}
        <div>
          <button
            type="button"
            className="trans-section-toggle"
            onClick={() => setIsSectionOpen(!isSectionOpen)}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isSectionOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            <span>Confirmed</span>
            <span className="trans-section-count">{filteredTransports.length}</span>
          </button>

          {/* TRANSPORT CARDS GRID */}
          {isSectionOpen && (
            <div className="trans-cards-grid">
              {filteredTransports.length === 0 ? (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    padding: '36px 20px',
                    textAlign: 'center',
                    background: 'var(--trans-bg-card, #ffffff)',
                    borderRadius: 16,
                    border: '1px dashed var(--trans-border, #D6C7B5)',
                    color: 'var(--trans-text-muted, #475569)',
                    fontSize: 13,
                  }}
                >
                  No transports found in this category. Click &quot;+ Transport&quot; to add.
                </div>
              ) : (
                filteredTransports.map((item) => {
                  const typeLower = (item.type || 'other').toLowerCase()
                  const typeIconDef = BOOKING_TYPES.find(
                    (b) => b.name.toLowerCase() === typeLower
                  ) || BOOKING_TYPES[8]

                  const isLinked = linkedExpenseBookingIds.has(item.id)

                  return (
                    <div key={item.id} className="trans-card">
                      {/* Card Header matching final/transport-tab.txt */}
                      <div className="trans-card-head">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <span className="trans-status-badge">
                            <span className="trans-status-dot" />
                            {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Confirmed'}
                          </span>
                          <span className="trans-type-pill">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              {typeIconDef.icon}
                            </svg>
                            {item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Transport'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span className="trans-title-text" title={item.title}>
                            {item.title}
                          </span>
                          <button
                            type="button"
                            className="trans-icon-btn"
                            title="Edit"
                            onClick={() => openEditModal(item.id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="trans-icon-btn danger"
                            title="Delete"
                            onClick={() => {
                              if (window.confirm(`Delete ${item.title}?`)) {
                                if (deleteBooking) deleteBooking(item.id)
                              }
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="trans-card-body">
                        {item.confirmationCode && (
                          <div className="trans-code-box">
                            <div className="trans-code-lbl">Booking Code</div>
                            <div className="trans-code-val">{item.confirmationCode}</div>
                          </div>
                        )}

                        {(item.from || item.to) && (
                          <div className="trans-route-box">
                            {item.from && (
                              <div className="trans-route-line">
                                <span className="lbl">From</span>
                                <span className="val">{item.from}</span>
                              </div>
                            )}
                            {item.to && (
                              <div className="trans-route-line">
                                <span className="lbl">To</span>
                                <span className="val">{item.to}</span>
                              </div>
                            )}
                            {item.carrier && (
                              <div className="trans-route-line">
                                <span className="lbl">Line</span>
                                <span className="val">{item.carrier} {item.flightNumber || ''}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {item.notes && (
                          <div>
                            <div className="trans-code-lbl" style={{ textAlign: 'left' }}>Notes</div>
                            <div className="trans-notes-box">
                              {item.notes}
                            </div>
                          </div>
                        )}

                        <div className="trans-card-foot">
                          <span className="trans-price-val">
                            {item.price > 0
                              ? formatMoney(item.price, trip.currency || item.currency || 'JPY')
                              : 'Included / Pass'}
                          </span>

                          {item.price > 0 && (
                            <button
                              type="button"
                              className={`trans-link-expense-btn ${isLinked ? 'linked' : ''}`}
                              onClick={() => handleCreateLinkedExpense(item)}
                            >
                              {isLinked ? '✓ In Cost Tab' : '+ Record in Cost Tab'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

      </div>

      {/* FULL RESTORED ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="trans-modal-backdrop">
          <div className="trans-modal-enter">
            {/* Modal Header */}
            <div className="trans-modal-head">
              <h3>{editBookingId ? 'Edit transport' : 'Add transport'}</h3>
              <button
                type="button"
                className="trans-icon-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="trans-modal-body">
              {/* Mode Tabs */}
              <div className="trans-mode-tabs">
                <button
                  type="button"
                  className={`trans-mode-tab ${modalMode === 'manual' ? 'is-active' : ''}`}
                  onClick={() => setModalMode('manual')}
                >
                  Manual
                </button>
                <button
                  type="button"
                  className={`trans-mode-tab ${modalMode === 'auto' ? 'is-active' : ''}`}
                  onClick={() => {
                    setModalMode('auto')
                    alert('Automated confirmation scanner ready. Select a PDF or confirmation email.')
                  }}
                >
                  Automated
                </button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* Booking Type Selection */}
                <div>
                  <label className="trans-field-label">Booking Type</label>
                  <div className="trans-type-pills">
                    {BOOKING_TYPES.map((bt) => {
                      const isSel = formType === bt.name
                      return (
                        <button
                          key={bt.name}
                          type="button"
                          className={`trans-type-selector-btn ${isSel ? 'is-selected' : ''}`}
                          onClick={() => setFormType(bt.name)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {bt.icon}
                          </svg>
                          {bt.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="trans-field-label">Title *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Narita Express, Tokyo Metro Pass, ..."
                    className="trans-input"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>

                {/* Route Section */}
                <div className="trans-route-form-section">
                  <label className="trans-field-label">Route &amp; Schedule</label>
                  
                  {/* Departure Card */}
                  <div className="trans-route-card">
                    <div className="trans-route-card-title">
                      <span>From</span>
                      <div className="input-box">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--trans-text-faint, #8E776B)" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Departure airport, station, or city (e.g. HND)"
                          value={formFrom}
                          onChange={(e) => setFormFrom(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="trans-route-grid">
                      <div>
                        <label className="trans-field-label">Departure Date</label>
                        <input
                          type="date"
                          className="trans-input"
                          value={formDepDate}
                          onChange={(e) => setFormDepDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="trans-field-label">Departure Time</label>
                        <input
                          type="time"
                          className="trans-input"
                          value={formDepTime}
                          onChange={(e) => setFormDepTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      <div>
                        <label className="trans-field-label">Carrier</label>
                        <input
                          type="text"
                          placeholder="e.g. JR East"
                          className="trans-input"
                          value={formCarrier}
                          onChange={(e) => setFormCarrier(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="trans-field-label">Service No.</label>
                        <input
                          type="text"
                          placeholder="e.g. N'EX 22"
                          className="trans-input"
                          value={formFlightNo}
                          onChange={(e) => setFormFlightNo(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="trans-field-label">Seat</label>
                        <input
                          type="text"
                          placeholder="e.g. Car 4, 7D"
                          className="trans-input"
                          value={formSeat}
                          onChange={(e) => setFormSeat(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Destination Card */}
                  <div className="trans-route-card">
                    <div className="trans-route-card-title">
                      <span>To</span>
                      <div className="input-box">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--trans-text-faint, #8E776B)" strokeWidth="2">
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Arrival airport, station, or city (e.g. Shinjuku)"
                          value={formTo}
                          onChange={(e) => setFormTo(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="trans-route-grid">
                      <div>
                        <label className="trans-field-label">Arrival Date</label>
                        <input
                          type="date"
                          className="trans-input"
                          value={formArrDate}
                          onChange={(e) => setFormArrDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="trans-field-label">Arrival Time</label>
                        <input
                          type="time"
                          className="trans-input"
                          value={formArrTime}
                          onChange={(e) => setFormArrTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Code, Status, and Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="trans-field-label">Booking Code</label>
                    <input
                      type="text"
                      placeholder="e.g. TK-99128"
                      className="trans-input font-mono"
                      style={{ textTransform: 'uppercase' }}
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="trans-field-label">Status</label>
                    <select
                      className="trans-input"
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="trans-field-label">Estimated Price ({trip.currency || 'JPY'})</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="trans-input"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="trans-field-label">Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Baggage rules, terminal info, transfer instructions..."
                    className="trans-input"
                    style={{ resize: 'none' }}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </div>

                {/* File Attachment & Travelers */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <label className="trans-field-label">Traveler</label>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--trans-bg-tertiary, #EBF2F4)', borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'var(--trans-text-primary, #4A3B32)' }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--trans-accent, #647F91)', color: '#fff', fontSize: 10, display: 'grid', placeItems: 'center' }}>
                        1
                      </span>
                      {trip.destination ? `${trip.destination} Traveler` : 'Solo Traveler'}
                    </span>
                  </div>

                  <div>
                    <label className="trans-field-label">File</label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px dashed var(--trans-border, #D6C7B5)', borderRadius: 8, fontSize: 12, cursor: 'pointer', background: 'var(--trans-bg-card, #ffffff)', color: 'var(--trans-text-muted, #475569)' }}>
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAttachedFileName(e.target.files[0].name)
                          }
                        }}
                      />
                      📎 {attachedFileName || 'Attach ticket/PDF'}
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="trans-modal-foot">
                  <button
                    type="button"
                    style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid var(--trans-border, #D6C7B5)', background: 'var(--trans-bg-card, #ffffff)', color: 'var(--trans-text-muted, #475569)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 20px', borderRadius: 10, border: 0, background: 'var(--trans-accent, #647F91)', color: '#ffffff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                  >
                    {editBookingId ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
