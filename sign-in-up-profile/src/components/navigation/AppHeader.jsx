import styles from './AppHeader.module.css'

/**
 * AppHeader component
 * Provides top-level brand identity and seamless view navigation between
 * the primary Profile application and the Auth demo.
 *
 * @param {Object} props
 * @param {'profile'|'auth'} props.currentView
 * @param {(view: 'profile'|'auth') => void} props.onSelectView
 */
export default function AppHeader({ currentView, onSelectView }) {
  return (
    <header className={styles.header} role="banner">
      <a
        href="#profile"
        className={styles.brand}
        onClick={(e) => {
          e.preventDefault()
          onSelectView('profile')
        }}
        aria-label="ADEON Home"
      >
        <span className={styles.brandIcon} aria-hidden="true">
          ▲
        </span>
        ADEON
      </a>

      <nav className={styles.navLinks} aria-label="Main Navigation">
        <button
          type="button"
          className={`${styles.navBtn} ${
            currentView === 'profile' ? styles.active : ''
          }`}
          onClick={() => onSelectView('profile')}
          aria-current={currentView === 'profile' ? 'page' : undefined}
        >
          Profile
        </button>
        <button
          type="button"
          className={`${styles.navBtn} ${
            currentView === 'auth' ? styles.active : ''
          }`}
          onClick={() => onSelectView('auth')}
          aria-current={currentView === 'auth' ? 'page' : undefined}
        >
          Sign In / Sign Up
        </button>
      </nav>
    </header>
  )
}
