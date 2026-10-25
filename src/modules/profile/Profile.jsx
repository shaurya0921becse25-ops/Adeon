import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import CoverBanner from './CoverBanner'
import ProfileHead from './ProfileHead'
import ProfileTabs from './ProfileTabs'
import TripsPanel from './TripsPanel'
import CommentsPanel from './CommentsPanel'
import ServicesPanel from './ServicesPanel'
import MessagesPanel from './MessagesPanel'
import EditProfileModal from './EditProfileModal'
import NoticeToast from './NoticeToast'
import ItineraryModal from './ItineraryModal'
import {
  initialProfileData,
  initialTripsData,
  initialCommentsData,
  initialServicesData,
} from './mockProfileData'
import { TripRepository, SeedLoader } from '../itinerary/index.js'
import { initialBookings } from '../user-guide/data/bookings'
import { getInitialThreads } from '../user-guide/data/chats'
import { useAuth } from '../../context/AuthContext'
import styles from './Profile.module.css'

/**
 * Profile component
 * The master profile application replicating "adeon profile.html" with full
 * interactive React state, real dynamic WanderWise data (trips, bookings, comments, messages),
 * scoped CSS modules, and URL search param routing support.
 */
export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // 1. Initialise active tab from URL query params (e.g. ?tab=services, ?tab=trips, ?tab=messages)
  const initialTab = useMemo(() => {
    const requested = (searchParams.get('tab') || '').toLowerCase()
    if (requested === 'services' || requested === 'bookings') return 'services'
    if (requested === 'comments') return 'comments'
    if (requested === 'messages' || requested === 'chat') return 'messages'
    return 'trips'
  }, [searchParams])

  const [activeTab, setActiveTab] = useState(initialTab)

  // Keep state in sync if URL query parameter changes
  useEffect(() => {
    const param = (searchParams.get('tab') || '').toLowerCase()
    if (param === 'services' || param === 'bookings') {
      setActiveTab('services')
    } else if (param === 'comments') {
      setActiveTab('comments')
    } else if (param === 'messages' || param === 'chat') {
      setActiveTab('messages')
    } else if (param === 'trips' || param === 'history') {
      setActiveTab('trips')
    }
  }, [searchParams])

  // 2. Load Real WanderWise Trips from Itinerary Repository
  const [trips, setTrips] = useState(() => {
    try {
      if (typeof SeedLoader !== 'undefined' && SeedLoader.ensureInitialSeedLoaded) {
        SeedLoader.ensureInitialSeedLoaded()
      }
      const rawList = TripRepository.listTrips()
      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map((t) => ({
          id: t.id,
          title: t.title || t.destination || 'My Itinerary',
          dates:
            t.startDate && t.endDate
              ? `${t.startDate} – ${t.endDate}`
              : t.dates || 'Upcoming 2025',
          location: t.destination || t.location || 'Curated Route',
          desc:
            t.description ||
            t.desc ||
            'Custom structured trip created with WanderWise trip planner.',
          image:
            t.coverImageUrl ||
            t.image ||
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
          fallbackImage:
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
          alt: t.title || t.destination,
          rawTrip: t,
        }))
      }
    } catch (err) {
      console.warn('Failed to load trips from TripRepository:', err)
    }
    return initialTripsData
  })

  // 3. Load Real Booked Services from User Guide / Himora Storage
  const [services, setServices] = useState(() => {
    try {
      const stored = localStorage.getItem('himora_bookings_data')
      const rawBookings = stored ? JSON.parse(stored) : initialBookings
      if (Array.isArray(rawBookings) && rawBookings.length > 0) {
        return rawBookings.map((b) => ({
          id: b.id,
          name: b.serviceTitle || b.name || 'Guided Experience',
          type:
            b.providerRole ||
            (b.providerName ? `Hosted by ${b.providerName}` : b.type || 'Activity'),
          location: b.location || 'Himachal Pradesh, India',
          dates: b.date
            ? `${b.date}${b.timeSlot ? ` · ${b.timeSlot}` : ''}`
            : b.dates || 'Upcoming',
          status: b.status || 'Confirmed',
          image:
            b.coverImage ||
            b.image ||
            'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=120&q=80',
        }))
      }
    } catch (err) {
      console.warn('Failed to load booked services:', err)
    }
    return initialServicesData
  })

  // 4. Load Real User Community Comments from localStorage
  const [comments, setComments] = useState(() => {
    try {
      const storedComments = localStorage.getItem('ww_custom_comments')
      const customCommentsMap = storedComments ? JSON.parse(storedComments) : {}
      const userAdded = []
      Object.entries(customCommentsMap).forEach(([postId, list]) => {
        if (Array.isArray(list)) {
          list.forEach((c) => {
            userAdded.push({
              id: c.id,
              community: c.community || 'r/TravelDiscussion',
              time: c.time || 'Recently',
              title: c.postTitle || 'Community Discussion',
              excerpt: c.text,
              shortExcerpt:
                c.text && c.text.length > 60
                  ? c.text.substring(0, 57) + '...'
                  : c.text,
              image:
                c.image ||
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=120&q=80',
            })
          })
        }
      })
      if (userAdded.length > 0) {
        return [...userAdded, ...initialCommentsData]
      }
    } catch (err) {
      console.warn('Failed to load community comments:', err)
    }
    return initialCommentsData
  })

  // 5. Load Real Messages & Threads
  const [threads] = useState(() => {
    try {
      return getInitialThreads() || []
    } catch (err) {
      return []
    }
  })

  // 6. User Profile State (Persisted in localStorage with auth fallback)
  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem('ww_user_profile')
      if (savedProfile) {
        return JSON.parse(savedProfile)
      }
    } catch (err) {
      // fallback
    }
    return {
      ...initialProfileData,
      name: user?.name || initialProfileData.name,
      handle: user?.email ? `@${user.email.split('@')[0]}` : initialProfileData.handle,
      avatar: user?.avatar || initialProfileData.avatar,
    }
  })

  // Update dynamic stats based on actual real data
  const dynamicStats = useMemo(
    () => ({
      trips: trips.length,
      comments: comments.length,
      services: services.length,
      messages: threads.length,
    }),
    [trips.length, comments.length, services.length, threads.length]
  )

  const profileWithStats = useMemo(
    () => ({
      ...profile,
      stats: dynamicStats,
    }),
    [profile, dynamicStats]
  )

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState(null)
  const [activeItineraryTrip, setActiveItineraryTrip] = useState(null)

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setSearchParams({ tab: tabKey }, { replace: true })
  }

  const handleNavigateTab = (tabKey) => {
    handleTabChange(tabKey)
    const tabsElement = document.getElementById('profile-nav-tabs')
    if (tabsElement) {
      const topOffset = tabsElement.getBoundingClientRect().top + window.scrollY - 10
      window.scrollTo({ top: topOffset, behavior: 'smooth' })
    }
  }

  const handleSaveProfile = (updatedFields) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        ...updatedFields,
      }
      try {
        localStorage.setItem('ww_user_profile', JSON.stringify(updated))
      } catch (e) {
        console.warn('Could not save profile to localStorage', e)
      }
      return updated
    })
  }

  const handleViewItinerary = (trip) => {
    setActiveItineraryTrip(trip)
    setNoticeMessage(`${trip.title} itinerary loaded.`)
  }

  return (
    <main className={styles.page}>
      <CoverBanner
        imageUrl={profileWithStats.coverPhoto}
        ariaLabel="Scenic coastal cover photo"
      />

      <ProfileHead
        profile={profileWithStats}
        onEditProfile={() => setIsEditModalOpen(true)}
      />

      <ProfileTabs activeTab={activeTab} onSelectTab={handleTabChange} />

      {/* Tab Panel 1: Trips Overview / History */}
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

      {/* Tab Panel 2: Booked Services / My Bookings */}
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

      {/* Tab Panel 3: Messages & Conversations */}
      <section
        id="tab-panel-messages"
        role="tabpanel"
        aria-labelledby="tab-btn-messages"
        className={`${styles.tabPanel} ${
          activeTab === 'messages' ? styles.tabPanelActive : ''
        }`}
      >
        <MessagesPanel threads={threads} />
      </section>

      {/* Tab Panel 4: Community Comments */}
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
          totalCount={dynamicStats.comments}
        />
      </section>

      {/* Edit Profile Modal Dialog */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        profile={profileWithStats}
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
