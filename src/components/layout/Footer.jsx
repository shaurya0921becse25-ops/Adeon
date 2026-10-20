import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, ShieldCheck } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="ww-footer" role="contentinfo">
      <div className="container">
        {/* Main 4-column links */}
        <div className="ww-footer__grid">
          {/* Col 1: Brand & Purpose */}
          <div className="ww-footer__col ww-footer__col--brand">
            <div className="ww-footer__brand">
              <span className="ww-footer__logo">ABEON</span>
              <span className="ww-footer__badge">Feasibility-First</span>
            </div>
            <p className="ww-footer__tagline">
              Travel plans that actually work. We check closing hours, transport gaps, and honest budgets before day two falls apart.
            </p>
            <div className="ww-footer__meta-box">
              <div className="ww-footer__meta-item">
                <MapPin size={14} className="ww-footer__meta-icon" />
                <span>5 Pilot Cities: Shimla, Jaipur, Tokyo, Dubai, Chandigarh</span>
              </div>
              <div className="ww-footer__meta-item">
                <ShieldCheck size={14} className="ww-footer__meta-icon" />
                <span>Deterministic rules & local sample data</span>
              </div>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="ww-footer__col">
            <h4 className="ww-footer__heading">Product</h4>
            <ul className="ww-footer__links">
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/services">Local Services & Guides</Link></li>
              <li><Link to="/itinerary">Itinerary Planner</Link></li>
              <li><Link to="/trip-match">Trip Match Engine</Link></li>
              <li><Link to="/community">Field Notes Community</Link></li>
              <li><a href="#how-it-works">How Feasibility Works</a></li>
            </ul>
          </div>

          {/* Col 3: Community & Pilots */}
          <div className="ww-footer__col">
            <h4 className="ww-footer__heading">Pilot Destinations</h4>
            <ul className="ww-footer__links">
              <li><Link to="/dashboard?city=Shimla">Shimla (Mountain Railway)</Link></li>
              <li><Link to="/dashboard?city=Jaipur">Jaipur (Pink City Heritage)</Link></li>
              <li><Link to="/dashboard?city=Tokyo">Tokyo (Subway & Alleys)</Link></li>
              <li><Link to="/dashboard?city=Dubai">Dubai (Urban Desert)</Link></li>
              <li><Link to="/dashboard?city=Chandigarh">Chandigarh (Modernist Grid)</Link></li>
            </ul>
          </div>

          {/* Col 4: Project & Evaluation */}
          <div className="ww-footer__col">
            <h4 className="ww-footer__heading">Project & Evaluation</h4>
            <div className="ww-footer__eval-card">
              <p className="ww-footer__eval-text">
                Front-End Engineering (FEE) CE-2 Project Submission
              </p>
              <p className="ww-footer__eval-sub">
                Built by Team ABEON (FEE Group). Designed with custom tokens, semantic HTML, and zero third-party UI libraries.
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="ww-footer__github-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>View Repository</span>
              </a>
            </div>
          </div>
        </div>

        {/* Dashed tear-line separator */}
        <div className="ww-footer__divider" aria-hidden="true" />

        {/* Bottom Credits & Honest Sample Data Note */}
        <div className="ww-footer__bottom">
          <p className="ww-footer__disclaimer">
            All data in this demo is sample data. Timings, entry fees, and transit sequences represent pilot demonstration rules and should be checked before travel.
          </p>

          <p className="ww-footer__credits">
            Photo credits: Himalayan toy train, Jaipur palace, Yanaka Tokyo, Dubai skyline, and Chandigarh architecture via Unsplash photographers.
          </p>

          <div className="ww-footer__legal-links">
            <span>&copy; {new Date().getFullYear()} ABEON</span>
            <span>&bull;</span>
            <Link to="/dashboard">Dashboard Stub</Link>
            <span>&bull;</span>
            <Link to="/login">Login Stub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
