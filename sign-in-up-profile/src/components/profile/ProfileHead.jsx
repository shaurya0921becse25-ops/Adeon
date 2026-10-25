import { useState } from 'react'
import ProfileStats from './ProfileStats'
import styles from './ProfileHead.module.css'

/**
 * ProfileHead component
 * Displays user identity (avatar, name, handle, bio, quote, stats) and edit action.
 *
 * @param {Object} props
 * @param {Object} props.profile
 * @param {() => void} props.onEditProfile
 */
export default function ProfileHead({ profile, onEditProfile }) {
  const { name, handle, bio, quote, avatar, stats } = profile
  const [imgSrc, setImgSrc] = useState(avatar)

  return (
    <section className={styles.profileHead} aria-label="Profile summary">
      <img
        className={styles.avatar}
        src={imgSrc}
        alt={`Avatar for ${name}`}
        onError={() => {
          setImgSrc(
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          )
        }}
      />
      <div className={styles.profileMain}>
        <div className={styles.nameRow}>
          <h1 className={styles.name} id="profileName">
            {name}
          </h1>
        </div>
        <div className={styles.handle} id="profileHandle">
          {handle.startsWith('@') ? handle : `@${handle}`}
        </div>
        <p className={styles.bio} id="profileBio">
          {bio}
        </p>
        <div className={styles.quote} id="profileQuote">
          {quote}
        </div>
        <ProfileStats stats={stats} />
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          id="editBtn"
          type="button"
          onClick={onEditProfile}
          aria-label="Edit Profile details"
        >
          Edit Profile
        </button>
      </div>
    </section>
  )
}
