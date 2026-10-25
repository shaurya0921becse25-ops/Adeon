import { useState } from 'react'
import CoverBanner from './CoverBanner'
import ProfileHead from './ProfileHead'
import ProfileTabs from './ProfileTabs'
import TripsPanel from './TripsPanel'
import CommentsPanel from './CommentsPanel'
import ServicesPanel from './ServicesPanel'
import EditProfileModal from './EditProfileModal'
import NoticeToast from './NoticeToast'
import ItineraryModal from './ItineraryModal'
import {
  initialProfileData,
  initialTripsData,
  initialCommentsData,
  initialServicesData,
} from '../../data/mockProfileData'
import styles from './Profile.module.css'

/**
 * Profile component
 * The master profile application replicating "adeon profile.html" with full
 * interactive React state, scoped CSS modules, and accessibility support.
 */
export default function Profile() {
  const [profile, setProfile] = useState(initialProfileData)
  const [trips] = useState(initialTripsData)
  const [comments] = useState(initialCommentsData)
  const [services] = useState(initialServicesData)
  const [activeTab, setActiveTab] = useState('trips')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState(null)
  const [activeItineraryTrip, setActiveItineraryTrip] = useState(null)

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
  }

  const handleNavigateTab = (tabKey) => {
    setActiveTab(tabKey)
    const tabsElement = document.getElementById('profile-nav-tabs')
    if (tabsElement) {
      const topOffset = tabsElement.getBoundingClientRect().top + window.scrollY - 10
      window.scrollTo({ top: topOffset, behavior: 'smooth' })
    }
  }

  const handleSaveProfile = (updatedFields) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedFields,
    }))
  }

  const handleViewItinerary = (trip) => {
    // Shows the exact notice format from adeon profile.html
    setNoticeMessage(`${trip.title} itinerary — connect this button to your itinerary details page.`)
    setActiveItineraryTrip(trip)
  }

  return (
    <main className={styles.page}>
      <CoverBanner
        imageUrl={profile.coverPhoto}
        ariaLabel="Scenic coastal cover photo"
      />

      <ProfileHead
        profile={profile}
        onEditProfile={() => setIsEditModalOpen(true)}
      />

      <ProfileTabs activeTab={activeTab} onSelectTab={handleTabChange} />

      {/* Tab Panel 1: Trips Overview */}
      <section
        id="tab-panel-trips"
        role="tabpanel"
        aria-labelledby="tab-btn-trips"
        className={`${styles.tabPanel} ${
          activeTab === 'trips' ? styles.tabPanelActive : ''
        }`}
      >
        <TripsPanel
          trips={trips}
          comments={comments}
          services={services}
          onNavigateTab={handleNavigateTab}
          onViewItinerary={handleViewItinerary}
        />
      </section>

      {/* Tab Panel 2: Community Comments */}
      <section
        id="tab-panel-comments"
        role="tabpanel"
        aria-labelledby="tab-btn-comments"
        className={`${styles.tabPanel} ${
          activeTab === 'comments' ? styles.tabPanelActive : ''
        }`}
      >
        <CommentsPanel
          comments={comments}
          totalCount={profile.stats.comments}
        />
      </section>

      {/* Tab Panel 3: Booked Services */}
      <section
        id="tab-panel-services"
        role="tabpanel"
        aria-labelledby="tab-btn-services"
        className={`${styles.tabPanel} ${
          activeTab === 'services' ? styles.tabPanelActive : ''
        }`}
      >
        <ServicesPanel services={services} />
      </section>

      {/* Edit Profile Modal Dialog */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        profile={profile}
        onSave={handleSaveProfile}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Interactive Itinerary Preview Modal */}
      <ItineraryModal
        trip={activeItineraryTrip}
        onClose={() => setActiveItineraryTrip(null)}
      />

      {/* Non-intrusive Itinerary Toast Notice */}
      <NoticeToast
        message={noticeMessage}
        onDismiss={() => setNoticeMessage(null)}
      />
    </main>
  )
}
