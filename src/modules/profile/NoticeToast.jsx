import { useEffect } from 'react'
import styles from './NoticeToast.module.css'

/**
 * NoticeToast component
 * Non-blocking, accessible toast banner replicating the original alert message
 * while maintaining a seamless modern user experience.
 *
 * @param {Object} props
 * @param {string|null} props.message
 * @param {() => void} props.onDismiss
 * @param {number} [props.duration=4500]
 */
export default function NoticeToast({ message, onDismiss, duration = 4500 }) {
  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      onDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onDismiss])

  if (!message) return null

  return (
    <div
      className={styles.toastContainer}
      role="region"
      aria-live="polite"
      aria-label="Notification"
    >
      <div className={styles.toast}>
        <div className={styles.toastText}>
          <div className={styles.toastTitle}>Itinerary Notice</div>
          <div>{message}</div>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}
