import React from "react";
import { ShieldCheck, Award, Users } from "lucide-react";
import { CitySearchBox } from "../components/search/CitySearchBox";
import "./Home.css";

export const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-overlay" />
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-eyebrow">The Mountain Experiences Marketplace</span>
            <h1 className="hero-title">
              Uncover the soul of Himachal with local storytellers
            </h1>
            <p className="hero-subtitle">
              Handpicked culinary masterclasses, high-ridge treks, colonial heritage walks, and cedar sanctuary safaris in Shimla.
            </p>

            {/* City Search Box */}
            <div className="hero-search-container">
              <CitySearchBox variant="hero" />
            </div>

            {/* Trust Indicators */}
            <div className="hero-trust-indicators">
              <div className="indicator-item">
                <ShieldCheck size={16} className="text-aegean" />
                <span>100% Verified Local Guides</span>
              </div>
              <div className="indicator-item">
                <Award size={16} className="text-aegean" />
                <span>Free Cancellation on Most Tours</span>
              </div>
              <div className="indicator-item">
                <Users size={16} className="text-aegean" />
                <span>Direct Chat Post-Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
