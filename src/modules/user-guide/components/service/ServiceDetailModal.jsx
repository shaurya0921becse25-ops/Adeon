import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, Users, Calendar, Sparkles, MessageSquare } from "lucide-react";
import { Modal, Button, Stepper } from "../ui";
import { formatINR } from "../../utils/pricing";
import { formatDate, getAvailableDates } from "../../utils/dates";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import { useChat } from "../../context/ChatContext";
import { useToast } from "../../context/ToastContext";
import "./ServiceDetailModal.css";

export const ServiceDetailModal = ({
  isOpen,
  onClose,
  service
}) => {
  if (!isOpen || !service) return null;

  const navigate = useNavigate();
  const { user, isAuthenticated, openSignInModal } = useAuth();
  const { addBooking } = useBooking();
  const { ensureThreadForBooking, startThreadWithGuide } = useChat();
  const { addToast } = useToast();

  const handleChatWithGuide = () => {
    if (startThreadWithGuide) {
      startThreadWithGuide(service, { id: service.providerId, name: service.providerName });
    }
    onClose();
    navigate("/chat");
  };

  const availableDates = getAvailableDates(14);
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const calculateTotal = () => {
    if (
      service.priceUnit?.toLowerCase().includes("group") ||
      service.priceUnit?.toLowerCase().includes("jeep")
    ) {
      return service.price;
    }
    return service.price * guests;
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openSignInModal();
      return;
    }

    const total = calculateTotal();
    const newBooking = addBooking({
      serviceId: service.id,
      serviceTitle: service.title,
      providerId: service.providerId,
      providerName: service.providerName || "Local Guide",
      coverImage: service.coverImage,
      date: selectedDate,
      timeSlot: service.availableTimeSlots?.[0] || "10:00 AM",
      guests,
      totalPrice: total,
      instantConfirmation: true,
      traveller: {
        name: user?.name || "Traveller",
        email: user?.email || "traveller@example.com",
        phone: "+91 98201 00000",
        specialRequests: specialRequests.trim()
      },
      paymentMethod: "Direct Confirmation"
    });

    ensureThreadForBooking(newBooking);
    setConfirmedBooking(newBooking);
    setIsConfirmed(true);
    addToast("Booking confirmed! Your journey is all set.", "success");
  };

  const handleModalClose = () => {
    setIsConfirmed(false);
    setConfirmedBooking(null);
    setSpecialRequests("");
    setGuests(2);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isConfirmed ? "Booking Confirmed!" : "Service Details"}
    >
      {isConfirmed && confirmedBooking ? (
        /* Confirmation Screen Directly - NO PAYMENT */
        <div className="popup-confirmation-view text-center">
          <div className="popup-check-circle">
            <Check size={40} />
          </div>
          <h3 className="font-heading popup-confirm-heading">
            Booking Confirmed!
          </h3>
          <p className="text-taupe-soft" style={{ marginBottom: 16 }}>
            Booking Reference: <strong>{confirmedBooking.id}</strong>
          </p>

          <div className="popup-confirmed-summary">
            <div className="summary-row">
              <span>Experience:</span>
              <strong>{service.title}</strong>
            </div>
            <div className="summary-row">
              <span>Date:</span>
              <strong>{formatDate(confirmedBooking.date)}</strong>
            </div>
            <div className="summary-row">
              <span>People:</span>
              <strong>{confirmedBooking.guests} Person(s)</strong>
            </div>
            {confirmedBooking.traveller?.specialRequests && (
              <div className="summary-row">
                <span>Special Request:</span>
                <em>"{confirmedBooking.traveller.specialRequests}"</em>
              </div>
            )}
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total Amount:</span>
              <strong className="text-aegean-deep">{formatINR(confirmedBooking.totalPrice)}</strong>
            </div>
          </div>

          <div className="popup-action-row flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleChatWithGuide}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <MessageSquare size={16} />
              <span>Chat with Guide</span>
            </Button>
            <Button variant="primary" size="lg" onClick={handleModalClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        /* Little info + Book inputs */
        <form onSubmit={handleBookNow} className="popup-detail-content">
          <div className="popup-media-strip">
            <img src={service.coverImage} alt={service.title} className="popup-img" />
            <div className="popup-info-header">
              <span className="badge badge-aegean mb-1">{service.category}</span>
              <h3 className="popup-service-title font-heading">{service.title}</h3>
              <span className="text-xs text-taupe-soft">• {service.duration}</span>
            </div>
          </div>

          {/* Little Information Description */}
          <div className="popup-little-desc">
            <p>{service.description}</p>
          </div>

          {/* Highlights */}
          {service.highlights?.length > 0 && (
            <div className="popup-highlights-box">
              <span className="popup-box-label">Highlights:</span>
              <ul>
                {service.highlights.slice(0, 2).map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-taupe">
                    <Sparkles size={14} className="text-aegean-deep mt-1 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking Inputs */}
          <div className="popup-booking-fields">
            {/* Date selection */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Calendar size={15} /> Select Date
              </label>
              <select
                className="form-select"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {formatDate(d)}
                  </option>
                ))}
              </select>
            </div>

            {/* How many people stepper */}
            <div className="form-group flex items-center justify-between">
              <div>
                <label className="form-label flex items-center gap-2" style={{ marginBottom: 2 }}>
                  <Users size={15} /> How many people?
                </label>
                <span className="text-xs text-taupe-soft">
                  {formatINR(service.price)} /{service.priceUnit.replace("per ", "")}
                </span>
              </div>
              <Stepper
                value={guests}
                min={1}
                max={service.maxGuests || 10}
                onChange={setGuests}
              />
            </div>

            {/* Special Request */}
            <div className="form-group">
              <label className="form-label">Any Special Request? (Optional)</label>
              <input
                type="text"
                className="form-input"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Vegetarian only, morning slot preferred, need pickup..."
              />
            </div>

            {/* Total Amount */}
            <div className="popup-total-box flex items-center justify-between">
              <span className="font-semibold text-taupe-deep">Total Amount</span>
              <span className="popup-total-price font-heading">
                {formatINR(calculateTotal())}
              </span>
            </div>
          </div>

          {/* Action Button: Book Now */}
          <div className="popup-action-row flex items-center justify-between gap-3 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={handleChatWithGuide}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <MessageSquare size={15} />
              <span>Chat with Guide</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="lg">
                Confirm & Book ({formatINR(calculateTotal())})
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
