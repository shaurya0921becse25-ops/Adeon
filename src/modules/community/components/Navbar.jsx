import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Compass } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import '../styles/community.css';

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Explore',    to: '/explore' },
  { label: 'Community',  to: '/community' },
  { label: 'Plan a Trip',to: '/plan' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setCreateModalOpen } = useCommunity();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Logo */}
        <a href="/" className="navbar__logo" aria-label="Abeon home">
          <div className="navbar__logo-mark" aria-hidden="true">
            <Compass size={18} strokeWidth={2.5} />
          </div>
          <span className="navbar__logo-text">
            Ab<span>eon</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <ul className="navbar__nav" role="list">
          {NAV_LINKS.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `navbar__link${isActive || link.label === 'Community' ? ' active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="navbar__right">
          <button
            id="navbar-share-btn"
            className="btn btn-primary btn-sm"
            onClick={() => setCreateModalOpen(true)}
            aria-label="Share your travel experience"
          >
            + Share
          </button>

          <div
            className="navbar__avatar"
            role="button"
            tabIndex={0}
            aria-label="User profile"
            title="Your profile"
          >
            T
          </div>

          {/* Mobile hamburger */}
          <button
            id="navbar-menu-toggle"
            className="navbar__hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <ul className={`navbar__mobile-menu${menuOpen ? ' open' : ''}`} role="list">
        {NAV_LINKS.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `navbar__link${isActive || link.label === 'Community' ? ' active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
