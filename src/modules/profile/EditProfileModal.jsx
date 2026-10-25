import { useEffect, useRef, useState } from 'react'
import styles from './EditProfileModal.module.css'

/**
 * EditProfileModal component
 * An accessible dialog modal allowing users to edit display name, username handle,
 * bio, and personal quote with live validation.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is currently rendered
 * @param {Object} props.profile - Current profile data
 * @param {(updated: Object) => void} props.onSave - Callback when changes are saved
 * @param {() => void} props.onClose - Callback to close modal without saving
 */
export default function EditProfileModal({
  isOpen,
  profile,
  onSave,
  onClose,
}) {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={styles.modalBackdrop}
      id="editModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={handleBackdropClick}
    >
      <EditProfileForm
        profile={profile}
        onSave={onSave}
        onClose={onClose}
      />
    </div>
  )
}

function EditProfileForm({ profile, onSave, onClose }) {
  const [formData, setFormData] = useState(() => ({
    name: profile?.name || '',
    handle: (profile?.handle || '').replace(/^@/, ''),
    bio: profile?.bio || '',
    quote: profile?.quote || '',
  }))

  const nameInputRef = useRef(null)

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedName = formData.name.trim()
    const rawHandle = formData.handle.trim().replace(/^@/, '')
    const trimmedBio = formData.bio.trim()
    const trimmedQuote = formData.quote.trim()

    onSave({
      name: trimmedName,
      handle: `@${rawHandle}`,
      bio: trimmedBio,
      quote: trimmedQuote,
    })
    onClose()
  }

  return (
    <form
      className={styles.modal}
      id="profileForm"
      onSubmit={handleSubmit}
      noValidate={false}
    >
      <h2 className={styles.modalHeading} id="modalTitle">
        Edit profile
      </h2>

      <label className={styles.field} htmlFor="nameInput">
        Display name
        <input
          id="nameInput"
          name="name"
          ref={nameInputRef}
          className={styles.input}
          maxLength={60}
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
        />
      </label>

      <label className={styles.field} htmlFor="handleInput">
        Username
        <input
          id="handleInput"
          name="handle"
          className={styles.input}
          maxLength={30}
          required
          value={formData.handle}
          onChange={handleChange}
          placeholder="username"
        />
      </label>

      <label className={styles.field} htmlFor="bioInput">
        Bio
        <input
          id="bioInput"
          name="bio"
          className={styles.input}
          maxLength={120}
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
        />
      </label>

      <label className={styles.field} htmlFor="quoteInput">
        Quote
        <textarea
          id="quoteInput"
          name="quote"
          className={styles.textarea}
          maxLength={180}
          value={formData.quote}
          onChange={handleChange}
          placeholder="Favorite travel quote"
        />
      </label>

      <div className={styles.modalActions}>
        <button
          className={styles.btn}
          type="button"
          id="cancelBtn"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          type="submit"
        >
          Save changes
        </button>
      </div>
    </form>
  )
}
