import { useEffect, useState } from "react";

const NAV_ITEMS = [
  ["Home", "#home"],
  ["Explore", "#destinations"],
  ["Community", "#faq"],
  ["My Trips", "#planning"],
  ["Trip Finder", "#trip-finder"],
];

export default function Navbar({ mobileMenuOpen, onMobileMenuToggle, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 20);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <nav className="nav-inner" aria-label="Main navigation">
        <a className="nav-logo" href="#home" onClick={onNavigate}>ABEON</a>
        <div className={`nav-links${mobileMenuOpen ? " is-open" : ""}`}>
          {NAV_ITEMS.map(([label, href]) => (
            <a key={label} href={href} onClick={onNavigate}>{label}</a>
          ))}
        </div>
        <a className="nav-signin" href="#trip-finder" onClick={onNavigate}>Sign in</a>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          onClick={onMobileMenuToggle}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}