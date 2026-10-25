import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Heart,
  Clock,
  Smartphone,
  Globe2,
  Tag,
  CheckCircle2,
  Flame,
  Users,
  Calendar,
  CreditCard,
  Flag,
  MapPin,
  ChevronRight,
  PenLine,
  ShieldCheck,
  X,
  MessageSquare,
  Award
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useChat } from "../context/ChatContext";
import { getServiceById } from "../data/services";
import { getProviderById } from "../data/providers";
import { subscribeToDataChanges } from "../data/sharedDataBridge";
import { formatINR } from "../utils/pricing";
import "./ServiceDetailsPage.css";

export const ServiceDetailsPage = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const activeId = paramId || searchParams.get("id") || "guide-trek-1";
  const [service, setService] = useState(() => getServiceById(activeId));
  const [provider, setProvider] = useState(() => getProviderById(service?.providerId || "guide-agam"));

  useEffect(() => {
    const updated = getServiceById(activeId);
    setService(updated);
    setProvider(getProviderById(updated?.providerId || "guide-agam"));
  }, [activeId]);

  useEffect(() => {
    const unsub = subscribeToDataChanges((type) => {
      if (type === "services" || type === "profile") {
        const updated = getServiceById(activeId);
        setService(updated);
        setProvider(getProviderById(updated?.providerId || "guide-agam"));
      }
    });
    return () => unsub();
  }, [activeId]);

  const { bookings, addBooking, cancelBooking } = useBooking();
  const { unreadCount, startThreadWithGuide } = useChat();

  const serviceId = service?.id || "guide-trek-1";
  const serviceTitle = service?.title || "Himalayan Mountain Experience";
  const serviceImage = service?.coverImage || service?.image || "/himalayan-trek.jpg";
  const servicePrice = service?.price || 1500;
  const serviceDuration = service?.duration || "4 hours";

  // Check if this experience is currently booked and active
  const activeBooking = bookings.find(
    (b) =>
      (b.serviceId === serviceId ||
        b.serviceTitle === serviceTitle ||
        b.serviceTitle?.includes(serviceTitle)) &&
      (b.status === "Confirmed" || b.status === "Pending")
  );
  const isBooked = Boolean(activeBooking);

  const upcomingCount = bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Pending"
  ).length;

  const [modalOpen, setModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@gmail.com",
    confirmEmail: "sarah.johnson@gmail.com",
    phone: "+91 98765 43210"
  });

  const handleStartChatWithGuide = () => {
    if (startThreadWithGuide) {
      startThreadWithGuide(service, provider);
    }
    navigate("/chat");
  };

  const handleOpenBooking = () => {
    if (isBooked) return;
    setBookingStep(1);
    setModalOpen(true);
  };

  const handleCloseBooking = () => {
    setModalOpen(false);
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    addBooking({
      serviceId,
      serviceTitle,
      providerId: service?.providerId || "guide-agam",
      providerName: provider?.name || "Agam",
      coverImage: serviceImage,
      date: "2026-11-03",
      timeSlot: service?.availableTimeSlots?.[0] || "08:00 AM",
      guests: 1,
      totalPrice: servicePrice,
      instantConfirmation: true,
      traveller: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
      }
    });
    setBookingStep(2);
  };

  return (
    <div className="service-details-wrapper">
      {/* MAIN CONTENT CONTAINER */}
      <main className="container">
        {/* TOP BAR: Left Back Button & Right Nav Buttons */}
        <div className="top-back-bar">
          <button
            type="button"
            className="btn-back"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/trip"))}
            aria-label="Back to trip results"
          >
            <ArrowLeft size={18} />
            <span>Back to Trips</span>
          </button>

          <div className="service-top-actions">
            <Link to="/provider/guide-agam" className="top-action-pill" title="Guide Profile">
              <Award size={16} />
              <span>Guide ({provider?.name || "Agam"})</span>
            </Link>

            <Link to="/trips" className="top-action-pill" title="Trips">
              <span>Trips</span>
              {upcomingCount > 0 && (
                <span className="top-badge-count">{upcomingCount}</span>
              )}
            </Link>

            <Link to="/chat" className="top-action-pill" title="Chat with Guides">
              <MessageSquare size={16} />
              <span>Chat</span>
              {unreadCount > 0 && (
                <span className="top-badge-count">{unreadCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* SECTION 1: HERO & PRODUCT HEADER */}
        <section className="hero-section">
          <h1 className="product-title">
            {serviceTitle}
          </h1>

          <div className="product-meta-bar">
            <div className="meta-item">
              <div className="rating-stars">★★★★★</div>
              <span className="rating-text">{service?.rating || "4.9"}</span>
              <span>({service?.reviewCount || 48} Reviews)</span>
            </div>
            <span className="meta-pipe">|</span>
            <div className="meta-item">
              <CheckCircle2 size={16} color="var(--aegean-deep)" />
              <span>Host: {provider?.name || "Agam"} ({provider?.experienceYears || 8} yrs exp)</span>
            </div>
            <span className="meta-pipe">|</span>
            <span className="badge-excellence">Verified Mountain Guide</span>
            <span className="meta-pipe">|</span>
            <span>Himachal Pradesh, India</span>

            <div className="price-guarantee">
              <ShieldCheck size={14} />
              <span>Lowest Price Guarantee</span>
            </div>
          </div>

          <div className="hero-grid">
            <div>
              <div className="single-image-card">
                <img
                  src={serviceImage}
                  alt={serviceTitle}
                  onError={(e) => {
                    e.currentTarget.src = "/himalayan-trek.jpg";
                  }}
                />
                <div className="image-actions">
                  <button type="button" className="action-btn">
                    <Share2 size={16} /> Share
                  </button>
                  <button type="button" className="action-btn">
                    <Heart size={16} /> Add to Wishlist
                  </button>
                </div>
              </div>

              <div className="attribute-pills">
                <div className="pill-item">
                  <Clock size={18} />
                  <span>{serviceDuration}</span>
                </div>
                <div className="pill-item">
                  <Smartphone size={18} />
                  <span>Mobile ticket</span>
                </div>
                <div className="pill-item">
                  <Globe2 size={18} />
                  <span>Offered in: {provider?.languages?.join(", ") || "English, Hindi"}</span>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="booking-card">
              <div className="price-header">
                <span className="price-value">{formatINR(servicePrice)}</span>
                <a href="#price-breakdown" className="price-details-link">
                  Price details
                </a>
              </div>

              <div className="discount-tag">
                <Tag size={14} />
                <span>Discounted rates for children</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Tue, Nov 3"
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Traveler</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="1 Adult"
                    readOnly
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Start time</label>
                <select className="form-control" defaultValue="8:00 AM">
                  <option value="8:00 AM">8:00 AM</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                </select>
              </div>

              {/* Book Now / Booked State */}
              {isBooked ? (
                <div className="booked-container">
                  <button
                    type="button"
                    className="btn-book btn-booked"
                    disabled
                    title="This trip is already booked"
                  >
                    <CheckCircle2 size={18} />
                    <span>Booked</span>
                  </button>

                  <div className="booked-info-strip">
                    <div className="booked-msg">
                      <CheckCircle2 size={15} color="var(--success-green)" />
                      <span>
                        Active: <strong>{activeBooking?.id}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-cancel-action"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to cancel this booking?"
                          )
                        ) {
                          cancelBooking(
                            activeBooking.id,
                            "Cancelled by traveller from service details"
                          );
                        }
                      }}
                      title="Cancel booking to unlock rebooking"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-book"
                  onClick={handleOpenBooking}
                >
                  Book Now
                </button>
              )}

              <button
                type="button"
                className="btn-chat-guide-card"
                onClick={handleStartChatWithGuide}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "12px",
                  marginTop: "12px",
                  background: "#FAF7F0",
                  border: "1.5px solid #91B8C7",
                  color: "#2B4E5B",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <MessageSquare size={16} />
                <span>Chat with Guide ({provider?.name || "Agam"})</span>
              </button>

              <div className="cancellation-note">
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Free cancellation</strong> before 8:00 AM on Nov 2 (local time)
                </div>
              </div>

              <div className="advance-notice-banner">
                <Flame size={20} color="var(--aegean-deep)" style={{ flexShrink: 0 }} />
                <div className="advance-text">
                  <h5>Book ahead!</h5>
                  <p>On average, this is booked 9 days in advance.</p>
                </div>
              </div>

              <div className="solo-suitability">
                <Users size={16} />
                <span>
                  Great for <strong>solo travelers</strong> – ideal for meeting new people
                </span>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* SECTION 2: HIGHLIGHTS & KEY DETAILS */}
        <section>
          <div className="details-grid">
            <div className="detail-card-item">
              <div className="detail-icon-wrap">
                <Calendar size={20} />
              </div>
              <div className="detail-text">
                <h4>Free cancellation</h4>
                <p>Cancel up to 24 hours in advance for a full refund</p>
              </div>
            </div>

            <div className="detail-card-item">
              <div className="detail-icon-wrap">
                <CreditCard size={20} />
              </div>
              <div className="detail-text">
                <h4>Reserve now and pay later</h4>
                <p>Keep your travel plans flexible — book your spot and pay nothing today</p>
              </div>
            </div>

            <div className="detail-card-item">
              <div className="detail-icon-wrap">
                <Clock size={20} />
              </div>
              <div className="detail-text">
                <h4>Duration 2 hours</h4>
                <p>Check availability to see starting times</p>
              </div>
            </div>

            <div className="detail-card-item">
              <div className="detail-icon-wrap">
                <Flag size={20} />
              </div>
              <div className="detail-text">
                <h4>Live tour guide</h4>
                <p>English, Hindi</p>
              </div>
            </div>
          </div>

          <div className="highlights-box">
            <h2 className="highlights-title">Highlights</h2>
            <ul className="highlights-list">
              <li>Explore Shimla with a local guide from Himachal Pradesh</li>
              <li>Discover heritage sites on a guided walking tour</li>
              <li>Experience the charm of this historic hill station</li>
            </ul>
          </div>
        </section>

        <hr className="divider" />

        {/* SECTION 3: MEETUP POINT & REVIEWS */}
        <section>
          <h2 className="section-heading">Meeting and Pickup</h2>
          <div className="meetup-card">
            <div className="meetup-grid">
              <div>
                <div className="point-subhead">
                  <MapPin size={20} color="var(--aegean-deep)" />
                  <span>Meeting point</span>
                </div>
                <div className="point-address-title">Christ Church, Shimla</div>
                <div className="point-address-body">
                  453G+P9F, Ridge To US Club, The Mall, Shimla, Himachal Pradesh 171001, India
                </div>
                <a
                  href="https://maps.google.com/?q=Christ+Church+Shimla"
                  target="_blank"
                  rel="noreferrer"
                  className="map-link"
                >
                  <span>Open in Google Maps</span>
                  <ChevronRight size={14} />
                </a>
                <p className="point-instruction">
                  Guide will be meeting you outside the famous Christ Church in front of the main
                  Entrance.
                </p>
              </div>

              <div>
                <div className="point-subhead">
                  <Flag size={20} color="var(--aegean-deep)" />
                  <span>End point</span>
                </div>
                <div className="point-address-title">
                  Indian Institute of Advanced Study (IIAS)
                </div>
                <div style={{ height: "20px" }}></div>
                <a
                  href="https://maps.google.com/?q=IIAS+Shimla"
                  target="_blank"
                  rel="noreferrer"
                  className="map-link"
                >
                  <span>Open in Google Maps</span>
                  <ChevronRight size={14} />
                </a>
                <p className="point-instruction">
                  Guide will drop you outside the Main Entrance of the Indian Institute of Advanced
                  Study.
                </p>
              </div>
            </div>
          </div>

          <div className="reviews-header-flex">
            <h2 className="section-heading" style={{ marginBottom: 0 }}>
              Reviews
            </h2>
            <div className="review-tabs">
              <button type="button" className="tab-btn">Tips/Q&amp;A (21)</button>
              <button type="button" className="tab-btn" style={{ background: "var(--mist-blue)" }}>
                All reviews (2,102)
              </button>
            </div>
            <button type="button" className="btn-write-review">
              <PenLine size={16} />
              <span>Write a review</span>
            </button>
          </div>

          <div className="reviews-summary-card">
            <div className="score-box">
              <div className="score-number">4.4</div>
              <div className="score-label">Very Good</div>
              <div className="score-bubbles">●●●●◐</div>
              <span style={{ fontSize: "0.825rem", color: "var(--taupe-soft)" }}>
                (2,102 reviews)
              </span>
            </div>

            <div className="breakdown-list">
              <div className="breakdown-row">
                <span className="label-col">Excellent</span>
                <div className="bar-col">
                  <div className="bar-fill" style={{ width: "100%" }}></div>
                </div>
                <span className="count-col">1,074</span>
              </div>
              <div className="breakdown-row">
                <span className="label-col">Good</span>
                <div className="bar-col">
                  <div className="bar-fill" style={{ width: "71.3%" }}></div>
                </div>
                <span className="count-col">766</span>
              </div>
              <div className="breakdown-row">
                <span className="label-col">Average</span>
                <div className="bar-col">
                  <div className="bar-fill" style={{ width: "19.8%" }}></div>
                </div>
                <span className="count-col">213</span>
              </div>
              <div className="breakdown-row">
                <span className="label-col">Poor</span>
                <div className="bar-col">
                  <div className="bar-fill" style={{ width: "2.8%" }}></div>
                </div>
                <span className="count-col">30</span>
              </div>
              <div className="breakdown-row">
                <span className="label-col">Terrible</span>
                <div className="bar-col">
                  <div className="bar-fill" style={{ width: "1.7%" }}></div>
                </div>
                <span className="count-col">19</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL POPUP BACKDROP (BOOKING FLOW) */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={handleCloseBooking}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={handleCloseBooking}
            >
              <X size={18} />
            </button>

            {/* STEP 1: CONTACT DETAILS CARD */}
            {bookingStep === 1 && (
              <div className="account-details-wrapper">
                <div className="account-title-container">
                  <h2>Contact details</h2>
                </div>
                <div className="subheading-text">
                  We'll use this information to send you confirmation and updates about your booking
                </div>

                <div className="login-banner">
                  <Users size={18} color="var(--aegean-deep)" />
                  <span>
                    <button type="button">
                      <strong>Log in or Sign-up</strong>
                    </button>{" "}
                    for a faster checkout
                  </span>
                </div>

                <form onSubmit={handleSubmitContact}>
                  <div className="input-grid-2">
                    <div className="modal-field">
                      <label htmlFor="firstName">First name</label>
                      <input
                        type="text"
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="modal-field">
                      <label htmlFor="lastName">Last name</label>
                      <input
                        type="text"
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="modal-field">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="helper-text">We'll send booking confirmation emails here</div>
                  </div>

                  <div className="modal-field">
                    <label htmlFor="confirmEmail">Confirm Email</label>
                    <input
                      type="email"
                      id="confirmEmail"
                      required
                      value={formData.confirmEmail}
                      onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
                    />
                    <div className="helper-text">Just to ensure we got the right email.</div>
                  </div>

                  <div className="modal-field">
                    <label>Phone number</label>
                    <div className="phone-flex">
                      <button type="button" className="country-code-btn">
                        IN (+91) ▼
                      </button>
                      <input
                        type="tel"
                        required
                        style={{ flex: 1 }}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-submit-next">
                    Next
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: CELEBRATION & SUCCESS SUMMARY CARD */}
            {bookingStep === 2 && (
              <div className="success-card" style={{ display: "block" }}>
                <div className="celebration-banner">
                  <h3>🎉 Trip booked successfully!</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--taupe)" }}>
                    Your confirmation details have been sent to {formData.email}.
                  </p>
                </div>

                <div className="cart-item-summary">
                  <div className="summary-photo-row">
                    <img
                      src="https://dynamic-media.tacdn.com/media/photo-o/2f/11/aa/f1/caption.jpg?w=400&h=400&s=1"
                      alt="Shimla Tour"
                    />
                    <div className="summary-title">
                      Shimla Private Guided Walk Tour exploring the colonial trails
                    </div>
                  </div>

                  <ul className="summary-details-list">
                    <li>
                      <span>Traveler:</span>
                      <strong>1 Adult ({formData.firstName} {formData.lastName})</strong>
                    </li>
                    <li>
                      <span>Date &amp; Time:</span>
                      <strong>Tue, Nov 03, 2026 • 8:00 AM</strong>
                    </li>
                  </ul>

                  <div className="cancellation-free-tag">
                    <CheckCircle2 size={14} />
                    <span>Free cancellation before 8:00 AM on Nov 02, 2026</span>
                  </div>

                  <div className="total-price-row">
                    <span>Total price (INR)</span>
                    <span>₹1,490.00</span>
                  </div>
                </div>

                <div style={{ marginTop: "24px", textAlign: "center" }}>
                  <button
                    type="button"
                    className="btn-submit-next"
                    onClick={handleCloseBooking}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: FOOTER */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <Link to="/" className="brand-logo">
                <span className="brand-initial">A</span>
                <span>Abeon</span>
              </Link>
              <p className="footer-tagline">
                Connecting curious travellers with authentic local storytellers, master
                home-cooks, and certified mountain naturalists across Himachal Pradesh.
              </p>
              <div className="footer-guarantee">
                <ShieldCheck size={18} />
                <span>Verified local hosts &amp; transparent direct booking</span>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Shimla Experiences</h4>
              <ul className="footer-links">
                <li><Link to="/trip">Cooking Classes &amp; Dham</Link></li>
                <li><Link to="/trip">Colonial Heritage Walks</Link></li>
                <li><Link to="/trip">Highland Hikes &amp; Summits</Link></li>
                <li><Link to="/trip">Cedar Sanctuary 4x4 Safaris</Link></li>
                <li><Link to="/trip">Street Food &amp; Orchard Trails</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Upcoming Destinations</h4>
              <ul className="footer-links">
                <li><Link to="/trip">Manali &amp; Solang Valley</Link></li>
                <li><Link to="/trip">Dharamshala &amp; McLeodganj</Link></li>
                <li><Link to="/trip">Kasol &amp; Parvati Valley</Link></li>
                <li><Link to="/trip">Leh Ladakh High Passes</Link></li>
                <li><Link to="/trip">Rishikesh Himalayan Foothills</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Traveller Care</h4>
              <ul className="footer-links">
                <li><Link to="/trip">Manage My Trips</Link></li>
                <li><Link to="/trip">Guide Messenger</Link></li>
                <li><a href="mailto:hello@abeon.travel">Emergency Support</a></li>
                <li style={{ marginTop: "16px", fontSize: "0.8rem", opacity: 0.7 }}>
                  Curated with love in the Himalayas
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© 2026 Abeon Experiences. All rights reserved.</span>
            <div>Traveller-Side Only Edition • Porcelain &amp; Aegean Design System • Shimla, Himachal Pradesh</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceDetailsPage;
