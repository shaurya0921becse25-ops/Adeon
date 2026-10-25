import React from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  {
    title: "Navigation",
    links: [
      { label: "Home", to: "/" },
      { label: "Services", to: "/services" },
      { label: "Community", to: "/community" }
    ],
  },
  {
    title: "Trips & Match",
    links: [
      { label: "Itinerary Planner", to: "/itinerary" },
      { label: "Trip Match", to: "/trip-match" },
      { label: "Browse Services", to: "/services" }
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Profile", to: "/profile" },
      { label: "Sign In / Sign Up", to: "/signin" }
    ],
  },
];

export default function HomeFooter() {
  return (
    <footer className="site-footer" id="trip-finder">
      <img
        className="footer-background"
        src="/media/footer-landscape.png"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="footer-shade" />
      <div className="footer-content">
        <div className="footer-cta">
          <h2>Your next adventure starts here</h2>
          <p>Explore remote landscapes, local stories, and unforgettable moments waiting beyond the next ridge.</p>
          <Link to="/services">Explore Trips</Link>
        </div>
        <div className="footer-details">
          <div className="footer-brand">
            <Link to="/">ABEON</Link>
            <p>Guided journeys, breathtaking trails, and unforgettable travel experiences—all thoughtfully crafted in one place.</p>
            <span>© 2026 ABEON. All rights reserved.</span>
          </div>
          <div className="footer-link-columns">
            {FOOTER_LINKS.map((column) => (
              <div className="footer-link-column" key={column.title}>
                <h3>{column.title}</h3>
                {column.links.map(({ label, to }) => (
                  <Link key={label} to={to}>{label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-watermark" aria-hidden="true">Abeon</div>
    </footer>
  );
}
