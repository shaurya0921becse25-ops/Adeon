import styles from './CoverBanner.module.css'

/**
 * CoverBanner component
 * Renders the top panoramic cover banner for the profile.
 *
 * @param {Object} props
 * @param {string} [props.imageUrl] - Background image URL
 * @param {string} [props.ariaLabel] - Accessible description of the banner
 */
export default function CoverBanner({
  imageUrl = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85',
  ariaLabel = 'Scenic coastal cover photo',
}) {
  return (
    <div
      className={styles.cover}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(250, 247, 240, 0.25), rgba(250, 247, 240, 0.05)), url('${imageUrl}')`,
      }}
      role="img"
      aria-label={ariaLabel}
    />
  )
}
