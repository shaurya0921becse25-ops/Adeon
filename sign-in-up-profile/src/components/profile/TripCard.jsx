import { useState } from 'react'
import styles from './TripCard.module.css'

/**
 * TripCard component
 * Renders an individual trip entry with dates, location, description, and action button.
 *
 * @param {Object} props
 * @param {Object} props.trip
 * @param {(trip: Object) => void} props.onViewItinerary
 */
export default function TripCard({ trip, onViewItinerary }) {
  const { title, dates, location, desc, image, fallbackImage, alt } = trip
  const [currentSrc, setCurrentSrc] = useState(image)

  const handleImageError = () => {
    if (fallbackImage && currentSrc !== fallbackImage) {
      setCurrentSrc(fallbackImage)
    }
  }

  return (
    <div className={styles.trip}>
      <img
        src={currentSrc}
        alt={alt || title}
        className={styles.tripImg}
        onError={handleImageError}
        loading="lazy"
      />
      <div className={styles.tripContent}>
        <h3 className={styles.tripTitle}>{title}</h3>
        <div className={styles.meta}>
          <span>▢ &nbsp;{dates}</span>
          <span>⌖ &nbsp;{location}</span>
        </div>
        <div className={styles.tripBottom}>
          <p className={styles.desc}>{desc}</p>
          <button
            type="button"
            className={styles.pill}
            onClick={() => onViewItinerary(trip)}
            aria-label={`View itinerary for ${title}`}
          >
            View Itinerary
          </button>
        </div>
      </div>
    </div>
  )
}
