import ServiceItem from './ServiceItem'
import styles from './ServicesPanel.module.css'

/**
 * ServicesPanel component
 * Displays full list of booked activities, hotels, and transit reservations.
 *
 * @param {Object} props
 * @param {Array} props.services
 */
export default function ServicesPanel({ services }) {
  return (
    <article className={styles.panel} aria-labelledby="all-services-heading">
      <div className={styles.panelHead}>
        <div className={styles.panelTitle} id="all-services-heading">
          <span className={styles.symbol} aria-hidden="true">
            ♧
          </span>
          All booked services
        </div>
      </div>
      <div>
        {services.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </div>
    </article>
  )
}
