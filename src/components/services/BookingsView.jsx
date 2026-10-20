import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Calendar, Users, IndianRupee, MessageSquare, PlusCircle, XCircle,
  CheckCircle2, Clock, Check, AlertCircle, ArrowRight
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import {
  selectBookings,
  updateBookingStatus,
  cancelBooking,
  attachServiceToItinerary
} from '../../store/servicesSlice';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';
import './BookingsView.css';

const STATUS_STEPS = ['requested', 'accepted', 'completed'];

export default function BookingsView({ onMessageGuide, onOpenReviewForm, onExploreServices }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const bookings = useSelector(selectBookings);

  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const handleCancelBooking = (bookingId) => {
    dispatch(cancelBooking({ id: bookingId }));
    showToast('Booking cancelled', 'info');
    setConfirmCancelId(null);
  };

  const handleMarkCompleted = (bookingId) => {
    dispatch(updateBookingStatus({ id: bookingId, status: 'completed' }));
    showToast('Booking marked as completed (Demo control)', 'success');
  };

  const handleAttachItinerary = (booking) => {
    dispatch(
      attachServiceToItinerary({
        serviceId: booking.serviceId,
        day: 1,
        title: booking.serviceTitle,
        guideName: booking.guideName,
        price: booking.total / (booking.partySize || 1),
        partySize: booking.partySize,
        total: booking.total,
        date: booking.date
      })
    );
    showToast(`Attached ${booking.serviceTitle} to itinerary`, 'success');
  };

  // Group bookings
  const requestedBookings = bookings.filter((b) => b.status === 'requested');
  const acceptedBookings = bookings.filter((b) => b.status === 'accepted');
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const declinedBookings = bookings.filter((b) => b.status === 'declined');

  const renderBookingCard = (b) => {
    const currentStepIdx = STATUS_STEPS.indexOf(b.status);
    const isCancelled = b.status === 'declined';

    return (
      <div key={b.id} className={`booking-timeline-card ${isCancelled ? 'is-declined' : ''}`}>
        {/* Top Meta: Title, City, Total */}
        <div className="bk-card-header">
          <div>
            <div className="bk-city-tag">{b.city}</div>
            <h4 className="bk-card-title">{b.serviceTitle}</h4>
            <span className="bk-guide-name">Guide: {b.guideName || 'Local Guide'}</span>
          </div>

          <div className="bk-total-col tabular-nums">
            <span className="bk-total-label">Total Amount</span>
            <strong className="bk-total-num">{formatINR(b.total)}</strong>
          </div>
        </div>

        {/* Progress Line: requested -> accepted -> completed */}
        {!isCancelled ? (
          <div className="bk-progress-line-wrap" aria-label={`Booking status: ${b.status}`}>
            <div className="bk-progress-track">
              <div
                className="bk-progress-fill"
                style={{
                  width:
                    currentStepIdx === 0
                      ? '15%'
                      : currentStepIdx === 1
                      ? '60%'
                      : '100%'
                }}
              />
            </div>

            <div className="bk-step-nodes">
              {STATUS_STEPS.map((s, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div
                    key={s}
                    className={`bk-step-node ${isPassed ? 'is-passed' : ''} ${
                      isCurrent ? 'is-current' : ''
                    }`}
                  >
                    <div className="step-circle">
                      {isPassed ? <Check size={10} strokeWidth={3} /> : idx + 1}
                    </div>
                    <span className="step-name">{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bk-declined-banner">
            <XCircle size={15} />
            <span>This booking has been cancelled or declined.</span>
          </div>
        )}

        {/* Details row: date, party, contact */}
        <div className="bk-details-row">
          <span className="bk-detail-chip">
            <Calendar size={13} />
            <strong className="tabular-nums">{b.date}</strong>
          </span>
          <span className="bk-detail-chip">
            <Users size={13} />
            <strong className="tabular-nums">{b.partySize} {b.partySize === 1 ? 'person' : 'guests'}</strong>
          </span>
          {b.notes && (
            <span className="bk-notes-snippet">
              Notes: "{b.notes}"
            </span>
          )}
        </div>

        {/* Actions Toolbar */}
        <div className="bk-card-actions">
          {/* Cancel Confirmation Overlay */}
          {confirmCancelId === b.id ? (
            <div className="cancel-confirm-box">
              <span>Are you sure you want to cancel?</span>
              <button
                type="button"
                className="confirm-cancel-yes"
                onClick={() => handleCancelBooking(b.id)}
              >
                Yes, cancel
              </button>
              <button
                type="button"
                className="confirm-cancel-no"
                onClick={() => setConfirmCancelId(null)}
              >
                Keep booking
              </button>
            </div>
          ) : (
            <>
              {/* Message guide */}
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<MessageSquare size={14} />}
                onClick={() => onMessageGuide(b.guideId)}
              >
                Message guide
              </Button>

              {/* Add to itinerary */}
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<PlusCircle size={14} />}
                onClick={() => handleAttachItinerary(b)}
              >
                Add to itinerary
              </Button>

              {/* Cancel action */}
              {b.status !== 'declined' && b.status !== 'completed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bk-cancel-btn"
                  onClick={() => setConfirmCancelId(b.id)}
                >
                  Cancel
                </Button>
              )}

              {/* Demo control: Mark completed */}
              {b.status === 'accepted' && (
                <button
                  type="button"
                  className="demo-complete-btn"
                  onClick={() => handleMarkCompleted(b.id)}
                  title="Demo control to test completed status & review flow"
                >
                  Mark completed (demo)
                </button>
              )}

              {/* Leave Review when completed */}
              {b.status === 'completed' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenReviewForm(b)}
                >
                  Review service
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bookings-view-container">
      {bookings.length === 0 ? (
        <div className="bookings-empty-state">
          <Calendar size={48} className="empty-icon" />
          <h3 className="empty-title">No bookings requested yet</h3>
          <p className="empty-sub">
            Discover local walking tours, food walks, or day drivers in your chosen city and request a booking slot.
          </p>
          <Button variant="primary" size="md" onClick={onExploreServices}>
            Explore local services
          </Button>
        </div>
      ) : (
        <div className="bookings-sections-stream">
          {/* 1. Accepted Bookings */}
          {acceptedBookings.length > 0 && (
            <div className="booking-group-section">
              <h3 className="group-heading">
                <span className="group-dot is-accepted" />
                Confirmed & Accepted ({acceptedBookings.length})
              </h3>
              <div className="group-cards-list">
                {acceptedBookings.map(renderBookingCard)}
              </div>
            </div>
          )}

          {/* 2. Requested Bookings */}
          {requestedBookings.length > 0 && (
            <div className="booking-group-section">
              <h3 className="group-heading">
                <span className="group-dot is-requested" />
                Pending Guide Confirmation ({requestedBookings.length})
              </h3>
              <div className="group-cards-list">
                {requestedBookings.map(renderBookingCard)}
              </div>
            </div>
          )}

          {/* 3. Completed Bookings */}
          {completedBookings.length > 0 && (
            <div className="booking-group-section">
              <h3 className="group-heading">
                <span className="group-dot is-completed" />
                Completed Services ({completedBookings.length})
              </h3>
              <div className="group-cards-list">
                {completedBookings.map(renderBookingCard)}
              </div>
            </div>
          )}

          {/* 4. Declined / Cancelled */}
          {declinedBookings.length > 0 && (
            <div className="booking-group-section">
              <h3 className="group-heading">
                <span className="group-dot is-declined" />
                Cancelled / Declined ({declinedBookings.length})
              </h3>
              <div className="group-cards-list">
                {declinedBookings.map(renderBookingCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
