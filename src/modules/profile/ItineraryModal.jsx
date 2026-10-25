import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ItineraryModal.module.css'

/**
 * ItineraryModal component
 * Provides a rich itinerary preview modal when the user clicks 'View Itinerary'.
 *
 * @param {Object} props
 * @param {Object|null} props.trip
 * @param {() => void} props.onClose
 */
export default function ItineraryModal({ trip, onClose }) {
  useEffect(() => {
    if (!trip) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [trip, onClose])

  if (!trip) return null

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="itinerary-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={styles.modal}>
        <img
          src={trip.fallbackImage || trip.image}
          alt={trip.title}
          className={styles.modalCover}
        />
        <div className={styles.modalBody}>
          <h2 className={styles.title} id="itinerary-title">
            {trip.title} Itinerary
          </h2>
          <div className={styles.meta}>
            <span>▢ {trip.dates}</span>
            <span>⌖ {trip.location}</span>
          </div>
          <p className={styles.desc}>{trip.desc}</p>

          <div className={styles.timeline}>
            <div className={styles.dayItem}>
              <div className={styles.dayTitle}>Day 1: Arrival & Check-in</div>
              <div className={styles.dayDesc}>
                Settle in, explore the neighborhood, and enjoy a local welcome dinner.
              </div>
            </div>
            <div className={styles.dayItem}>
              <div className={styles.dayTitle}>Day 2: Guided Exploration</div>
              <div className={styles.dayDesc}>
                Scenic sights, historic landmarks, and photo moments.
              </div>
            </div>
            <div className={styles.dayItem}>
              <div className={styles.dayTitle}>Day 3: Highlights & Free Time</div>
              <div className={styles.dayDesc}>
                Cultural immersion, local cuisine tasting, and sunset vantage points.
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btn}
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => {
                onClose()
                const targetTripId = trip.rawTrip?.id || trip.id
                if (targetTripId && targetTripId.startsWith('trip-')) {
                  navigate(`/itinerary?tripId=${targetTripId}`)
                } else {
                  navigate('/itinerary')
                }
              }}
            >
              Open Full Itinerary &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
