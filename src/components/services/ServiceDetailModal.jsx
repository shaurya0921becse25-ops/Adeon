import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  X, Check, Star, ShieldCheck, Clock, Calendar, Users, IndianRupee,
  ThumbsUp, MessageSquare, PlusCircle, ArrowRight
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { voteHelpfulReview, attachServiceToItinerary, selectReviews } from '../../store/servicesSlice';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';
import './ServiceDetailModal.css';

export default function ServiceDetailModal({
  isOpen,
  onClose,
  service,
  partySize = 2,
  tripBudget = 25000,
  travelDate,
  onRequestBooking,
  onOpenMessage
}) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const allReviews = useSelector(selectReviews);

  const [reviewSort, setReviewSort] = useState('helpful'); // 'helpful' | 'newest' | 'highest'
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(travelDate || '');
  const [showItineraryPicker, setShowItineraryPicker] = useState(false);
  const [itineraryDay, setItineraryDay] = useState(1);

  if (!isOpen || !service) return null;

  const guide = service.guide || {};
  const isPerPerson = service.priceMode === 'person';
  const partyTotal = isPerPerson ? service.price * partySize : service.price;

  // Filter reviews for this service
  const serviceReviews = allReviews.filter((r) => r.serviceId === service.id);

  // Sort reviews
  const sortedReviews = [...serviceReviews].sort((a, b) => {
    if (reviewSort === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
    if (reviewSort === 'highest') return (b.rating || 0) - (a.rating || 0);
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  // Calculate histogram
  const totalRev = serviceReviews.length || 1;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  serviceReviews.forEach((r) => {
    const star = Math.round(r.rating || 5);
    if (ratingCounts[star] !== undefined) ratingCounts[star]++;
  });

  // Build next 14 calendar dates
  const calendarDates = [];
  const base = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const isAvail = service.availability?.includes(iso);
    calendarDates.push({ iso, dayName, dayNum, isAvail });
  }

  const handleHelpfulClick = (reviewId) => {
    dispatch(voteHelpfulReview(reviewId));
    showToast('Marked review as helpful', 'success');
  };

  const handleAttachToItinerary = () => {
    dispatch(
      attachServiceToItinerary({
        serviceId: service.id,
        day: itineraryDay,
        title: service.title,
        guideName: guide.name,
        price: service.price,
        partySize,
        total: partyTotal,
        date: selectedCalendarDate || travelDate || new Date().toISOString().slice(0, 10)
      })
    );
    showToast(`Attached to Day ${itineraryDay} of your Itinerary`, 'success');
    setShowItineraryPicker(false);
  };

  return (
    <div className="service-detail-backdrop" onClick={onClose}>
      <div
        className="service-detail-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        {/* Drawer Header */}
        <div className="service-detail-header">
          <div className="detail-header-city">
            <span>{service.city} &bull; {service.type}</span>
          </div>
          <button
            type="button"
            className="detail-close-btn"
            onClick={onClose}
            aria-label="Close service details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="service-detail-body">
          {/* Hero Section: Large Arch Portrait & Guide Identity */}
          <div className="detail-hero-section">
            <div className="detail-arch-wrap">
              <img
                src={guide.photo || '/images/guide-portrait.jpg'}
                alt={guide.name}
                className="detail-arch-img"
              />
              <span className="detail-demo-tag">demo profile</span>
            </div>

            <div className="detail-guide-info">
              <div className="detail-guide-header">
                <h3 className="detail-guide-name">{guide.name}</h3>
                {guide.verified && (
                  <span className="verified-pill">
                    <ShieldCheck size={12} /> verified guide
                  </span>
                )}
              </div>

              <div className="detail-guide-metrics">
                <span className="metric-item">
                  <Star size={14} className="star-filled" fill="currentColor" />
                  <strong>{service.rating || guide.rating || 4.9}</strong>
                  <span>({serviceReviews.length} reviews)</span>
                </span>
                <span className="meta-dot">&bull;</span>
                <span className="metric-item">
                  <Clock size={13} />
                  <span>Responds {guide.responseTime || '< 2h'}</span>
                </span>
                <span className="meta-dot">&bull;</span>
                <span className="metric-item">
                  <span>{(guide.languages || ['English']).join(', ')}</span>
                </span>
              </div>

              <p className="detail-guide-bio">{guide.bio}</p>
            </div>
          </div>

          {/* Service Title & Pricing Banner */}
          <div className="detail-service-banner">
            <div>
              <h2 id="detail-title" className="detail-service-title">
                {service.title}
              </h2>
              <div className="detail-service-specs">
                <span>Duration: <strong>{service.duration}</strong></span>
                <span className="meta-dot">&bull;</span>
                <span>
                  Capacity: <strong>{service.capacityMin || 1} to {service.capacityMax} guests</strong>
                </span>
              </div>
            </div>

            <div className="detail-pricing-pill">
              <div className="detail-base-price tabular-nums">
                <span className="price-num">{formatINR(service.price)}</span>
                <span className="price-mode">/{isPerPerson ? 'person' : 'group'}</span>
              </div>
              <div className="detail-party-computed tabular-nums">
                {formatINR(partyTotal)} for {partySize} guests
              </div>
            </div>
          </div>

          {/* Inclusions Checklist */}
          <div className="detail-section">
            <h4 className="detail-section-title">What is Included in This Service</h4>
            <div className="detail-inclusions-grid">
              {(service.inclusions || []).map((inc, i) => (
                <div key={i} className="detail-inclusion-item">
                  <div className="inclusion-check-icon">
                    <Check size={14} />
                  </div>
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Calendar (Upcoming 14 Days) */}
          <div className="detail-section">
            <div className="detail-section-row">
              <h4 className="detail-section-title">Availability Schedule</h4>
              <span className="calendar-note">Unavailable slots are struck through</span>
            </div>

            <div className="availability-calendar-strip">
              {calendarDates.map((item) => (
                <button
                  key={item.iso}
                  type="button"
                  className={`calendar-date-cell ${
                    item.isAvail ? 'is-available' : 'is-unavailable'
                  } ${selectedCalendarDate === item.iso ? 'is-selected' : ''}`}
                  onClick={() => item.isAvail && setSelectedCalendarDate(item.iso)}
                  disabled={!item.isAvail}
                  title={
                    item.isAvail
                      ? `Available on ${item.iso}`
                      : `Unavailable on ${item.iso}`
                  }
                >
                  <span className="cal-day-name">{item.dayName}</span>
                  <span className="cal-day-num">{item.dayNum}</span>
                  {!item.isAvail && <span className="cal-strike-line" aria-hidden="true" />}
                </button>
              ))}
            </div>
            {selectedCalendarDate && (
              <p className="cal-selected-hint">
                Selected date: <strong>{selectedCalendarDate}</strong>
              </p>
            )}
          </div>

          {/* Rating Histogram */}
          <div className="detail-section">
            <h4 className="detail-section-title">Guest Ratings & Feedback</h4>
            <div className="rating-histogram-box">
              <div className="histogram-summary">
                <span className="summary-big-rating tabular-nums">
                  {service.rating || guide.rating || 4.9}
                </span>
                <div className="summary-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} className="star-filled" fill="currentColor" />
                  ))}
                </div>
                <span className="summary-count-text">
                  Based on {serviceReviews.length} traveler reviews
                </span>
              </div>

              <div className="histogram-bars-list">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] || 0;
                  const pct = Math.round((count / totalRev) * 100);
                  return (
                    <div key={star} className="histogram-row">
                      <span className="hist-star-label">{star}★</span>
                      <div className="hist-bar-track">
                        <div
                          className="hist-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="hist-count-label tabular-nums">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List with Sort */}
          <div className="detail-section">
            <div className="detail-section-row">
              <h4 className="detail-section-title">
                Reviews ({serviceReviews.length})
              </h4>
              <div className="review-sort-wrap">
                <label htmlFor="review-sort" className="sr-only">
                  Sort reviews
                </label>
                <select
                  id="review-sort"
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  className="review-sort-select"
                >
                  <option value="helpful">Most helpful</option>
                  <option value="newest">Newest first</option>
                  <option value="highest">Highest rating</option>
                </select>
              </div>
            </div>

            <div className="reviews-cards-list">
              {sortedReviews.map((rev) => (
                <div key={rev.id} className="detail-review-card">
                  <div className="review-card-top">
                    <div>
                      <strong className="review-author">{rev.author}</strong>
                      <span className="review-date tabular-nums">{rev.date}</span>
                    </div>
                    <div className="review-stars-row">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} size={12} className="star-filled" fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <p className="review-body-text">{rev.text}</p>

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="review-tags-row">
                      {rev.tags.map((tag) => (
                        <span key={tag} className="review-tag-chip">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="review-footer">
                    <button
                      type="button"
                      className="helpful-vote-btn"
                      onClick={() => handleHelpfulClick(rev.id)}
                    >
                      <ThumbsUp size={13} />
                      <span>Helpful ({rev.helpful || 0})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="service-detail-footer">
          <div className="footer-price-col">
            <span className="footer-total-label">Total for party</span>
            <strong className="footer-total-val tabular-nums">
              {formatINR(partyTotal)}
            </strong>
          </div>

          <div className="footer-buttons-group">
            <Button
              variant="outline"
              size="md"
              leftIcon={<PlusCircle size={15} />}
              onClick={() => setShowItineraryPicker(!showItineraryPicker)}
            >
              Add to itinerary
            </Button>

            <Button
              variant="outline"
              size="md"
              leftIcon={<MessageSquare size={15} />}
              onClick={() => {
                onClose();
                onOpenMessage(service);
              }}
            >
              Message guide
            </Button>

            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight size={15} />}
              onClick={() => {
                onClose();
                onRequestBooking(service);
              }}
            >
              Request booking
            </Button>
          </div>
        </div>

        {/* Itinerary Day Picker Popover */}
        {showItineraryPicker && (
          <div className="itinerary-picker-popover">
            <div className="picker-header">
              <strong>Attach to Itinerary Day</strong>
              <button
                type="button"
                onClick={() => setShowItineraryPicker(false)}
                className="picker-close"
              >
                <X size={14} />
              </button>
            </div>
            <p className="picker-note">
              Choose which day in your plan to schedule this service.
            </p>
            <div className="day-options-row">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`day-option-btn ${itineraryDay === d ? 'is-active' : ''}`}
                  onClick={() => setItineraryDay(d)}
                >
                  Day {d}
                </button>
              ))}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAttachToItinerary}
              className="confirm-attach-btn"
            >
              Confirm Attachment ({formatINR(partyTotal)})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
