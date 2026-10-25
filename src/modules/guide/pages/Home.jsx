import React from "react";
import {
  CalendarDays,
  IndianRupee,
  Star,
  Clock,
  ShieldCheck,
  MapPin,
  Check,
  X,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../ui/StatCard";
import Card from "../ui/card";
import Badge from "../ui/badge";
import GlobeHero from "../ui/GlobeHero";
import ImageMarquee from "../ui/ImageMarquee";
import { useApp } from "../data/AppContext";

export default function Home() {
  const { services, bookings, profile, updateBookingStatus, selectedService } = useApp();

  const upcomingBookings = bookings.slice(0, 4);
  const featuredServices = services.slice(0, 3);

  // Compute live stats
  const totalBookingsCount = bookings.length;
  const totalEarningsVal = bookings
    .filter((b) => b.status === "Confirmed" || b.status === "Completed")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const upcomingTripsCount = bookings.filter(
    (b) => b.status === "Incoming" || b.status === "Confirmed"
  ).length;

  const pendingCount = bookings.filter((b) => b.status === "Incoming").length;

  return (
    <div className="home-container">
      {/* 1. Immersive 3D Globe Hero Section */}
      <GlobeHero
        profileName={profile.name.split(" ")[0]}
        pendingBookingsCount={pendingCount}
      />

      {/* 2. Infinite Destination Showcase Marquee */}
      <ImageMarquee />

      {/* 3. Quick Metrics with glowing icons & sparklines */}
      <div className="grid grid-4 metrics-grid">
        <StatCard
          icon={CalendarDays}
          label="Total Bookings"
          value={String(totalBookingsCount)}
          change="+18% this month"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${totalEarningsVal.toLocaleString("en-IN")}`}
          change="+12% growth"
        />
        <StatCard
          icon={Star}
          label="Host Rating"
          value="4.9"
          change="★ 24 reviews"
        />
        <StatCard
          icon={Clock}
          label="Active Trips"
          value={String(upcomingTripsCount)}
          change="Live departures"
        />
      </div>

      {/* 4. Main Dashboard Content Grid */}
      <div className="grid grid-main mt">
        <div className="left-stack">
          {/* Upcoming Appointments & Departures */}
          <Card className="dashboard-section-card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Upcoming Appointments &amp; Departures</h3>
                <p className="card-subtitle">
                  Confirmed traveler arrivals and pending requests
                </p>
              </div>
              <Link to="/bookings" className="link-btn-pill">
                View all ({bookings.length}) <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="appointments-list">
              {upcomingBookings.map((b) => (
                <div className="row-item-modern" key={b.id}>
                  <div className="row-thumb-wrap">
                    <img src={b.image} alt={b.service} className="row-thumb" />
                    <span className="row-thumb-badge">₹{b.amount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="row-info">
                    <p className="row-title">{b.service}</p>
                    <p className="row-meta">
                      <span className="meta-traveler">{b.traveler}</span>
                      <span className="meta-dot">·</span>
                      <span>{b.date} at {b.time}</span>
                      <span className="meta-dot">·</span>
                      <span>{b.travelers} traveler(s)</span>
                    </p>
                    <Link
                      to={`/bookings/${b.id}`}
                      className="link-details"
                    >
                      Booking Details <ArrowUpRight size={13} />
                    </Link>
                  </div>

                  <div className="row-right">
                    {b.status === "Incoming" ? (
                      <div className="action-buttons-group">
                        <button
                          className="btn btn-primary btn-sm btn-accept"
                          onClick={() => updateBookingStatus(b.id, "Confirmed")}
                          title="Accept Request"
                        >
                          <Check size={13} /> Accept
                        </button>
                        <button
                          className="btn btn-outline btn-sm btn-decline"
                          onClick={() => updateBookingStatus(b.id, "Cancelled")}
                          title="Decline"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <Badge status={b.status} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Featured Live Experiences with Progress Bars */}
          <Card className="dashboard-section-card mt">
            <div className="card-head">
              <div>
                <h3 className="card-title">Your Live Services</h3>
                <p className="card-subtitle">
                  Active listings available for booking across Himachal
                </p>
              </div>
              <Link to="/services" className="link-btn-pill">
                Manage listings <ArrowUpRight size={14} />
              </Link>
            </div>

            {selectedService && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#eff6ff",
                  border: "1.5px solid #bfdbfe",
                  borderRadius: 12,
                  padding: "10px 16px",
                  marginBottom: 16,
                  color: "#1e40af",
                  fontSize: "0.88rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "#2563eb",
                      boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.25)"
                    }}
                  />
                  <span>
                    Traveler is currently exploring: <strong>{selectedService.title}</strong> in User Guide
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontWeight: 700
                  }}
                >
                  Live Active View
                </span>
              </div>
            )}

            <div className="service-cards-grid">
              {featuredServices.map((s) => {
                // Decorative spots booking ratio
                const bookedCount = Math.max(1, Math.round(s.spots * 0.65));
                const percent = Math.min(100, Math.round((bookedCount / s.spots) * 100));
                const isSelected =
                  selectedService &&
                  (String(s.id) === String(selectedService.id) || s.title === selectedService.title);

                return (
                  <div
                    className={`service-mini-card ${isSelected ? "service-card-active-view" : ""}`}
                    key={s.id}
                    style={
                      isSelected
                        ? {
                            borderColor: "#2563eb",
                            boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.3)"
                          }
                        : {}
                    }
                  >
                    <div className="service-img-wrapper">
                      <img src={s.image} alt={s.title} loading="lazy" />
                      <div className="service-top-badges">
                        <span className="service-category-tag">{s.category}</span>
                        {isSelected ? (
                          <span
                            style={{
                              background: "#2563eb",
                              color: "#fff",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              padding: "3px 8px",
                              borderRadius: 8,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4
                            }}
                          >
                            <Sparkles size={11} /> Selected in User Guide
                          </span>
                        ) : (
                          <span className={`status-tag ${s.status.toLowerCase()}`}>
                            {s.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="service-mini-body">
                      <h4 className="service-title-text">{s.title}</h4>

                      {/* Capacity progress bar */}
                      <div className="service-capacity-wrap">
                        <div className="capacity-label-row">
                          <span>Capacity Filled</span>
                          <strong>{percent}%</strong>
                        </div>
                        <div className="capacity-bar-track">
                          <div
                            className="capacity-bar-fill"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="service-footer">
                        <div className="service-price-block">
                          <span className="service-currency">₹</span>
                          <span className="service-price-num">
                            {s.price.toLocaleString("en-IN")}
                          </span>
                          <span className="service-price-unit">/{s.unit}</span>
                        </div>
                        <span className="service-spots-badge">{s.spots} spots</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Stack */}
        <div className="right-stack">
          {/* Host Profile Preview Card */}
          <Card className="host-card-preview">
            <div className="host-banner-strip"></div>
            <div className="host-card-content">
              <div className="host-preview-top">
                <div className="host-avatar-wrapper">
                  <img
                    src={profile.avatar || "/agam-profile.jpg"}
                    alt={profile.name}
                    className="host-profile-img"
                  />
                  <div className="host-verified-icon" title="Verified Host">
                    <ShieldCheck size={14} />
                  </div>
                </div>

                <div className="host-text">
                  <div className="host-name-row">
                    <h4>{profile.name}</h4>
                  </div>
                  <p className="host-role-text">
                    <MapPin size={13} className="pin-icon" />
                    <span>{profile.location ? profile.location.split(",")[0] : "Himachal"}</span>
                  </p>
                </div>
              </div>

              <div className="host-badges-row">
                <span className="host-stat-pill">★ 4.9 Rating</span>
                <span className="host-stat-pill">{profile.experienceYears || 8} yrs exp</span>
                <span className="host-stat-pill">Himachal Native</span>
              </div>

              <p className="host-bio-snippet">"{profile.bio}"</p>

              <Link to="/profile" className="btn btn-outline btn-block mt-sm">
                Edit Host Profile
              </Link>
            </div>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="quick-actions-card mt">
            <div className="card-head">
              <h3 className="card-title">Quick Actions</h3>
              <Sparkles size={16} className="text-amber" />
            </div>

            <div className="quick-list">
              <Link to="/services/new" className="quick-action-link primary-action">
                <span className="action-icon-pill">+</span>
                <div className="action-text-wrap">
                  <span className="action-main-text">Add New Experience</span>
                  <span className="action-sub-text">Publish trail, trek or cultural walk</span>
                </div>
              </Link>

              <Link to="/calendar" className="quick-action-link">
                <span className="action-icon-pill">📅</span>
                <div className="action-text-wrap">
                  <span className="action-main-text">Availability Calendar</span>
                  <span className="action-sub-text">Block or open departure dates</span>
                </div>
              </Link>

              <Link to="/bookings" className="quick-action-link">
                <span className="action-icon-pill">📋</span>
                <div className="action-text-wrap">
                  <span className="action-main-text">Manage Bookings</span>
                  <span className="action-sub-text">Confirm guests and trip schedules</span>
                </div>
              </Link>

              <Link to="/messages" className="quick-action-link">
                <span className="action-icon-pill">💬</span>
                <div className="action-text-wrap">
                  <span className="action-main-text">Traveler Inquiries</span>
                  <span className="action-sub-text">Respond to traveler questions</span>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}