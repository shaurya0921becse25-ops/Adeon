import { useState } from 'react'
import styles from './ServiceItem.module.css'

/**
 * ServiceItem component
 * Displays a booked service item with thumbnail, details, date, and confirmation badge.
 *
 * @param {Object} props
 * @param {Object} props.service
 */
export default function ServiceItem({ service }) {
  const { name, type, location, dates, status, image } = service
  const [imgSrc, setImgSrc] = useState(image)

  return (
    <div className={styles.service}>
      <img
        src={imgSrc}
        alt=""
        aria-hidden="true"
        className={styles.serviceImg}
        onError={() =>
          setImgSrc(
            'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=120&q=80',
          )
        }
        loading="lazy"
      />
      <div className={styles.serviceBody}>
        <div className={styles.serviceName}>{name}</div>
        <div className={styles.serviceMeta}>
          {type} · {location}
        </div>
        <div className={styles.serviceDate}>{dates}</div>
      </div>
      <span className={styles.status}>{status}</span>
    </div>
  )
}
