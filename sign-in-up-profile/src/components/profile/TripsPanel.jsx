import TripCard from './TripCard'
import CommentItem from './CommentItem'
import ServiceItem from './ServiceItem'
import styles from './TripsPanel.module.css'

/**
 * TripsPanel component
 * Renders the primary two-column overview layout with trip history on the left
 * and preview cards for comments and booked services on the right.
 *
 * @param {Object} props
 * @param {Array} props.trips
 * @param {Array} props.comments
 * @param {Array} props.services
 * @param {(tabKey: string) => void} props.onNavigateTab
 * @param {(trip: Object) => void} props.onViewItinerary
 */
export default function TripsPanel({
  trips,
  comments,
  services,
  onNavigateTab,
  onViewItinerary,
}) {
  return (
    <div className={styles.content}>
      <article className={styles.panel} aria-labelledby="trips-panel-heading">
        <div className={styles.panelHead}>
          <div className={styles.panelTitle} id="trips-panel-heading">
            <span className={styles.symbol} aria-hidden="true">
              ⚑
            </span>
            Trip History
          </div>
          <button
            type="button"
            className={styles.view}
            onClick={() => onNavigateTab('trips')}
            aria-label="View all trips"
          >
            View All
          </button>
        </div>
        <div className={styles.tripList}>
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onViewItinerary={onViewItinerary}
            />
          ))}
        </div>
      </article>

      <div className={styles.rightCol}>
        <article
          className={styles.panel}
          aria-labelledby="comments-panel-heading"
        >
          <div className={styles.panelHead}>
            <div className={styles.panelTitle} id="comments-panel-heading">
              <span className={styles.symbol} aria-hidden="true">
                ☏
              </span>
              Comments
            </div>
            <button
              type="button"
              className={styles.view}
              onClick={() => onNavigateTab('comments')}
              aria-label="View all comments"
            >
              View All
            </button>
          </div>
          <div>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} detailed={false} />
            ))}
          </div>
        </article>

        <article
          className={styles.panel}
          aria-labelledby="services-panel-heading"
        >
          <div className={styles.panelHead}>
            <div className={styles.panelTitle} id="services-panel-heading">
              <span className={styles.symbol} aria-hidden="true">
                ♧
              </span>
              Booked Services
            </div>
            <button
              type="button"
              className={styles.view}
              onClick={() => onNavigateTab('services')}
              aria-label="View all booked services"
            >
              View All
            </button>
          </div>
          <div>
            {services.map((service) => (
              <ServiceItem key={service.id} service={service} />
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
