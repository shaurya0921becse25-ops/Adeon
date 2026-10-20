import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Menu, X, Compass, ChevronDown, Check, User, MapPin,
  LogOut, Calendar, MessageSquare, Heart, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { selectUnreadMessagesCount, selectBookingUpdateCount } from '../../store/servicesSlice';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home', path: '/', exact: true },
  { label: 'Services', path: '/services', hasDot: true },
  { label: 'Community', path: '/community' },
  { label: 'Itinerary', path: '/itinerary' },
  { label: 'Trip Match', path: '/trip-match' },
];

export default function Navbar() {
  const { user, userRole, setRole, logout, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadMessagesCount = useSelector(selectUnreadMessagesCount) || 0;
  const bookingUpdatesCount = useSelector(selectBookingUpdateCount) || 0;
  const hasUpdates = unreadMessagesCount > 0 || bookingUpdatesCount > 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Sliding pill state & refs
  const navLinksRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const roleMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  // Scroll listener for height shrink (80px -> 64px) + porcelain bg blur + progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 24);

      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalDocHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / totalDocHeight) * 100));
        setScrollProgress(pct);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Recalculate sliding Aegean pill position behind active link
  const updatePill = () => {
    if (!navLinksRef.current) return;
    const activeEl = navLinksRef.current.querySelector('.ww-nav-link.is-active');
    if (activeEl) {
      const containerRect = navLinksRef.current.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      setPillStyle({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
        opacity: 1
      });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useLayoutEffect(() => {
    // Small timeout to let route transition render active class
    const timer = setTimeout(updatePill, 40);
    window.addEventListener('resize', updatePill);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePill);
    };
  }, [location.pathname]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setRoleMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll and set up Focus Trap when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
          return;
        }

        if (e.key === 'Tab' && mobileDrawerRef.current) {
          const focusable = mobileDrawerRef.current.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select'
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Handle outside clicks for popovers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target)) {
        setRoleMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setRoleMenuOpen(false);
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const isHomeOrCommunity = location.pathname === '/' || location.pathname === '/community';

  return (
    <>
      {/* Accessible skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top scroll progress bar */}
      {isHomeOrCommunity && (
        <div
          className="ww-scroll-progress"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Reading progress"
        />
      )}

      <header
        className={`ww-navbar-wrap ${isScrolled ? 'is-scrolled' : 'is-transparent'}`}
        role="banner"
      >
        <div className="container ww-navbar-inner">
          {/* Left: Brand Logo & Looping Pin Mark */}
          <Link to="/" className="ww-brand" aria-label="ABEON Home">
            <svg
              className="ww-brand__icon"
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="36" height="36" rx="9" fill="#1A1A2E" />
              <path
                d="M8 25 C8 18 15 17 17 21 C19 25 24 24 23 18 C22 13 16 12 16 17 C16 20 20 20 22 17"
                stroke="#91B8C7"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="3 2"
              />
              <circle cx="8" cy="25" r="2.2" fill="var(--color-taupe)" />
              <path
                d="M25 11.5 C25 9.5 23.3 7.8 21.3 7.8 C19.3 7.8 17.6 9.5 17.6 11.5 C17.6 14.6 21.3 18 21.3 18 C21.3 18 25 14.6 25 11.5 Z"
                fill="var(--color-aegean-deep)"
              />
              <circle cx="21.3" cy="11.5" r="1.4" fill="#FFFFFF" />
            </svg>
            <span className="ww-brand__text">ABEON</span>
          </Link>

          {/* Centre: Desktop Navigation with sliding Aegean pill */}
          <nav
            ref={navLinksRef}
            className="ww-nav-links"
            aria-label="Primary Navigation"
          >
            {/* Sliding Aegean pill */}
            <span
              className="ww-nav-sliding-pill"
              style={{
                transform: `translateX(${pillStyle.left}px)`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.opacity
              }}
              aria-hidden="true"
            />

            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `ww-nav-link ${isActive ? 'is-active' : ''}`
                }
                end={item.exact}
              >
                <span>{item.label}</span>
                {item.hasDot && hasUpdates && (
                  <span
                    className="ww-nav-dot"
                    title="Unread messages or booking updates"
                    aria-label="New updates available"
                  />
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Controls & Profile Menu */}
          <div className="ww-nav-actions">

            {user ? (
              <div className="ww-user-controls">
                {/* Role Switcher Pill */}
                <div className="ww-role-popover-wrap" ref={roleMenuRef}>
                  <button
                    type="button"
                    className="ww-role-badge-btn"
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    aria-expanded={roleMenuOpen}
                    aria-haspopup="menu"
                    title="Click to switch role"
                  >
                    <span
                      className={`ww-role-indicator ${
                        userRole === 'guide' ? 'is-guide' : 'is-traveler'
                      }`}
                    />
                    <span className="ww-role-label">
                      {userRole === 'guide' ? 'Local Guide' : 'Traveler'}
                    </span>
                    <ChevronDown size={14} strokeWidth={1.5} />
                  </button>

                  {roleMenuOpen && (
                    <div className="ww-role-menu" role="menu">
                      <div className="ww-role-menu__header">
                        <small>SWITCH VIEWING ROLE</small>
                      </div>
                      <button
                        type="button"
                        className={`ww-role-menu__item ${
                          userRole === 'traveler' ? 'is-selected' : ''
                        }`}
                        onClick={() => {
                          setRole('traveler');
                          setRoleMenuOpen(false);
                        }}
                        role="menuitem"
                      >
                        <Compass size={16} strokeWidth={1.5} />
                        <div>
                          <strong>Traveler</strong>
                          <p>Discover local guides, request services & track bookings</p>
                        </div>
                        {userRole === 'traveler' && (
                          <Check size={16} className="ww-check-icon" />
                        )}
                      </button>

                      <button
                        type="button"
                        className={`ww-role-menu__item ${
                          userRole === 'guide' ? 'is-selected' : ''
                        }`}
                        onClick={() => {
                          setRole('guide');
                          setRoleMenuOpen(false);
                        }}
                        role="menuitem"
                      >
                        <MapPin size={16} strokeWidth={1.5} />
                        <div>
                          <strong>Local Guide</strong>
                          <p>Manage listings, view incoming requests & field notes</p>
                        </div>
                        {userRole === 'guide' && (
                          <Check size={16} className="ww-check-icon" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Avatar Menu with notification dot */}
                <div className="ww-avatar-menu-wrap" ref={userMenuRef}>
                  <button
                    type="button"
                    className="ww-avatar-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                    aria-label="User account menu"
                  >
                    <Avatar
                      src={user.avatar}
                      name={user.name}
                      size="sm"
                      status={userRole === 'guide' ? 'guide' : null}
                    />
                    {hasUpdates && (
                      <span
                        className="ww-avatar-dot"
                        title="Unread messages or booking updates"
                        aria-label="New notifications"
                      />
                    )}
                  </button>

                  {userMenuOpen && (
                    <div className="ww-avatar-dropdown" role="menu">
                      <div className="ww-avatar-dropdown__profile">
                        <strong>{user.name}</strong>
                        <small>{user.handle || user.email}</small>
                      </div>
                      <div className="ww-avatar-dropdown__divider" />

                      {/* 1. My Profile */}
                      <Link
                        to="/profile"
                        className="ww-avatar-dropdown__item"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <User size={15} strokeWidth={1.5} />
                        <span>My profile</span>
                      </Link>

                      {/* 2. My Bookings */}
                      <Link
                        to="/services?view=bookings"
                        className="ww-avatar-dropdown__item"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <Calendar size={15} strokeWidth={1.5} />
                        <span>My bookings</span>
                        {bookingUpdatesCount > 0 && (
                          <span className="ww-menu-count-badge">
                            {bookingUpdatesCount}
                          </span>
                        )}
                      </Link>

                      {/* 3. Messages */}
                      <Link
                        to="/services?view=messages"
                        className="ww-avatar-dropdown__item"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <MessageSquare size={15} strokeWidth={1.5} />
                        <span>Messages</span>
                        {unreadMessagesCount > 0 && (
                          <span className="ww-menu-count-badge is-unread">
                            {unreadMessagesCount}
                          </span>
                        )}
                      </Link>

                      {/* 4. Saved Guides */}
                      <Link
                        to="/services?view=saved"
                        className="ww-avatar-dropdown__item"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <Heart size={15} strokeWidth={1.5} />
                        <span>Saved guides</span>
                      </Link>

                      {/* 5. Switch Role */}
                      <button
                        type="button"
                        className="ww-avatar-dropdown__item"
                        onClick={() => {
                          setRole(userRole === 'guide' ? 'traveler' : 'guide');
                          setUserMenuOpen(false);
                        }}
                        role="menuitem"
                      >
                        <Shield size={15} strokeWidth={1.5} />
                        <span>
                          Switch to {userRole === 'guide' ? 'traveler' : 'guide'}
                        </span>
                      </button>

                      <div className="ww-avatar-dropdown__divider" />

                      {/* 7. Log out */}
                      <button
                        type="button"
                        className="ww-avatar-dropdown__item ww-avatar-dropdown__item--danger"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        role="menuitem"
                      >
                        <LogOut size={15} strokeWidth={1.5} />
                        <span>Log out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="ww-guest-actions">
                <Button variant="ghost" size="sm" onClick={() => login()}>
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/services')}
                >
                  Explore services
                </Button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="ww-hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} strokeWidth={1.5} />
              {hasUpdates && <span className="ww-hamburger-dot" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Mist Drawer with large serif links & focus trap */}
      {mobileMenuOpen && (
        <div
          className="ww-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="ww-mobile-drawer"
            ref={mobileDrawerRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            <div className="ww-mobile-drawer__header">
              <div className="ww-brand">
                <span className="ww-brand__text">ABEON</span>
              </div>
              <button
                type="button"
                className="ww-mobile-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
                autoFocus
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="ww-mobile-drawer__body">
              <nav className="ww-mobile-nav" aria-label="Mobile navigation links">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `ww-mobile-serif-link ${isActive ? 'is-active' : ''}`
                    }
                    end={item.exact}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {item.hasDot && hasUpdates && (
                      <span className="ww-mobile-serif-dot" />
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="ww-mobile-drawer__divider" />

              {/* Quick traveler sub-links */}
              <div className="ww-mobile-sublinks">
                <Link
                  to="/services?view=bookings"
                  className="ww-mobile-sublink"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calendar size={18} />
                  <span>My Bookings</span>
                  {bookingUpdatesCount > 0 && (
                    <span className="ww-menu-count-badge">
                      {bookingUpdatesCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/services?view=messages"
                  className="ww-mobile-sublink"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare size={18} />
                  <span>Messages</span>
                  {unreadMessagesCount > 0 && (
                    <span className="ww-menu-count-badge is-unread">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/services?view=saved"
                  className="ww-mobile-sublink"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={18} />
                  <span>Saved Guides</span>
                </Link>
                <Link
                  to="/profile"
                  className="ww-mobile-sublink"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>My Profile</span>
                </Link>
              </div>

              {/* Mobile Role Switcher */}
              <div className="ww-mobile-role-section">
                <span className="ww-mobile-role-title">CURRENT ROLE</span>
                <div className="ww-mobile-role-buttons">
                  <button
                    type="button"
                    className={`ww-mobile-role-btn ${
                      userRole === 'traveler' ? 'is-active' : ''
                    }`}
                    onClick={() => setRole('traveler')}
                  >
                    Traveler
                  </button>
                  <button
                    type="button"
                    className={`ww-mobile-role-btn ${
                      userRole === 'guide' ? 'is-active' : ''
                    }`}
                    onClick={() => setRole('guide')}
                  >
                    Local Guide
                  </button>
                </div>
              </div>

              <div className="ww-mobile-drawer__footer">

                {user ? (
                  <Button
                    variant="outline"
                    size="md"
                    className="ww-mobile-auth-btn"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log out ({user.name})
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="ww-mobile-auth-btn"
                    onClick={() => {
                      login();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log in as demo user
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
