import styles from './ProfileTabs.module.css'

/**
 * ProfileTabs component
 * Accessible tab navigation for Trips, Comments, and Booked Services.
 *
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab key ('trips' | 'comments' | 'services')
 * @param {(tabKey: string) => void} props.onSelectTab - Callback when a tab is selected
 */
export default function ProfileTabs({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'trips', label: 'Trips' },
    { id: 'services', label: 'Booked Services' },
    { id: 'messages', label: 'Messages' },
    { id: 'comments', label: 'Comments' },
  ]

  const handleKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length
      onSelectTab(tabs[nextIndex].id)
    } else if (event.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length
      onSelectTab(tabs[prevIndex].id)
    }
  }

  return (
    <nav
      className={styles.tabs}
      aria-label="Profile sections"
      role="tablist"
      id="profile-nav-tabs"
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-btn-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tab-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => onSelectTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            data-tab={tab.id}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
