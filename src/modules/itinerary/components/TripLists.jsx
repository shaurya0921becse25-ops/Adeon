import { useState } from 'react'
import TripIcon from './TripIcon.jsx'

export default function TripLists({ packing, tasks, onAdd, onToggle, onRemove }) {
  const [activeList, setActiveList] = useState('packing')
  const [value, setValue] = useState('')
  const items = activeList === 'packing' ? packing : tasks

  const submit = event => {
    event.preventDefault()
    if (!value.trim()) return
    onAdd(activeList, value.trim())
    setValue('')
  }

  return (
    <main className="simple-section-page lists-page">
      <div className="simple-section-heading">
        <div><span className="eyebrow">GET READY</span><h1>Lists</h1><p>Keep your trip essentials together.</p></div>
      </div>
      <section className="lists-card">
        <div className="list-switcher" role="tablist" aria-label="Trip lists">
          <button type="button" role="tab" aria-selected={activeList === 'packing'} className={activeList === 'packing' ? 'list-switch active' : 'list-switch'} onClick={() => setActiveList('packing')}>Packing <span>{packing.length}</span></button>
          <button type="button" role="tab" aria-selected={activeList === 'tasks'} className={activeList === 'tasks' ? 'list-switch active' : 'list-switch'} onClick={() => setActiveList('tasks')}>To do <span>{tasks.filter(task => !task.done).length}</span></button>
        </div>
        <form className="list-add-form" onSubmit={submit}>
          <input className="form-input" value={value} onChange={event => setValue(event.target.value)} placeholder={activeList === 'packing' ? 'Add something to pack...' : 'Add a task...'} aria-label={activeList === 'packing' ? 'Add packing item' : 'Add task'} />
          <button type="submit" className="primary-button" disabled={!value.trim()}><TripIcon name="plus" size={16} />Add</button>
        </form>
        {items.length ? (
          <ul className="list-items">
            {items.map(item => (
              <li className={`list-item${item.done ? ' is-done' : ''}`} key={item.id}>
                <button type="button" className={`check-button${item.done ? ' checked' : ''}`} onClick={() => onToggle(activeList, item.id)} aria-label={`${item.done ? 'Mark incomplete' : 'Complete'} ${item.text}`}>
                  {item.done && <TripIcon name="check" size={14} strokeWidth={2.4} />}
                </button>
                <span>{item.text}</span>
                <button type="button" className="remove-item-button" onClick={() => onRemove(activeList, item.id)} aria-label={`Remove ${item.text}`}><TripIcon name="close" size={15} /></button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="list-empty"><span className="large-empty-icon"><TripIcon name={activeList === 'packing' ? 'box' : 'check'} size={25} /></span><strong>{activeList === 'packing' ? 'Your packing list is empty' : 'No tasks yet'}</strong><p>Add items to keep your trip organized.</p></div>
        )}
      </section>
    </main>
  )
}
