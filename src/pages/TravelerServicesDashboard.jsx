import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Compass, Calendar, MessageSquare, Heart, Star, Sparkles,
  SlidersHorizontal, RotateCcw, AlertTriangle, Check
} from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import {
  selectServiceRows,
  selectSavedIds,
  selectCompareServiceIds,
  selectUnreadMessagesCount,
  selectBookingUpdateCount,
  toggleSaved,
  toggleCompareService,
  clearCompareServices
} from '../store/servicesSlice';

import StickyTripContextBar from '../components/services/StickyTripContextBar';
import PebbleFilters from '../components/services/PebbleFilters';
import FilterDrawer from '../components/services/FilterDrawer';
import ServiceRow from '../components/services/ServiceRow';
import CompareServicesModal from '../components/services/CompareServicesModal';
import ServiceDetailModal from '../components/services/ServiceDetailModal';
import BookingFlowModal from '../components/services/BookingFlowModal';
import TalkToGuideView from '../components/services/TalkToGuideView';
import BookingsView from '../components/services/BookingsView';
import ReviewsView from '../components/services/ReviewsView';
import SavedServicesView from '../components/services/SavedServicesView';
import Skeleton from '../components/common/Skeleton';
import Button from '../components/common/Button';

import './TravelerServicesDashboard.css';

const VIEWS = [
  { id: 'discover', label: 'Discover' },
  { id: 'bookings', label: 'Bookings', hasBadge: 'bookings' },
  { id: 'messages', label: 'Messages', hasBadge: 'messages' },
  { id: 'saved', label: 'Saved', hasBadge: 'saved' },
  { id: 'reviews', label: 'My reviews' }
];

