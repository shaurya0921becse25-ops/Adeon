import { useLayoutEffect, useRef, useState } from 'react'
import TripIcon from './TripIcon.jsx'

const TRIP_TABS = [
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'plan', label: 'Plan', icon: 'plan' },
  { id: 'shop', label: 'Shop', icon: 'shopping' },
  { id: 'lists', label: 'Lists', icon: 'lists' },
  { id: 'cost', label: 'Cost', icon: 'budget' },
  { id: 'transport', label: 'Transport', icon: 'transportation' },
]

export default function TripTabs({ activeTab, onChange, onBack }) {
  const navRef = useRef(null)
  const activeRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const nav = navRef.current
    const active = activeRef.current
    if (!nav || !active) return

    const updateIndicator = () => {
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth })
      if (nav.scrollWidth > nav.clientWidth) {
        const left = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2
        nav.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
      }
    }

    updateIndicator()
    const observer = new ResizeObserver(updateIndicator)
    observer.observe(nav)
    observer.observe(active)
    return () => observer.disconnect()
  }, [activeTab])

  return (
    <div className="trip-tabbar">
      <button
        type="button"
        className="trek-back-btn"
        aria-label="Back"
        onClick={onBack}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="trek-back-icon"
          aria-hidden="true"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span className="trek-back-label">Back</span>
      </button>
      <nav className="trip-tabs" aria-label="Trip sections" ref={navRef}>
        <span
          className="trip-tab-indicator"
          aria-hidden="true"
          style={{ left: indicator.left, width: indicator.width }}
        />
        {TRIP_TABS.map(({ id, label, icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              ref={active ? activeRef : null}
              type="button"
              className={`trip-tab${active ? ' is-active' : ''}`}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              onClick={() => onChange(id)}
            >
              <TripIcon name={icon} size={15} strokeWidth={2} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
