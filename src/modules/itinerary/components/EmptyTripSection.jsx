import { useState } from 'react'
import TripIcon from './TripIcon.jsx'

function AddInformationDialog({ section, onClose, onSave }) {
  const [value, setValue] = useState('')
  const title = section === 'budget' ? 'Add a budget item' : 'Add transportation'
  const placeholder = section === 'budget' ? 'e.g. Train tickets' : 'e.g. Train to Kyoto'
  const fieldLabel = section === 'budget' ? 'Item' : 'Transportation information'

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        className="entry-dialog"
        onSubmit={event => { event.preventDefault(); if (value.trim()) onSave(value.trim()) }}
        onMouseDown={event => event.stopPropagation()}
      >
        <div className="dialog-heading">
          <div><span className="eyebrow">{section === 'budget' ? 'TRIP BUDGET' : 'TRIP DETAILS'}</span><h2>{title}</h2></div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close"><TripIcon name="close" /></button>
        </div>
        <label className="field-label" htmlFor="section-entry">{fieldLabel}</label>
        <input id="section-entry" className="form-input" autoFocus value={value} onChange={event => setValue(event.target.value)} placeholder={placeholder} />
        <div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Save</button></div>
      </form>
    </div>
  )
}

export default function EmptyTripSection({ section, entries, onAdd }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const isBudget = section === 'budget'
  const title = isBudget ? 'Budget' : 'Transportation'
  const message = isBudget
    ? 'Your trip budget is ready when you are.'
    : 'Add your transportation information to get started.'

  return (
    <main className="simple-section-page">
      <div className="simple-section-heading">
        <div><span className="eyebrow">TRIP DETAILS</span><h1>{title}</h1></div>
        {entries.length > 0 && <button type="button" className="primary-button" onClick={() => setDialogOpen(true)}><TripIcon name="plus" size={16} />Add {isBudget ? 'item' : 'transport'}</button>}
      </div>
      {entries.length === 0 ? (
        <section className="section-empty-card">
          <span className="large-empty-icon"><TripIcon name={isBudget ? 'budget' : 'transportation'} size={26} /></span>
          <h2>{isBudget ? 'No budget items yet' : 'No transportation added'}</h2>
          <p>{message}</p>
          <button type="button" className="primary-button" onClick={() => setDialogOpen(true)}><TripIcon name="plus" size={16} />Add {isBudget ? 'budget item' : 'transportation'}</button>
        </section>
      ) : (
        <section className="entry-list-card">
          {entries.map((entry, index) => <div className="entry-list-row" key={`${entry}-${index}`}><span className="entry-row-icon"><TripIcon name={isBudget ? 'budget' : 'transportation'} size={17} /></span><span>{entry}</span></div>)}
        </section>
      )}
      {dialogOpen && <AddInformationDialog section={section} onClose={() => setDialogOpen(false)} onSave={value => { onAdd(value); setDialogOpen(false) }} />}
    </main>
  )
}