export default function TravelerServicesDashboard() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Trip Context
  const { city, date, partySize, budget } = useTripContext();

  // Redux Selectors
  const allServiceRows = useSelector(selectServiceRows);
  const savedIds = useSelector(selectSavedIds);
  const compareIds = useSelector(selectCompareServiceIds);
  const unreadMessagesCount = useSelector(selectUnreadMessagesCount);
  const bookingUpdatesCount = useSelector(selectBookingUpdateCount);

  // Active View Tab from URL query param e.g. ?view=bookings
  const currentViewParam = searchParams.get('view') || 'discover';
  const activeView = VIEWS.some((v) => v.id === currentViewParam)
    ? currentViewParam
    : 'discover';

  const setActiveView = (viewId) => {
    setSearchParams({ view: viewId });
  };

  // Discover Filters State
  const [activeType, setActiveType] = useState('All');
  const [priceMax, setPriceMax] = useState(10000);
  const [language, setLanguage] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [onlyAvailableOnDate, setOnlyAvailableOnDate] = useState(false);
  const [sortOption, setSortOption] = useState('best_match');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSimulatingFilter, setIsSimulatingFilter] = useState(false);

  // Modals & Slide-overs State
  const [detailService, setDetailService] = useState(null);
  const [bookingService, setBookingService] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [directMessageGuideId, setDirectMessageGuideId] = useState(null);
  const [directReviewBooking, setDirectReviewBooking] = useState(null);

  // Trigger brief skeleton loading on filter/sort change
  const handleTypeChange = (type) => {
    setActiveType(type);
    triggerFilterSkeleton();
  };

  const triggerFilterSkeleton = () => {
    setIsSimulatingFilter(true);
    setTimeout(() => setIsSimulatingFilter(false), 240);
  };

  const handleResetFilters = () => {
    setActiveType('All');
    setPriceMax(10000);
    setLanguage('All');
    setMinRating(0);
    setOnlyAvailableOnDate(false);
    setSortOption('best_match');
    triggerFilterSkeleton();
  };

  // Filter & Sort Logic for Discover view
  const filteredServices = useMemo(() => {
    return allServiceRows
      .filter((s) => {
        // Destination matching (defaults to selected city from trip context)
        if (city && s.city.toLowerCase() !== city.toLowerCase()) {
          return false;
        }
        // Service type filter
        if (activeType !== 'All' && s.type !== activeType) {
          return false;
        }
        // Price max filter
        if (s.price > priceMax) {
          return false;
        }
        // Language filter
        if (language !== 'All' && !(s.guide?.languages || []).includes(language)) {
          return false;
        }
        // Rating filter
        if (minRating > 0 && (s.rating || 0) < minRating) {
          return false;
        }
        // Date availability filter
        if (onlyAvailableOnDate && date && !s.availability?.includes(date)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price_low') return a.price - b.price;
        if (sortOption === 'price_high') return b.price - a.price;
        if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortOption === 'soonest') {
          const aFirst = a.availability?.[0] || '9999';
          const bFirst = b.availability?.[0] || '9999';
          return aFirst.localeCompare(bFirst);
        }
        // Default best match: verified guides first, then ratings
        if (a.guide?.verified !== b.guide?.verified) {
          return a.guide?.verified ? -1 : 1;
        }
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [
    allServiceRows,
    city,
    activeType,
    priceMax,
    language,
    minRating,
    onlyAvailableOnDate,
    date,
    sortOption
  ]);

  // Services selected for comparison
  const comparedServices = useMemo(() => {
    return allServiceRows.filter((s) => compareIds.includes(s.id));
  }, [allServiceRows, compareIds]);

  // Actions
  const handleOpenMessage = (svc) => {
    setDirectMessageGuideId(svc.guideId);
    setActiveView('messages');
  };

  const handleOpenBooking = (svc) => {
    setBookingService(svc);
  };

  const handleBookingSuccess = () => {
    setActiveView('bookings');
  };

  return (
    <main id="main-content" className="traveler-services-page">
      {/* Top Page Header */}
      <div className="container services-page-header">
        <div className="header-eyebrow">
          <Sparkles size={14} />
          <span>ABEON LOCAL SERVICES</span>
        </div>
        <h1 className="services-page-title">
          Local Services & Verified Field Guides
        </h1>
        <p className="services-page-description">
          Sample walking tours, heritage food walks, private day drivers, and mountain trek leaders across {city || 'our pilot destinations'}. All profiles labelled demo.
        </p>

        {/* Five Underlined Views Navigation */}
        <nav
          className="services-views-nav"
          role="tablist"
          aria-label="Services Dashboard Views"
        >
          {VIEWS.map((tab) => {
            const isActive = activeView === tab.id;
            let badgeCount = null;
            if (tab.hasBadge === 'bookings' && bookingUpdatesCount > 0) {
              badgeCount = bookingUpdatesCount;
            } else if (tab.hasBadge === 'messages' && unreadMessagesCount > 0) {
              badgeCount = unreadMessagesCount;
            } else if (tab.hasBadge === 'saved' && savedIds.length > 0) {
              badgeCount = savedIds.length;
            }

            return (
              <button
                key={tab.id}
                type="button"
                className={`services-view-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveView(tab.id)}
                role="tab"
                aria-selected={isActive}
              >
                <span>{tab.label}</span>
                {badgeCount !== null && (
                  <span
                    className={`tab-count-pill ${
                      tab.hasBadge === 'messages' ? 'is-unread' : ''
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
                {isActive && <span className="tab-active-line" layoutId="activeTabUnderline" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sticky Trip Context Bar (drives destination, party size, date & budget) */}
      <StickyTripContextBar />

      {/* Main View Container */}
      <div className="container services-view-body">
        {/* VIEW 1: DISCOVER */}
        {activeView === 'discover' && (
          <div className="discover-view-stream">
            {/* Pebble Filters & Drawer Trigger */}
            <PebbleFilters
              activeType={activeType}
              onTypeChange={handleTypeChange}
              priceMax={priceMax}
              onPriceMaxChange={(val) => {
                setPriceMax(val);
                triggerFilterSkeleton();
              }}
              language={language}
              onLanguageChange={(val) => {
                setLanguage(val);
                triggerFilterSkeleton();
              }}
              minRating={minRating}
              onMinRatingChange={(val) => {
                setMinRating(val);
                triggerFilterSkeleton();
              }}
              onlyAvailableOnDate={onlyAvailableOnDate}
              onOnlyAvailableOnDateChange={(val) => {
                setOnlyAvailableOnDate(val);
                triggerFilterSkeleton();
              }}
              sortOption={sortOption}
              onSortChange={(val) => {
                setSortOption(val);
                triggerFilterSkeleton();
              }}
              onOpenDrawer={() => setIsFilterDrawerOpen(true)}
              onResetFilters={handleResetFilters}
              resultCount={filteredServices.length}
              chosenDate={date}
            />

            {/* Results Count Summary Banner */}
            <div className="discover-results-bar">
              <span className="results-count-text">
                Showing <strong>{filteredServices.length}</strong>{' '}
                {filteredServices.length === 1 ? 'service' : 'verified local services'} in{' '}
                <strong>{city || 'all destinations'}</strong>
              </span>

              {compareIds.length > 0 && (
                <span className="compare-bar-hint">
                  {compareIds.length} of 3 selected to compare
                </span>
              )}
            </div>

            {/* Skeleton Loading State or Editorial Rows */}
            {isSimulatingFilter ? (
              <div className="editorial-skeleton-list">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="editorial-skeleton-row">
                    <Skeleton width="105px" height="125px" borderRadius="40px 40px 10px 10px" />
                    <div className="skeleton-lines-col">
                      <Skeleton width="40%" height="18px" />
                      <Skeleton width="80%" height="28px" />
                      <Skeleton width="60%" height="16px" />
                    </div>
                    <div className="skeleton-price-col">
                      <Skeleton width="90px" height="24px" />
                      <Skeleton width="120px" height="16px" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="discover-empty-state">
                <AlertTriangle size={36} className="empty-warning-icon" />
                <h3 className="empty-title">No services match your active filters</h3>
                <p className="empty-sub">
                  Try adjusting the maximum price slider, party size, or clearing the date availability restriction.
                </p>
                <Button variant="outline" size="md" onClick={handleResetFilters}>
                  <RotateCcw size={14} /> Reset all filters
                </Button>
              </div>
            ) : (
              <div className="discover-editorial-rows" role="region" aria-label="Services list">
                {filteredServices.map((svc) => (
                  <ServiceRow
                    key={svc.id}
                    service={svc}
                    partySize={partySize}
                    tripBudget={budget}
                    travelDate={date}
                    isSaved={savedIds.includes(svc.id)}
                    isCompared={compareIds.includes(svc.id)}
                    compareCount={compareIds.length}
                    onToggleSave={(id) => dispatch(toggleSaved(id))}
                    onToggleCompare={(id) => dispatch(toggleCompareService(id))}
                    onViewDetail={(item) => setDetailService(item)}
                    onOpenMessage={handleOpenMessage}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: BOOKINGS */}
        {activeView === 'bookings' && (
          <BookingsView
            onMessageGuide={(guideId) => {
              setDirectMessageGuideId(guideId);
              setActiveView('messages');
            }}
            onOpenReviewForm={(booking) => {
              setDirectReviewBooking(booking);
              setActiveView('reviews');
            }}
            onExploreServices={() => setActiveView('discover')}
          />
        )}

        {/* VIEW 3: MESSAGES */}
        {activeView === 'messages' && (
          <TalkToGuideView initialGuideId={directMessageGuideId} />
        )}

        {/* VIEW 4: SAVED */}
        {activeView === 'saved' && (
          <SavedServicesView
            onViewDetail={(item) => setDetailService(item)}
            onOpenMessage={handleOpenMessage}
            onRequestBooking={handleOpenBooking}
            onOpenCompare={() => setIsCompareModalOpen(true)}
            onExploreServices={() => setActiveView('discover')}
            partySize={partySize}
          />
        )}

        {/* VIEW 5: REVIEWS */}
        {activeView === 'reviews' && (
          <ReviewsView
            prefilledBooking={directReviewBooking}
            onExploreServices={() => setActiveView('discover')}
          />
        )}
      </div>

      {/* Floating Compare Matrix Tray */}
      {compareIds.length > 0 && activeView === 'discover' && (
        <div className="floating-compare-tray" role="toolbar" aria-label="Comparison dock">
          <div className="compare-tray-inner">
            <span className="compare-tray-label">
              Comparing <strong>{compareIds.length}</strong> of 3 services
            </span>
            <div className="compare-tray-actions">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<SlidersHorizontal size={14} />}
                onClick={() => setIsCompareModalOpen(true)}
              >
                Compare matrix
              </Button>
              <button
                type="button"
                className="clear-compare-btn"
                onClick={() => dispatch(clearCompareServices())}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Modals */}
      {/* 1. Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        priceMax={priceMax}
        onPriceMaxChange={(val) => {
          setPriceMax(val);
          triggerFilterSkeleton();
        }}
        language={language}
        onLanguageChange={(val) => {
          setLanguage(val);
          triggerFilterSkeleton();
        }}
        minRating={minRating}
        onMinRatingChange={(val) => {
          setMinRating(val);
          triggerFilterSkeleton();
        }}
        onlyAvailableOnDate={onlyAvailableOnDate}
        onOnlyAvailableOnDateChange={(val) => {
          setOnlyAvailableOnDate(val);
          triggerFilterSkeleton();
        }}
        onResetFilters={handleResetFilters}
        chosenDate={date}
        totalMatchingCount={filteredServices.length}
      />

      {/* 2. Service Detail Slide-over */}
      {detailService && (
        <ServiceDetailModal
          isOpen={Boolean(detailService)}
          onClose={() => setDetailService(null)}
          service={detailService}
          partySize={partySize}
          tripBudget={budget}
          travelDate={date}
          onRequestBooking={handleOpenBooking}
          onOpenMessage={handleOpenMessage}
        />
      )}

      {/* 3. Booking Flow 3-Step Slide-over */}
      {bookingService && (
        <BookingFlowModal
          isOpen={Boolean(bookingService)}
          onClose={() => setBookingService(null)}
          service={bookingService}
          partySize={partySize}
          tripBudget={budget}
          travelDate={date}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* 4. Compare Services Matrix Modal */}
      {isCompareModalOpen && (
        <CompareServicesModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          services={comparedServices}
          partySize={partySize}
          tripBudget={budget}
          travelDate={date}
          onRemoveService={(id) => dispatch(toggleCompareService(id))}
          onSelectService={(item) => setDetailService(item)}
          onRequestBooking={handleOpenBooking}
        />
      )}
    </main>
  );
}
