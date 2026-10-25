import React from "react";
import { Link } from "react-router-dom";
import { Compass, ShieldCheck, Heart, MapPin, Mail } from "lucide-react";
import { appConfig } from "../../config/appConfig";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand info */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo" style={{ marginBottom: 16 }}>
              <span className="brand-initial">H</span>
              <span className="brand-text">{appConfig.appName}</span>
            </Link>
            <p className="footer-tagline">
              Connecting curious travellers with authentic local storytellers, master home-cooks, and certified mountain naturalists across Himachal Pradesh.
            </p>
            <div className="footer-guarantee">
              <ShieldCheck size={18} className="text-aegean-deep" />
              <span>Verified local hosts & transparent direct booking</span>
            </div>
          </div>

          {/* Shimla Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Shimla Experiences</h4>
            <ul className="footer-links">
              <li><Link to="/destination/shimla?category=cooking">Cooking Classes & Dham</Link></li>
              <li><Link to="/destination/shimla?category=heritage">Colonial Heritage Walks</Link></li>
              <li><Link to="/destination/shimla?category=trekking">Highland Hikes & Summits</Link></li>
              <li><Link to="/destination/shimla?category=safari">Cedar Sanctuary 4x4 Safaris</Link></li>
              <li><Link to="/destination/shimla?category=food">Street Food & Orchard Trails</Link></li>
              <li><Link to="/destination/shimla?category=rentals">Royal Enfield & SUV Rentals</Link></li>
            </ul>
          </div>

          {/* Coming Soon Hubs */}
          <div className="footer-col">
            <h4 className="footer-heading">Upcoming Destinations</h4>
            <ul className="footer-links">
              <li><Link to="/destination/manali">Manali & Solang Valley</Link></li>
              <li><Link to="/destination/dharamshala">Dharamshala & McLeodganj</Link></li>
              <li><Link to="/destination/kasol">Kasol & Parvati Valley</Link></li>
              <li><Link to="/destination/leh">Leh Ladakh High Passes</Link></li>
              <li><Link to="/destination/rishikesh">Rishikesh Himalayan Foothills</Link></li>
            </ul>
          </div>

          {/* Traveller Trust */}
          <div className="footer-col">
            <h4 className="footer-heading">Traveller Care</h4>
            <ul className="footer-links">
              <li><Link to="/trips">Manage My Trips</Link></li>
              <li><Link to="/chat">Guide Messenger</Link></li>
              <li><a href={`mailto:${appConfig.supportEmail}`}>Emergency Support</a></li>
              <li><span className="text-taupe-soft">Curated with love in the Himalayas</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="flex items-center gap-2 text-taupe-soft text-sm">
            <span>© {new Date().getFullYear()} {appConfig.appName} Experiences. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-taupe-soft">
            <span>Traveller-Side Only Edition</span>
            <span>•</span>
            <span>Porcelain & Aegean Design System</span>
            <span>•</span>
            <span>Shimla, Himachal Pradesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
