import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Menu, X, User, LogOut, Calendar, MessageSquare, History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { selectUnreadMessagesCount, selectBookingUpdateCount } from '../../store/servicesSlice';
import Avatar from '../common/Avatar';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home', path: '/', exact: true },
  { label: 'Explore', path: '/services' },
  { label: 'Community', path: '/community' },
  { label: 'My Trips', path: '/itinerary' },
  { label: 'Trip Match', path: '/trip-match' },
];

export default function Navbar() {
  const { user, userRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  const unreadMessagesCount = useSelector(selectUnreadMessagesCount) || 0;
  const bookingUpdatesCount = useSelector(selectBookingUpdateCount) || 0;
  const hasUpdates = unreadMessagesCount > 0 || bookingUpdatesCount > 0;

  // Scroll listener for height and background transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
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

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide Navbar on Guide portal and standalone Auth pages
  if (location.pathname.startsWith('/guide') || location.pathname === '/signin' || location.pathname === '/signup') {
    return null;
  }

  const headerClass = isHome
    ? `site-header is-home ${isScrolled ? 'is-scrolled' : ''}`
    : `site-header is-other-tab ${isScrolled ? 'is-scrolled' : ''}`;

  return (
    <>
      <header className={headerClass} role="banner">
        <nav className="nav-inner" aria-label="Main navigation">
          {/* Brand Logo */}
          <Link to="/" className="nav-logo" aria-label="ABEON Home">
            ABEON
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? 'is-active' : ''}`
                }
                end={item.exact}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Action: User Menu or Sign In */}
          <div className="nav-actions">
            {user ? (
              <div className="nav-user-wrap" ref={userMenuRef}>
                <button
                  type="button"
                  className="nav-avatar-btn"
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
                  {hasUpdates && <span className="nav-avatar-dot" />}
                </button>

                {userMenuOpen && (
                  <div className="nav-user-dropdown" role="menu">
                    <div className="nav-user-dropdown__header">
                      <strong>{user.name}</strong>
                      <small>{user.handle || user.email}</small>
                    </div>
                    <div className="nav-user-dropdown__divider" />

                    <Link
                      to="/profile"
                      className="nav-user-dropdown__item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <User size={15} />
                      <span>My profile</span>
                    </Link>

                    <Link
                      to="/profile?tab=trips"
                      className="nav-user-dropdown__item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <History size={15} />
                      <span>Trip history</span>
                    </Link>

                    <Link
                      to="/profile?tab=services"
                      className="nav-user-dropdown__item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <Calendar size={15} />
                      <span>My bookings</span>
                      {bookingUpdatesCount > 0 && (
                        <span className="nav-menu-badge">{bookingUpdatesCount}</span>
                      )}
                    </Link>

                    <Link
                      to="/profile?tab=messages"
                      className="nav-user-dropdown__item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <MessageSquare size={15} />
                      <span>Messages</span>
                      {unreadMessagesCount > 0 && (
                        <span className="nav-menu-badge is-unread">{unreadMessagesCount}</span>
                      )}
                    </Link>

                    <div className="nav-user-dropdown__divider" />

                    <button
                      type="button"
                      className="nav-user-dropdown__item nav-user-dropdown__item--danger"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        navigate('/signin');
                      }}
                      role="menuitem"
                    >
                      <LogOut size={15} />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="nav-signin-btn">
                Sign in
              </Link>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              className="mobile-menu-toggle"
              type="button"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
              {hasUpdates && <span className="nav-hamburger-dot" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="mobile-nav-drawer"
            ref={mobileDrawerRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="mobile-nav-header">
              <span className="mobile-nav-logo">ABEON</span>
              <button
                type="button"
                className="mobile-nav-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mobile-nav-body">
              <nav className="mobile-nav-list" aria-label="Mobile links">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `mobile-nav-link ${isActive ? 'is-active' : ''}`
                    }
                    end={item.exact}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mobile-nav-divider" />

              {user ? (
                <div className="mobile-nav-sublinks">
                  <Link
                    to="/profile"
                    className="mobile-nav-sublink"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/profile?tab=trips"
                    className="mobile-nav-sublink"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <History size={18} />
                    <span>Trip History</span>
                  </Link>
                  <Link
                    to="/profile?tab=services"
                    className="mobile-nav-sublink"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calendar size={18} />
                    <span>My Bookings</span>
                  </Link>
                  <Link
                    to="/profile?tab=messages"
                    className="mobile-nav-sublink"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageSquare size={18} />
                    <span>Messages</span>
                  </Link>
                </div>
              ) : null}

              <div className="mobile-nav-footer">
                {user ? (
                  <button
                    type="button"
                    className="mobile-auth-btn mobile-auth-btn--logout"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/signin');
                    }}
                  >
                    Log out ({user.name})
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    className="mobile-auth-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
