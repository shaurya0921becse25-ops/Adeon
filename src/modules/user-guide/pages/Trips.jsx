import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MessageSquare,
  AlertCircle,
  PlayCircle,
  ArrowLeft
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useChat } from "../context/ChatContext";
import { useToast } from "../context/ToastContext";
import { formatDate, getAvailableDates } from "../utils/dates";
import { formatINR } from "../utils/pricing";
import { Tabs, Button, Modal } from "../components/ui";
import "./Trips.css";

export const Trips = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking, rescheduleBooking, simulateMarkCompleted } = useBooking();
  const { ensureThreadForBooking } = useChat();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState("upcoming");

  // Reschedule Modal state
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState("");
  const availableDates = getAvailableDates(14);

  // Filter bookings by tab
  const upcomingBookings = bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Pending"
  );
  const completedBookings = bookings.filter((b) => b.status === "Completed");
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled");

  const handleOpenChat = (booking) => {
    ensureThreadForBooking(booking);
    navigate("/chat");
  };

  const handleCancel = (booking) => {
    if (window.confirm(`Are you sure you want to cancel ${booking.serviceTitle}?`)) {
      cancelBooking(booking.id, "Cancelled by user through My Trips");
      addToast("Your booking was cancelled.", "info");
    }
  };

  const handleConfirmReschedule = () => {
    if (rescheduleTarget && newDate) {
      rescheduleBooking(rescheduleTarget.id, newDate);
      addToast(`Booking rescheduled to ${formatDate(newDate)}.`, "success");
      setRescheduleTarget(null);
    }
  };

  const handleSimulateComplete = (bookingId) => {
    simulateMarkCompleted(bookingId);
    addToast("Service marked as Completed!", "success");
  };

  const tabList = [
    { id: "upcoming", label: "Upcoming", badge: upcomingBookings.length },
    { id: "completed", label: "Completed", badge: completedBookings.length },
    { id: "cancelled", label: "Cancelled", badge: cancelledBookings.length }
  ];

  const currentList =
    activeTab === "upcoming"
      ? upcomingBookings
      : activeTab === "completed"
      ? completedBookings
      : cancelledBookings;

  return (
    <div className="trips-page">
      <div className="container">
        <div style={{ paddingTop: "20px", marginBottom: "16px" }}>
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/trip"))}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "9999px",
              background: "#FFFFFF",
              border: "1.5px solid #91B8C7",
              color: "#2B4E5B",
              fontSize: "0.9rem",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(118, 95, 83, 0.08)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        <div className="trips-header-row">
          <div>
            <h1 className="trips-title font-heading">My Trips & Experiences</h1>
            <p className="trips-subtitle text-taupe-soft">
              Manage your upcoming mountain journeys and message your hosts.
            </p>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs tabs={tabList} activeTab={activeTab} onChange={setActiveTab} />

        {/* Trips Cards List */}
        <div className="trips-cards-list">
          {currentList.length > 0 ? (
            currentList.map((booking) => (
              <div key={booking.id} className="trip-booking-card">
                <div className="trip-card-media">
                  <img src={booking.coverImage} alt={booking.serviceTitle} />
                  <span className={`status-tag status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="trip-card-body">
                  <div className="trip-meta-top">
                    <span className="booking-ref">Ref: {booking.id}</span>
                    <span className="booking-cost font-semibold">{formatINR(booking.totalPrice)}</span>
                  </div>

                  <h3 className="trip-title font-heading">{booking.serviceTitle}</h3>

                  <div className="trip-specs-row">
                    <span className="spec-item">
                      <Calendar size={15} /> {formatDate(booking.date)}
                    </span>
                    <span className="spec-item">
                      <Clock size={15} /> {booking.timeSlot}
                    </span>
                    <span className="spec-item">
                      Hosted by: <strong>{booking.providerName}</strong>
                    </span>
                  </div>

                  {booking.status === "Cancelled" && booking.cancellationReason && (
                    <div className="cancellation-reason-note flex items-center gap-2">
                      <AlertCircle size={15} />
                      <span>{booking.cancellationReason}</span>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="trip-actions-row">
                    {/* Chat button for confirmed/pending/completed */}
                    {booking.status !== "Cancelled" && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleOpenChat(booking)}
                      >
                        <MessageSquare size={15} />
                        <span>Chat with Host</span>
                      </button>
                    )}

                    {/* Upcoming actions */}
                    {booking.status === "Confirmed" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setRescheduleTarget(booking);
                            setNewDate(booking.date);
                          }}
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-danger"
                          onClick={() => handleCancel(booking)}
                        >
                          Cancel
                        </button>

                        {/* Demo simulation button */}
                        <button
                          type="button"
                          className="simulation-btn"
                          title="Simulate service completion"
                          onClick={() => handleSimulateComplete(booking.id)}
                        >
                          <PlayCircle size={15} />
                          <span>Simulate: mark as completed</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="trips-empty-box text-center">
              <Calendar size={48} className="text-taupe-muted" style={{ margin: "0 auto 16px" }} />
              <h3 className="font-heading">No {activeTab} bookings</h3>
              <p className="text-taupe-soft" style={{ margin: "8px 0 20px" }}>
                Ready to explore the mountains of Shimla?
              </p>
              <Link to="/destination/shimla" className="btn btn-primary">
                Browse Shimla Experiences
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <Modal
          isOpen={!!rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          title="Reschedule Experience"
        >
          <div style={{ padding: "10px 0" }}>
            <p className="text-sm text-taupe-soft" style={{ marginBottom: 16 }}>
              Select a new date for <strong>{rescheduleTarget.serviceTitle}</strong>:
            </p>

            <div className="form-group">
              <label className="form-label">Available Dates</label>
              <select
                className="form-select"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              >
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {formatDate(d)}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action-row" style={{ marginTop: 24 }}>
              <Button variant="ghost" onClick={() => setRescheduleTarget(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmReschedule}>
                Confirm New Date
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
