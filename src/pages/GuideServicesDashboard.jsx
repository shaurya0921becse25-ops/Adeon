import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  MapPin, Calendar, Clock, Star, Users, CheckCircle, CheckCircle2, PlusCircle,
  MessageSquare, Shield, ShieldCheck, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  selectAllServices,
  selectBookings,
  selectThreads,
  updateBookingStatus
} from '../store/servicesSlice';
import { formatINR } from '../utils/formatters';
import Button from '../components/common/Button';
import GuideServiceModal from '../components/community/GuideServiceModal';
import './GuideServicesDashboard.css';

export default function GuideServicesDashboard() {
  const { user, userRole, setRole } = useAuth();
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const services = useSelector(selectAllServices);
  const bookings = useSelector(selectBookings);
  const threads = useSelector(selectThreads);

  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);

  // Guide's active services (Shimla guide by default in demo)
  const guideServices = services.slice(0, 3);

  const handleAcceptBooking = (bId) => {
    dispatch(updateBookingStatus({ id: bId, status: 'accepted' }));
    showToast('Booking request accepted! Traveler notified.', 'success');
  };

  const handleDeclineBooking = (bId) => {
    dispatch(updateBookingStatus({ id: bId, status: 'declined' }));
    showToast('Booking request declined.', 'info');
  };

  return (
    <main id="main-content" className="guide-dashboard-page">
      <div className="container guide-dashboard-inner">
        {/* Top Eyebrow & Title */}
        <div className="guide-header-box">
          <div className="guide-role-badge">
            <span className="guide-badge-dot" />
            <span>TEAMMATE GUIDE CONSOLE</span>
          </div>
          <div className="guide-title-row">
            <div>
              <h1 className="guide-dashboard-title">Local Guide Dashboard</h1>
              <p className="guide-dashboard-sub">
                Manage your verified local walking tours, accept incoming booking requests, and respond to traveler inquiries.
              </p>
            </div>
            <div className="guide-top-actions">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRole('traveler')}
              >
                Switch to traveler view
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<PlusCircle size={15} />}
                onClick={() => setIsNewServiceModalOpen(true)}
              >
                Add new service
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="guide-metrics-grid">
          <div className="metric-box">
            <span className="metric-lbl">Active Listings</span>
            <strong className="metric-val">{guideServices.length}</strong>
            <span className="metric-sub">Published in Shimla</span>
          </div>
          <div className="metric-box">
            <span className="metric-lbl">Pending Bookings</span>
            <strong className="metric-val">
              {bookings.filter((b) => b.status === 'requested').length}
            </strong>
            <span className="metric-sub">Awaiting confirmation</span>
          </div>
          <div className="metric-box">
            <span className="metric-lbl">Guide Rating</span>
            <strong className="metric-val">4.9 ★</strong>
            <span className="metric-sub">From 18 field reviews</span>
          </div>
          <div className="metric-box">
            <span className="metric-lbl">Response Time</span>
            <strong className="metric-val">&lt; 1h</strong>
            <span className="metric-sub">Top 5% local responder</span>
          </div>
        </div>

        {/* Incoming Bookings Section */}
        <section className="guide-section">
          <div className="section-header-row">
            <h3 className="section-title">Incoming Traveler Bookings</h3>
            <span className="section-count">{bookings.length} requests</span>
          </div>

          <div className="guide-bookings-list">
            {bookings.length === 0 ? (
              <p className="empty-text">No incoming booking requests right now.</p>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="guide-booking-item">
                  <div className="gbk-info">
                    <span className={`gbk-status-pill is-${b.status}`}>
                      {b.status}
                    </span>
                    <h4 className="gbk-title">{b.serviceTitle}</h4>
                    <div className="gbk-meta">
                      <span>Traveler: <strong>{b.name || 'Aarav Mehta'}</strong></span>
                      <span>&bull;</span>
                      <span className="tabular-nums">Date: {b.date}</span>
                      <span>&bull;</span>
                      <span>Party: {b.partySize} guests</span>
                      <span>&bull;</span>
                      <strong className="tabular-nums">{formatINR(b.total)}</strong>
                    </div>
                    {b.notes && <p className="gbk-notes">"{b.notes}"</p>}
                  </div>

                  <div className="gbk-actions">
                    {b.status === 'requested' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAcceptBooking(b.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeclineBooking(b.id)}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {b.status === 'accepted' && (
                      <span className="accepted-badge">
                        <CheckCircle2 size={15} /> Confirmed
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Published Services Section */}
        <section className="guide-section">
          <div className="section-header-row">
            <h3 className="section-title">Your Published Local Services</h3>
            <span className="section-count">{guideServices.length} active</span>
          </div>

          <div className="guide-services-list">
            {guideServices.map((svc) => (
              <div key={svc.id} className="guide-service-row">
                <div>
                  <h4 className="gsvc-title">{svc.title}</h4>
                  <div className="gsvc-meta">
                    <span>{svc.type} &bull; {svc.city}</span>
                    <span>&bull;</span>
                    <span>Max {svc.capacityMax} guests</span>
                    <span>&bull;</span>
                    <strong className="tabular-nums">
                      {formatINR(svc.price)}/{svc.priceMode}
                    </strong>
                  </div>
                </div>
                <div className="gsvc-status">
                  <span className="live-status-pill">Active Listing</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal for adding service */}
        <GuideServiceModal
          isOpen={isNewServiceModalOpen}
          onClose={() => setIsNewServiceModalOpen(false)}
        />
      </div>
    </main>
  );
}
