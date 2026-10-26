import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  X, Check, AlertTriangle, ArrowRight, ArrowLeft, Calendar,
  Users, User, Phone, FileText, ShieldCheck
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { addBooking, updateBookingStatus } from '../../store/servicesSlice';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { broadcastDataChange } from '../../modules/user-guide/data/sharedDataBridge';
import './BookingFlowModal.css';

export default function BookingFlowModal({
  isOpen,
  onClose,
  service,
  partySize: initialPartySize = 2,
  tripBudget = 25000,
  travelDate: initialTravelDate = '',
  onBookingSuccess
}) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [step, setStep] = useState(1);

  // Step 1: Date & Party Size
  const availableDates = service?.availability || [];
  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialTravelDate && availableDates.includes(initialTravelDate)) {
      return initialTravelDate;
    }
    return availableDates[0] || '';
  });
  const [partySize, setPartySize] = useState(initialPartySize || 2);
  const [step1Error, setStep1Error] = useState('');

  // Step 2: Contact & Notes
  const [name, setName] = useState(user?.name || 'Aarav Mehta');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [notes, setNotes] = useState('');
  const [contactErrors, setContactErrors] = useState({});

  // Reset state when service changes
  useEffect(() => {
    if (service) {
      setStep(1);
      setSelectedDate(
        initialTravelDate && availableDates.includes(initialTravelDate)
          ? initialTravelDate
          : availableDates[0] || ''
      );
      setPartySize(initialPartySize || 2);
      setStep1Error('');
      setContactErrors({});
    }
  }, [service, initialTravelDate, initialPartySize]);

  if (!isOpen || !service) return null;

  const guide = service.guide || {};
  const isPerPerson = service.priceMode === 'person';
  const partyTotal = isPerPerson ? service.price * partySize : service.price;

  // Validate Step 1
  const handleNextStep1 = () => {
    if (!selectedDate) {
      setStep1Error('Please choose an available date for this service.');
      return;
    }
    if (partySize < (service.capacityMin || 1)) {
      setStep1Error(`Minimum group size for this service is ${service.capacityMin || 1}.`);
      return;
    }
    if (partySize > service.capacityMax) {
      setStep1Error(`Maximum capacity for this service is ${service.capacityMax} guests.`);
      return;
    }
    setStep1Error('');
    setStep(2);
  };

  // Validate Step 2
  const validatePhone = (p) => {
    // Allows 10-digit Indian numbers, with or without +91 / dashes / spaces
    const clean = p.replace(/[\s-]/g, '');
    return /^\+?[0-9]{10,13}$/.test(clean);
  };

  const handleNextStep2 = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(phone.trim())) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }

    setContactErrors({});
    setStep(3);
  };

  // Submit Booking
  const handleFinalSubmit = () => {
    const bookingId = `bk-${Date.now()}`;
    const bookingImage = service.coverImage || service.image || guide.photo || '/himalayan-trek.jpg';
    const newBooking = {
      id: bookingId,
      serviceId: service.id,
      serviceTitle: service.title,
      guideId: service.guideId,
      guideName: guide.name,
      guidePhoto: guide.photo || '/agam-profile.jpg',
      city: service.city,
      date: selectedDate,
      partySize,
      name: name.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      status: 'requested',
      total: partyTotal,
      image: bookingImage,
      coverImage: bookingImage,
      createdAt: new Date().toISOString()
    };

    dispatch(addBooking(newBooking));

    // Sync to guide store
    try {
      const savedGuideBookings = localStorage.getItem('abeon_bookings');
      const guideBookings = savedGuideBookings ? JSON.parse(savedGuideBookings) : [];
      const mappedGuideBooking = {
        id: bookingId,
        service: service.title,
        traveler: name.trim() || 'Traveler',
        email: user?.email || `${name.trim().toLowerCase().replace(/\s+/g, '') || 'traveler'}@gmail.com`,
        phone: phone.trim() || '+91 98765 43210',
        travelers: partySize,
        date: selectedDate,
        time: '09:00 AM',
        amount: partyTotal,
        status: 'Incoming',
        requests: notes.trim() || 'None.',
        image: bookingImage
      };
      const updatedGuideList = [mappedGuideBooking, ...guideBookings];
      localStorage.setItem('abeon_bookings', JSON.stringify(updatedGuideList));
      broadcastDataChange('bookings', updatedGuideList);
    } catch (err) {
      console.warn('Could not sync booking to guide store:', err);
    }

    showToast('Booking requested! Guide has been notified.', 'success');

    // 5-second automatic progression timer (status: requested -> accepted)
    setTimeout(() => {
      dispatch(
        updateBookingStatus({
          id: bookingId,
          status: 'accepted'
        })
      );
      try {
        const saved = localStorage.getItem('abeon_bookings');
        if (saved) {
          const list = JSON.parse(saved).map((gb) =>
            String(gb.id) === String(bookingId) ? { ...gb, status: 'Confirmed' } : gb
          );
          localStorage.setItem('abeon_bookings', JSON.stringify(list));
          broadcastDataChange('bookings', list);
        }
      } catch (e) {}
      showToast(`Guide ${guide.name || ''} accepted your booking for ${selectedDate}!`, 'success');
    }, 5000);

    onClose();
    if (onBookingSuccess) onBookingSuccess(newBooking);
  };

  const budgetPct = tripBudget > 0 ? Math.round((partyTotal / tripBudget) * 100) : 0;

  return (
    <div className="booking-modal-backdrop" onClick={onClose}>
      <div
        className="booking-modal-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-drawer-title"
      >
        {/* Header */}
        <div className="booking-modal-header">
          <div>
            <div className="booking-step-indicator">
              <span>STEP {step} OF 3</span>
              <span className="step-bar">
                <span
                  className="step-bar-fill"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </span>
            </div>
            <h3 id="booking-drawer-title" className="booking-modal-title">
              {step === 1 && 'Select Date & Party Size'}
              {step === 2 && 'Traveler Contact Details'}
              {step === 3 && 'Review Booking & Price Breakdown'}
            </h3>
          </div>
          <button
            type="button"
            className="booking-close-btn"
            onClick={onClose}
            aria-label="Close booking modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body based on step */}
        <div className="booking-modal-body">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="booking-step-content">
              {/* Service Quick Recap */}
              <div className="booking-svc-recap">
                <img
                  src={guide.photo || '/images/guide-portrait.jpg'}
                  alt={guide.name}
                  className="recap-arch-thumb"
                />
                <div>
                  <strong>{service.title}</strong>
                  <span className="recap-guide">with {guide.name} &bull; {service.city}</span>
                </div>
              </div>

              {/* Date selection */}
              <div className="booking-field-group">
                <label className="booking-field-label">
                  <Calendar size={14} />
                  <span>Choose Available Date</span>
                </label>
                <div className="available-dates-grid">
                  {availableDates.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`date-chip-btn ${selectedDate === d ? 'is-selected' : ''}`}
                      onClick={() => {
                        setSelectedDate(d);
                        setStep1Error('');
                      }}
                    >
                      <span className="chip-day tabular-nums">{d}</span>
                      {selectedDate === d && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Party size stepper */}
              <div className="booking-field-group">
                <label className="booking-field-label">
                  <Users size={14} />
                  <span>Party Size (Capacity: {service.capacityMin || 1} – {service.capacityMax} max)</span>
                </label>
                <div className="booking-stepper-row">
                  <button
                    type="button"
                    className="stepper-action-btn"
                    onClick={() => {
                      setPartySize((p) => Math.max(1, p - 1));
                      setStep1Error('');
                    }}
                    disabled={partySize <= 1}
                  >
                    &minus;
                  </button>
                  <span className="stepper-val tabular-nums">
                    {partySize} {partySize === 1 ? 'person' : 'guests'}
                  </span>
                  <button
                    type="button"
                    className="stepper-action-btn"
                    onClick={() => {
                      setPartySize((p) => Math.min(12, p + 1));
                      setStep1Error('');
                    }}
                    disabled={partySize >= 12}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Estimated Total Live Bar */}
              <div className="booking-live-price-box">
                <span>Estimated Total for {partySize} guests:</span>
                <strong className="live-price-val tabular-nums">{formatINR(partyTotal)}</strong>
              </div>

              {step1Error && (
                <div className="booking-error-banner" role="alert">
                  <AlertTriangle size={15} />
                  <span>{step1Error}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="booking-step-content">
              <div className="booking-field-group">
                <label htmlFor="b-name" className="booking-field-label">
                  <User size={14} />
                  <span>Full Name</span>
                </label>
                <input
                  id="b-name"
                  type="text"
                  className={`booking-input ${contactErrors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Aarav Mehta"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (contactErrors.name) setContactErrors((prev) => ({ ...prev, name: '' }));
                  }}
                />
                {contactErrors.name && (
                  <span className="field-error-text">{contactErrors.name}</span>
                )}
              </div>

              <div className="booking-field-group">
                <label htmlFor="b-phone" className="booking-field-label">
                  <Phone size={14} />
                  <span>Mobile Phone (for guide coordination)</span>
                </label>
                <input
                  id="b-phone"
                  type="tel"
                  className={`booking-input ${contactErrors.phone ? 'is-invalid' : ''}`}
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (contactErrors.phone) setContactErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                />
                {contactErrors.phone && (
                  <span className="field-error-text">{contactErrors.phone}</span>
                )}
              </div>

              <div className="booking-field-group">
                <label htmlFor="b-notes" className="booking-field-label">
                  <FileText size={14} />
                  <span>Notes / Dietary or Pacing Preferences</span>
                </label>
                <textarea
                  id="b-notes"
                  rows={3}
                  className="booking-textarea"
                  placeholder="e.g. One traveler prefers stairs-free loops; hotel pickup at Mall Road lift."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="booking-step-content">
              {/* Summary card */}
              <div className="booking-summary-card">
                <div className="summary-title-row">
                  <h4>{service.title}</h4>
                  <span className="summary-city-pill">{service.city}</span>
                </div>
                <div className="summary-meta-grid">
                  <div>
                    <span className="summary-lbl">Guide:</span>
                    <strong>{guide.name}</strong>
                  </div>
                  <div>
                    <span className="summary-lbl">Date:</span>
                    <strong className="tabular-nums">{selectedDate}</strong>
                  </div>
                  <div>
                    <span className="summary-lbl">Party Size:</span>
                    <strong className="tabular-nums">{partySize} {partySize === 1 ? 'guest' : 'guests'}</strong>
                  </div>
                  <div>
                    <span className="summary-lbl">Contact:</span>
                    <span>{name} ({phone})</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown-box">
                <h5 className="breakdown-title">Transparent Price Breakdown</h5>

                <div className="breakdown-line">
                  <span>
                    {isPerPerson
                      ? `${formatINR(service.price)} × ${partySize} guests`
                      : `Flat group rate (up to ${service.capacityMax} guests)`}
                  </span>
                  <span className="tabular-nums">{formatINR(partyTotal)}</span>
                </div>

                <div className="breakdown-line">
                  <span>Booking fee (Demo)</span>
                  <span className="tabular-nums">₹0</span>
                </div>

                <div className="breakdown-line breakdown-total">
                  <strong>Total Amount Payable</strong>
                  <strong className="total-rupees tabular-nums">{formatINR(partyTotal)}</strong>
                </div>

                {tripBudget > 0 && (
                  <div className="budget-fit-note">
                    <span>
                      Uses <strong>{budgetPct}%</strong> of your total ₹{tripBudget.toLocaleString('en-IN')} trip budget.
                    </span>
                  </div>
                )}
              </div>

              {/* Demo text regarding payments */}
              <div className="demo-payment-notice">
                <ShieldCheck size={16} />
                <div>
                  <strong>Pay the guide directly in person</strong>
                  <p>
                    No payment is collected online today. ABEON requests reserve your slot with the guide. Settle the ₹ amount directly via cash or UPI at the meetup.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="booking-modal-footer">
          {step > 1 && (
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft size={15} />}
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight size={15} />}
              onClick={step === 1 ? handleNextStep1 : handleNextStep2}
              className="footer-next-btn"
            >
              Continue to {step === 1 ? 'Details' : 'Review'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleFinalSubmit}
              className="footer-next-btn"
            >
              Confirm Request ({formatINR(partyTotal)})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
