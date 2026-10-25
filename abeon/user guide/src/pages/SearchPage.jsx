import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  MapPin,
  ChevronRight,
  Headset,
  Gift,
  Star,
  CalendarCheck,
  Heart,
  Globe,
  ShieldCheck,
  MessageSquare
} from "lucide-react";
import "./SearchPage.css";

export const SearchPage = () => {
  const navigate = useNavigate();

  // State for search fields
  const [whereValue, setWhereValue] = useState("");
  const [whenValue, setWhenValue] = useState("Oct 21");
  const [selectedDay, setSelectedDay] = useState(21);

  // Dropdown visibility states
  const [whereOpen, setWhereOpen] = useState(false);
  const [whenOpen, setWhenOpen] = useState(false);

  // Recent searches list state
  const [recentSearches, setRecentSearches] = useState([
    { city: "Shimla", region: "India" },
    { city: "Chandigarh", region: "India" },
    { city: "Japan", region: "East Asia" },
    { city: "Dubai", region: "United Arab Emirates" },
    { city: "Jaipur", region: "India" },
  ]);

  const searchContainerRef = useRef(null);

  // Close modals on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setWhereOpen(false);
        setWhenOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDestination = (city) => {
    setWhereValue(city);
    setWhereOpen(false);
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    setWhenValue(`Oct ${day}`);
    setWhenOpen(false);
  };

  const handleClearRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
  };

  // Navigate to trip page on search/next click
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    navigate(`/trip?destination=${encodeURIComponent(whereValue || "Shimla")}&date=${encodeURIComponent(whenValue)}`);
  };

  const isDropdownOpen = whereOpen || whenOpen;

  return (
    <div className="search-page-wrapper">
      {/* 1. HERO & CAROUSEL SECTION */}
      <section className={`hero-section ${isDropdownOpen ? "dropdown-open" : ""}`}>
        {/* Background Image Carousel */}
        <div className="hero-carousel-bg" aria-hidden="true">
          <div className="carousel-slide slide-1"></div>
          <div className="carousel-slide slide-2"></div>
          <div className="carousel-slide slide-3"></div>
        </div>

        <div className="search-top-bar container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "24px", position: "relative", zIndex: 10 }}>
          <Link to="/" style={{ fontSize: "1.7rem", fontWeight: "800", color: "#2B4E5B", letterSpacing: "-0.02em" }}>

          </Link>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <Link to="/provider/guide-agam" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "9999px", background: "rgba(255, 255, 255, 0.95)", border: "1.5px solid #91B8C7", color: "#2B4E5B", fontWeight: 600, fontSize: "0.85rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <span>Guide (Agam)</span>
            </Link>
            <Link to="/trips" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "9999px", background: "rgba(255, 255, 255, 0.95)", border: "1.5px solid #91B8C7", color: "#2B4E5B", fontWeight: 600, fontSize: "0.85rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <span>My Trips</span>
            </Link>
            <Link to="/chat" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "9999px", background: "#2B4E5B", color: "#FFFFFF", fontWeight: 600, fontSize: "0.85rem", boxShadow: "0 2px 10px rgba(43,78,91,0.2)" }}>
              <MessageSquare size={15} />
              <span>Chat</span>
            </Link>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">Go beyond the ordinary.</h1>
          <p className="hero-subtitle">Discover places. Create memories. Travel your way.</p>
        </div>

        {/* Search Bar Container */}
        <div className="search-container" ref={searchContainerRef}>
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            {/* Where to field */}
            <div
              className="search-field"
              id="whereToField"
              onClick={() => {
                setWhenOpen(false);
                setWhereOpen(!whereOpen);
              }}
            >
              <div className="field-label">Where to?</div>
              <input
                type="text"
                className="field-input"
                placeholder="Where will your next journey take you?"
                id="whereInput"
                value={whereValue}
                readOnly
              />
            </div>

            {/* When field */}
            <div
              className="search-field"
              id="whenField"
              onClick={() => {
                setWhereOpen(false);
                setWhenOpen(!whenOpen);
              }}
            >
              <div className="field-label">When will you explore?</div>
              <input
                type="text"
                className="field-input"
                value={whenValue}
                id="whenInput"
                readOnly
              />
            </div>

            {/* Search / Next Button */}
            <button type="submit" className="search-btn" aria-label="Search" title="Next: Explore Trips">
              <Search size={20} strokeWidth={2.5} />
            </button>
          </form>

          {/* Recent Searches Dropdown */}
          {whereOpen && (
            <div className="recent-searches-dropdown" id="recentSearchesModal">
              <div className="dropdown-header">
                <h4>Recent Searches</h4>
                <button type="button" className="clear-btn" onClick={handleClearRecent}>
                  Clear
                </button>
              </div>
              <div className="recent-searches-list">
                {recentSearches.length > 0 ? (
                  recentSearches.map((item, idx) => (
                    <div
                      key={idx}
                      className="recent-search-item"
                      onClick={() => handleSelectDestination(item.city)}
                    >
                      <div className="icon-box">
                        <MapPin size={18} />
                      </div>
                      <div className="details">
                        <strong>{item.city}</strong>
                        <span>{item.region}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "0.85rem", color: "var(--search-text-muted)", padding: "12px 0" }}>
                    No recent searches.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Date Picker Dropdown Mock */}
          {whenOpen && (
            <div className="datepicker-dropdown" id="datepickerModal">
              <div className="calendar-header">
                <span>October 2026</span>
                <ChevronRight size={18} style={{ cursor: "pointer" }} />
              </div>
              <div className="calendar-grid">
                <div className="calendar-day-head">Su</div>
                <div className="calendar-day-head">Mo</div>
                <div className="calendar-day-head">Tu</div>
                <div className="calendar-day-head">We</div>
                <div className="calendar-day-head">Th</div>
                <div className="calendar-day-head">Fr</div>
                <div className="calendar-day-head">Sa</div>

                <div className="calendar-day empty"></div>
                <div className="calendar-day empty"></div>
                <div className="calendar-day empty"></div>
                <div className="calendar-day empty"></div>
                {[...Array(31)].map((_, i) => {
                  const dayNum = i + 1;
                  return (
                    <div
                      key={dayNum}
                      className={`calendar-day ${selectedDay === dayNum ? "selected" : ""}`}
                      onClick={() => handleSelectDay(dayNum)}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. WHY TRAVEL WITH ABEON SECTION */}
      <section className="why-section">
        <div className="container">
          <h2 className="section-title">Why travel with Abeon?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="icon-wrapper bg-headset">
                <Headset size={28} />
              </div>
              <h3>24/7 Support</h3>
              <p>We’re here whenever your journey needs us.</p>
            </div>
            <div className="benefit-card">
              <div className="icon-wrapper bg-gift">
                <Gift size={28} />
              </div>
              <h3>Travel Rewards</h3>
              <p>Every journey brings something special.</p>
            </div>
            <div className="benefit-card">
              <div className="icon-wrapper bg-star">
                <Star size={28} />
              </div>
              <h3>Trusted Reviews</h3>
              <p>Make confident choices with traveler insights.</p>
            </div>
            <div className="benefit-card">
              <div className="icon-wrapper bg-calendar">
                <CalendarCheck size={28} />
              </div>
              <h3>Travel Your Way</h3>
              <p>Flexible plans, effortless changes, more freedom.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECENTLY VIEWED SECTION */}
      <section className="recently-viewed-section">
        <div className="container">
          <div className="section-header-flex">
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Pick up where you left off
            </h2>
            <Link to="/trip" className="see-all-link">
              See all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="cards-grid">
            {/* Card 1 -> navigates to service-details */}
            <Link to="/service/guide-heritage-4" className="experience-card">
              <div className="card-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&auto=format&fit=crop"
                  alt="Shimla Heritage Tour"
                />
                <button
                  type="button"
                  className="wishlist-btn"
                  aria-label="Add to wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Heart size={18} />
                </button>
              </div>
              <div className="card-content">
                <div className="card-location">
                  <Globe size={14} /> Shimla, Himachal Pradesh
                </div>
                <h3 className="card-title">Guided Heritage Walk Tour in Shimla</h3>
                <div className="card-rating">
                  <Star size={14} fill="#008767" color="#008767" />
                  <span className="rating-score">4.8</span>
                  <span className="rating-count">(41)</span>
                </div>
                <div className="card-price">
                  from <span className="price-amount">₹2,895</span>
                </div>
              </div>
            </Link>

            {/* Card 2 -> navigates to service-details */}
            <Link to="/service/guide-trek-1" className="experience-card">
              <div className="card-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=600&auto=format&fit=crop"
                  alt="Custom Shimla Tour"
                />
                <button
                  type="button"
                  className="wishlist-btn"
                  aria-label="Add to wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Heart size={18} />
                </button>
              </div>
              <div className="card-content">
                <div className="card-location">
                  <Globe size={14} /> Shimla, Himachal Pradesh
                </div>
                <h3 className="card-title">Shimla : Private Custom Tour with a Local Guide</h3>
                <div className="card-rating">
                  <Star size={14} fill="#008767" color="#008767" />
                  <span className="rating-score">4.9</span>
                  <span className="rating-count">(82)</span>
                </div>
                <div className="card-price">
                  from <span className="price-amount">₹4,584</span>
                </div>
              </div>
            </Link>

            {/* Card 3 -> navigates to service-details */}
            <Link to="/service/guide-cook-2" className="experience-card">
              <div className="card-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop"
                  alt="Himachali Cooking Class"
                />
                <button
                  type="button"
                  className="wishlist-btn"
                  aria-label="Add to wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Heart size={18} />
                </button>
              </div>
              <div className="card-content">
                <div className="card-location">
                  <Globe size={14} /> Shimla, Himachal Pradesh
                </div>
                <h3 className="card-title">
                  Authentic Himachali Cooking Class & Dham Experience
                </h3>
                <div className="card-rating">
                  <Star size={14} fill="#008767" color="#008767" />
                  <span className="rating-score">4.95</span>
                  <span className="rating-count">(64)</span>
                </div>
                <div className="card-price">
                  from <span className="price-amount">₹1,200</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FLEXIBLE PLANNING SECTION */}
      <section className="flexible-section">
        <div className="container">
          <div className="flexible-content">
            <h2>Travel without the stress</h2>
            <p>
              Use Reserve Now &amp; Pay Later to secure the activities you don't want to miss
              without being locked in.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ABEON FOOTER */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <Link to="/" className="brand-logo">
                <span className="brand-initial">A</span>
                <span>Abeon</span>
              </Link>
              <p className="footer-tagline">
                Connecting curious travellers with authentic local storytellers, master
                home-cooks, and certified mountain naturalists across Himachal Pradesh.
              </p>
              <div className="footer-guarantee">
                <ShieldCheck size={18} />
                <span>Verified local hosts &amp; transparent direct booking</span>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Shimla Experiences</h4>
              <ul className="footer-links">
                <li><Link to="/trip">Cooking Classes &amp; Dham</Link></li>
                <li><Link to="/trip">Colonial Heritage Walks</Link></li>
                <li><Link to="/trip">Highland Hikes &amp; Summits</Link></li>
                <li><Link to="/trip">Cedar Sanctuary 4x4 Safaris</Link></li>
                <li><Link to="/trip">Street Food &amp; Orchard Trails</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Upcoming Destinations</h4>
              <ul className="footer-links">
                <li><Link to="/trip">Manali &amp; Solang Valley</Link></li>
                <li><Link to="/trip">Dharamshala &amp; McLeodganj</Link></li>
                <li><Link to="/trip">Kasol &amp; Parvati Valley</Link></li>
                <li><Link to="/trip">Leh Ladakh High Passes</Link></li>
                <li><Link to="/trip">Rishikesh Himalayan Foothills</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Traveller Care</h4>
              <ul className="footer-links">
                <li><Link to="/trip">Manage My Trips</Link></li>
                <li><Link to="/trip">Guide Messenger</Link></li>
                <li><Link to="/trip">Emergency Support</Link></li>
                <li style={{ marginTop: "16px", fontSize: "0.8rem", opacity: 0.7 }}>
                  Curated with love in the Himalayas
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© 2026 Abeon Experiences. All rights reserved.</span>
            <div>Porcelain &amp; Aegean Design System • Shimla, Himachal Pradesh</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;
