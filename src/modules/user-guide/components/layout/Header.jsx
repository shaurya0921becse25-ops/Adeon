import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Compass, MessageSquare, User, Menu, X, RotateCcw } from "lucide-react";
import { appConfig } from "../../config/appConfig";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useBooking } from "../../context/BookingContext";
import { useToast } from "../../context/ToastContext";
import "./Header.css";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, openSignInModal, signOut } = useAuth();
  const { unreadCount, resetChats } = useChat();
  const { resetBookings } = useBooking();
  const { addToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [citySelectOpen, setCitySelectOpen] = useState(false);

  const handleResetDemo = () => {
    resetBookings();
    resetChats();
    addToast("Demo data successfully restored to pristine state!", "info");
  };

  const handleCityChange = (cityId) => {
    setCitySelectOpen(false);
    navigate(`/destination/${cityId}`);
  };

  return (
    <>
      {/* Top Demo Bar */}
      <div className="demo-notice-bar">
        <div className="container flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="demo-pill">DEMO MODE</span>
            <span>{appConfig.demoModeNotice}</span>
          </div>
          <button
            onClick={handleResetDemo}
            className="reset-demo-btn"
            title="Reset bookings, chats, and reviews to initial state"
          >
            <RotateCcw size={12} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="main-header">
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="brand-logo" aria-label="Himora Home">
              <span className="brand-initial">H</span>
              <span className="brand-text">{appConfig.appName}</span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="desktop-nav items-center gap-4">
            <Link
              to="/destination/shimla"
              className={`nav-link ${location.pathname.startsWith("/destination") ? "active" : ""}`}
            >
              Explore Experiences
            </Link>

            <Link
              to="/chat"
              className={`nav-link-icon ${location.pathname === "/chat" ? "active" : ""}`}
              aria-label="Messages"
              title="Messages with Guides"
            >
              <MessageSquare size={20} />
              {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
            </Link>

            {/* Auth / Avatar */}
            {isAuthenticated ? (
              <div className="user-profile-badge" onClick={openSignInModal} title="Account details">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar-small"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80";
                  }}
                />
                <span className="user-name-label">{user.name.split(" ")[0]}</span>
              </div>
            ) : (
              <button onClick={openSignInModal} className="btn btn-outline btn-sm">
                <User size={16} />
                <span>Sign in</span>
              </button>
            )}
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown-menu">
            <Link
              to="/destination/shimla"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Shimla Tours
            </Link>

            <Link
              to="/chat"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Messages with Guides
            </Link>
            <div className="mobile-auth-row">
              {isAuthenticated ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="user-avatar-small" />
                    <span className="font-semibold text-taupe-deep">{user.name}</span>
                  </div>
                  <button onClick={signOut} className="btn btn-ghost btn-sm text-xs">
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignInModal();
                  }}
                  className="btn btn-primary btn-sm btn-full"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
