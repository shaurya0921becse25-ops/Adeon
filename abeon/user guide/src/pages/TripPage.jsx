import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  X,
  MessageSquare,
  Award,
  Sparkles
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useChat } from "../context/ChatContext";
import { getAllAvailableServices } from "../data/services";
import { loadGuideProfile, subscribeToDataChanges, broadcastDataChange } from "../data/sharedDataBridge";
import { formatINR } from "../utils/pricing";
import "./TripPage.css";

export const TripPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destinationParam = searchParams.get("destination") || "Shimla";

  const { bookings } = useBooking();
  const { unreadCount } = useChat();
  const upcomingCount = bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Pending"
  ).length;

  const [searchInput, setSearchInput] = useState(destinationParam);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [guideProfile, setGuideProfile] = useState(() => loadGuideProfile());
  const [servicesList, setServicesList] = useState(() => getAllAvailableServices());

  const handleCardClick = (card) => {
    // Notify guide dashboard in real-time that traveler is exploring this experience
    broadcastDataChange("service_selected", {
      id: card.id,
      title: card.title,
      category: card.category,
      price: card.price,
      providerId: card.providerId,
      image: card.image || card.coverImage,
      timestamp: Date.now()
    });
    // Seamlessly open the dedicated service details page
    navigate(`/service/${card.id}`);
  };

  // Subscribe to real-time updates from guide portal
  useEffect(() => {
    const unsub = subscribeToDataChanges((type) => {
      if (type === "profile") {
        setGuideProfile(loadGuideProfile());
      } else if (type === "services") {
        setServicesList(getAllAvailableServices());
      }
    });
    return () => unsub();
  }, []);

  const heroImages = [
    "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=85"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const categories = [
    "All",
    "Cooking Classes",
    "Heritage Walks",
    "High-Ridge Treks",
    "Cedar Safaris",
    "Street Food Trails",
    "Motorcycle Fleet"
  ];

  const handleSelectDestination = (name) => {
    setSearchInput(name);
    setSearchDropdownOpen(false);
  };

  const displayedServices = servicesList.filter((s) => {
    if (selectedCategory === "All") return true;
    const cat = (s.category || "").toLowerCase();
    const catId = (s.categoryId || "").toLowerCase();
    if (selectedCategory === "Cooking Classes") return cat.includes("cook") || catId === "cooking";
    if (selectedCategory === "High-Ridge Treks") return cat.includes("trek") || catId === "trekking";
    if (selectedCategory === "Cedar Safaris") return cat.includes("safari") || catId === "safari";
    if (selectedCategory === "Heritage Walks") return cat.includes("heritage") || catId === "heritage";
    if (selectedCategory === "Street Food Trails") return cat.includes("food") || catId === "food";
    if (selectedCategory === "Motorcycle Fleet") return cat.includes("vehicle") || catId === "rentals";
    return true;
  });

  return (
    <div className="trip-page-wrapper">
      {/* SECTION 1: HERO & SEARCH BAR */}
      <section className="hero-section">
        <div className="hero-carousel" aria-hidden="true">
          {heroImages.map((src, i) => (
            <div
              key={i}
              className={`hero-carousel-slide ${activeSlide === i ? "active" : ""}`}
            >
              <img src={src} alt="Shimla Landscape" />
            </div>
          ))}
        </div>

        <div className="container hero-flex">
          <div className="hero-titles">
            <Link to="/" className="hero-title-link" title="Back to Search">
              <h1>Abeon</h1>
            </Link>
            <p>Pick a category to filter your recs</p>
          </div>

          {/* Search Bar with Dropdown */}
          <div className="search-wrapper">
            <div className="search-input-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Search Shimla, Manali, Spiti..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSearchDropdownOpen(true)}
              />
            </div>

            {searchDropdownOpen && (
              <div className="search-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-title">Destinations</span>
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => setSearchDropdownOpen(false)}
                  >
                    Close
                  </button>
                </div>

                <div
                  className="recent-item"
                  onClick={() => handleSelectDestination("Shimla, India")}
                >
                  <MapPin className="pin-icon" size={18} />
                  <div className="recent-info">
                    <h4>Shimla</h4>
                    <span>Himachal Pradesh, India</span>
                  </div>
                </div>

                <div
                  className="recent-item"
                  onClick={() => handleSelectDestination("Manali, India")}
                >
                  <MapPin className="pin-icon" size={18} />
                  <div className="recent-info">
                    <h4>Manali</h4>
                    <span>Basecamp for Himalayan Treks</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Buttons: Guide Profile, Trips & Chat */}
          <div className="trip-top-nav">
            <Link to="/provider/guide-agam" className="nav-action-pill" title="Guide Profile">
              <Award size={16} />
              <span>Guide ({guideProfile.name})</span>
            </Link>

            <Link to="/trips" className="nav-action-pill" title="My Trips">
              <span>Trips</span>
              {upcomingCount > 0 && (
                <span className="nav-badge-count">{upcomingCount}</span>
              )}
            </Link>

            <Link to="/chat" className="nav-action-pill" title="Chat with Guide">
              <MessageSquare size={16} />
              <span>Chat</span>
              {unreadCount > 0 && (
                <span className="nav-badge-count">{unreadCount}</span>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: THINGS TO DO & FILTERS */}
      <section className="filter-section">
        <div className="container">
          <div className="section-title-row">
            <h2>Things to do in Himachal</h2>
            <Link to="/provider/guide-agam" className="see-all-link">
              View Guide Profile ({guideProfile.name}) →
            </Link>
          </div>

          {/* Guide Spotlight Banner */}
          <div className="guide-spotlight-banner">
            <div className="guide-spotlight-left">
              <div className="guide-avatar-ring">
                <img
                  src={guideProfile.avatar || "/agam-profile.jpg"}
                  alt={guideProfile.name}
                  className="guide-spotlight-avatar"
                  onError={(e) => {
                    e.currentTarget.src = "/agam-profile.jpg";
                  }}
                />
                <span className="guide-verified-badge" title="Verified Mountain Guide">
                  <ShieldCheck size={14} />
                </span>
              </div>
              <div className="guide-spotlight-meta">
                <span className="guide-spotlight-tag">Connected Guide Profile • abeon_2</span>
                <h3 className="guide-spotlight-name">{guideProfile.name}</h3>
                <p className="guide-spotlight-role">{guideProfile.role}</p>
                <div className="guide-spotlight-stats">
                  <span>⭐ {guideProfile.rating} ({guideProfile.reviewCount} reviews)</span>
                  <span>•</span>
                  <span>🎖️ {guideProfile.experienceYears} Years Guiding Experience</span>
                  <span>•</span>
                  <span>📍 {guideProfile.hometown || guideProfile.location}</span>
                </div>
              </div>
            </div>
            <div className="guide-spotlight-actions">
              <Link to="/provider/guide-agam" className="btn-spotlight-outline">
                View Full Experience & Services
              </Link>
              <Link to="/chat" className="btn-spotlight-solid">
                <MessageSquare size={16} />
                <span>Chat with {guideProfile.name.split(" ")[0]}</span>
              </Link>
            </div>
          </div>

          <div className="filter-bar">
            <button
              type="button"
              className="filter-chip filter-chip-btn"
              onClick={() => setFilterModalOpen(true)}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
            <div className="filter-divider"></div>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-chip ${selectedCategory === cat ? "selected" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="results-meta">
            <span>{displayedServices.length} authentic experiences available</span>
            <div>
              Sort by:{" "}
              <select className="sort-dropdown" defaultValue="Featured">
                <option value="Featured">Featured</option>
                <option value="Rating">Traveler Rating</option>
                <option value="PriceAsc">Price: Low to High</option>
                <option value="Duration">Duration: Short to Long</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CARDS & FEEDBACK */}
      <main className="container">
        <div className="cards-grid">
          {displayedServices.map((card) => {
            const isGuideService =
              card.providerId === "guide-agam" || card.id?.includes("guide");

            return (
              <div
                key={card.id}
                className="product-card"
                onClick={() => handleCardClick(card)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-image-wrap">
                  {isGuideService && (
                    <span className="badge-bestseller" style={{ background: "#2563EB" }}>
                      Featured Guide
                    </span>
                  )}
                  <button
                    type="button"
                    className="wishlist-btn"
                    aria-label="Add to Wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Heart size={18} />
                  </button>
                  <img
                    src={card.image || card.coverImage}
                    alt={card.title}
                    onError={(e) => {
                      e.currentTarget.src = "/himalayan-trek.jpg";
                    }}
                  />
                </div>
                <div className="card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: "0.75rem", color: "#4A7A8C", fontWeight: 600, textTransform: "uppercase" }}>
                      {card.category}
                    </span>
                    {isGuideService && (
                      <span style={{ fontSize: "0.72rem", color: "#2B4E5B", fontWeight: 700, background: "#D9E7EB", padding: "2px 8px", borderRadius: "10px" }}>
                        Host: {guideProfile.name}
                      </span>
                    )}
                  </div>
                  <h3 className="card-title">{card.title}</h3>
                  <div className="card-details">
                    <span>{card.duration}</span>
                    {card.spots && <span>• {card.spots} spots left</span>}
                  </div>
                  <div className="card-footer-row">
                    <div className="rating-badge">
                      <Star size={14} className="star-icon" />
                      {card.rating} <span className="review-count">({card.reviewCount || 40})</span>
                    </div>
                    <div className="price-box">
                      <span className="price-label">from</span>
                      <span className="price-amount">{formatINR(card.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback Bar */}
        <div className="feedback-banner">
          <span className="feedback-text">Need custom dates or private mountaineering arrangements?</span>
          <div className="feedback-btns">
            <Link to="/chat" className="btn btn-secondary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <MessageSquare size={16} />
              <span>Message Guide Directly</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
