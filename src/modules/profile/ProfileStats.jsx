import styles from './ProfileStats.module.css'

/**
 * ProfileStats component
 * Displays numerical counters for trips, comments, and booked services.
 *
 * @param {Object} props
 * @param {Object} props.stats
 * @param {number} props.stats.trips
 * @param {number} props.stats.comments
 * @param {number} props.stats.services
 */
export default function ProfileStats({ stats }) {
  const { trips = 0, comments = 0, services = 0 } = stats || {}

  return (
    <div className={styles.stats} aria-label="Profile statistics">
      <div className={styles.stat}>
        <strong>{trips}</strong>
        Trips
      </div>
      <div className={styles.stat}>
        <strong>{comments}</strong>
        Comments
      </div>
      <div className={styles.stat}>
        <strong>{services}</strong>
        Booked Services
      </div>
    </div>
  )
}
