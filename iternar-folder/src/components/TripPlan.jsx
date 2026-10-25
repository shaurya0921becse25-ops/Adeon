import { useState } from 'react'
import TripIcon from './TripIcon.jsx'

function MapIllustration() {
  return (
    <div className="map-art" aria-label="Empty world map">
      <svg className="world-map" viewBox="0 0 1000 570" role="img" aria-hidden="true">
        <path d="M82 132 106 99l38-11 22-26 43-7 21 16 35-5 29 14 27-1 21 22-13 21-30 6-13 20-26 9-9 24-28 9-9 22-27 8-14 28-22 8-12 26-18 1-9-17-23-14-7-33-18-10-8-29-19-12-5-24-24-10 7-19-19-17Zm93-39 26-13 23 11-4 16-24 10-20-8Z" />
        <path d="m302 246 24-13 29 4 20 18 17 3 8 19-13 19-10 37-16 33-11 47-14 28-13-30-4-34-15-32-2-37-17-27-3-22Z" />
        <path d="m358 99 19-24 29-7 25 14 8 22-18 24-34 4-20-13Z" />
        <path d="m433 146 22-20 34-2 26 13 28-7 34 12 39-3 25 14 46-1 26 15 39-5 27 16 55-3 28 19-13 19-37 4-21 20-37-6-19 17-31-7-18 19-37-5-26 16-22-10-23 13-26-14-25 5-10-21-24-3-11 22-23 1-11-22-27 3-8-24-25 4-11-22-31 3-9-19-28-1-10-18-30 1-12-18Z" />
        <path d="m494 238 27-12 25 13 16 25 1 29-13 25-12 43-17 38-17 31-11-27-8-35-15-34-2-36-12-30 9-23Z" />
        <path d="m640 227 19-13 28 4 18 14 23 1 19 15-7 18-21 5-15 23-17 4-18-22-22-10-13-21Z" />
        <path d="m710 268 28-12 24 9 16 21 30 4 13 16-13 17-32-3-20-17-27-5-15-16Z" />
        <path d="m795 382 29-17 39 4 30 19 17 30-18 22-44 5-37-14-21-24Z" />
        <path d="m422 489 65-8 79 7 73-4 58 10 52-7 71 13 52-6 46 14-40 23-87 5-57-11-71 7-89-12-66 8-69-15-45 2-42-14Z" />
        <path className="map-country-lines" d="m155 99 16 25-13 28 20 22-6 28m65-87-13 23 15 18-10 25 19 23M468 139l8 27-21 18 16 21-7 24m62-95-8 23 21 18-12 25m58-76-9 22 20 19-10 26m89-67-15 21 15 19-8 18m89-45-9 21 16 17m-284 48 24 10 12 30-8 28m-148-53 18 19-8 22 18 21-5 27m466 123-11 18 19 13" />
      </svg>
      <div className="map-label label-america">United States</div>
      <div className="map-label label-europe">United Kingdom</div>
      <div className="map-label label-africa">Kenya</div>
      <div className="map-label label-asia">China</div>
      <div className="map-label label-australia">Australia</div>
      <span className="map-scale">Empty trip</span>
    </div>
  )
}

function DayPanel({ activeDay, onSelectDay }) {
  return (
    <aside className="plan-panel day-panel">
      <div className="day-panel-tools">
        <button className="secondary-button export-button" type="button">↓ &nbsp;Export</button>
        <button className="icon-button subtle-button" type="button" aria-label="Change day order">↕</button>
        <button className="icon-button subtle-button" type="button" aria-label="Undo">↶</button>
        <button className="icon-button subtle-button" type="button" aria-label="Sort days">⇅</button>
      </div>
      <div className="days-list">
        {Array.from({ length: 7 }, (_, index) => {
          const day = index + 1
          return (
            <button
              type="button"
              className={`day-row${activeDay === day ? ' day-selected' : ''}`}
              key={day}
              onClick={() => onSelectDay(day)}
              aria-pressed={activeDay === day}
            >
              <span className="day-number">{day}</span>
              <span className="day-name">Day {day}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

function PlacesPanel({ places, onAddPlace }) {
  return (
    <aside className="plan-panel places-panel">
      <button type="button" className="primary-button add-place-button" onClick={onAddPlace}>
        <TripIcon name="plus" size={17} strokeWidth={2.3} />
        Add Place/Activity
      </button>
      <div className="import-actions">
        <button type="button" className="secondary-button import-button" disabled>＋ Import file</button>
        <button type="button" className="secondary-button import-button" disabled>⌖ List Import</button>
      </div>
      <button type="button" className="filter-button">
        <span>All</span><span className="place-count">{places.length}</span><span className="chevron">⌄</span>
      </button>
      <label className="search-box">
        <TripIcon name="search" size={16} />
        <input type="search" placeholder="Search places..." aria-label="Search places" />
      </label>
      <div className="category-row">
        <button type="button" className="category-button">All Categories <span>⌄</span></button>
        <button type="button" className="icon-button category-icon" aria-label="Favorites">☆</button>
        <button type="button" className="icon-button category-icon" aria-label="Select places">✓</button>
      </div>
      <div className="places-count">{places.length} {places.length === 1 ? 'PLACE' : 'PLACES'}</div>
      <div className="places-empty">
        {places.length ? (
          <ul className="place-list">
            {places.map(place => <li key={place.id}><TripIcon name="pin" size={16} />{place.name}</li>)}
          </ul>
        ) : (
          <>
            <div className="empty-illustration"><TripIcon name="search" size={39} /><TripIcon name="box" size={38} /></div>
            <strong>No places found</strong>
            <button className="inline-link" type="button" onClick={onAddPlace}>Add Place/Activity</button>
          </>
        )}
      </div>
    </aside>
  )
}

function AddPlaceDialog({ onClose, onSave }) {
  const [name, setName] = useState('')
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        className="entry-dialog"
        onSubmit={event => { event.preventDefault(); if (name.trim()) onSave(name.trim()) }}
        onMouseDown={event => event.stopPropagation()}
      >
        <div className="dialog-heading"><div><span className="eyebrow">TRIP PLAN</span><h2>Add a place</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><TripIcon name="close" /></button></div>
        <label className="field-label" htmlFor="place-name">Place or activity</label>
        <input id="place-name" className="form-input" autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="e.g. City museum" />
        <div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Add place</button></div>
      </form>
    </div>
  )
}

export default function TripPlan({ places, onAddPlace }) {
  const [activeDay, setActiveDay] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <main className="plan-workspace">
      <DayPanel activeDay={activeDay} onSelectDay={setActiveDay} />
      <section className="map-workspace">
        <MapIllustration />
        <div className="map-tools">
          {['utensils', 'coffee', 'leaf', 'bed', 'camera', 'landmark', 'transportation'].map(name => (
            <button type="button" className="map-tool" key={name} aria-label={`Filter ${name}`}><TripIcon name={name} size={17} /></button>
          ))}
        </div>
      </section>
      <PlacesPanel places={places} onAddPlace={() => setDialogOpen(true)} />
      {dialogOpen && <AddPlaceDialog onClose={() => setDialogOpen(false)} onSave={name => { onAddPlace(name); setDialogOpen(false) }} />}
    </main>
  )
}
