import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Star,
  ThumbsUp,
  ThumbsDown,
  X,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { getAllAvailableServices } from "../data/services";
import { loadGuideProfile, subscribeToDataChanges, broadcastDataChange } from "../data/sharedDataBridge";
import { formatINR } from "../utils/pricing";
import "./TripPage.css";

export const TripPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destinationParam = searchParams.get("destination") || "Shimla";

  const [searchInput, setSearchInput] = useState(destinationParam);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [guideProfile, setGuideProfile] = useState(() => loadGuideProfile());
  const [servicesList, setServicesList] = useState(() => getAllAvailableServices());
  const searchWrapperRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!filterModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setFilterModalOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filterModalOpen]);

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

  const filterGroups = [
    {
      title: "Time of Day",
      options: [
        "Morning (Starts before 12pm)",
        "Afternoon (Starts after 12pm)",
        "Evening (Starts after 5pm)"
      ]
    },
    {
      title: "Duration",
      options: ["Up to 1 hour", "1 to 4 hours", "4 hours to 1 day", "1 to 3 days"]
    },
    {
      title: "Specials",
      options: ["Free Cancellation", "Deals & Discounts", "Skip-The-Line"]
    }
  ];

  const handleSelectDestination = (name) => {
    setSearchInput(name);
    setSearchDropdownOpen(false);
  };

  const toggleFilter = (filter) => {
    setSelectedFilters((currentFilters) =>
      currentFilters.includes(filter)
        ? currentFilters.filter((currentFilter) => currentFilter !== filter)
        : [...currentFilters, filter]
    );
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
          <div className="search-wrapper" ref={searchWrapperRef}>
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

        </div>
      </section>

      {/* SECTION 2: THINGS TO DO & FILTERS */}
      <section className="filter-section">
        <div className="container">
          <div className="section-title-row">
            <h2>Things to do in Himachal</h2>
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
                  <img
                    src={card.image || card.coverImage || "/himalayan-trek.jpg"}
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
                      <span style={{ fontSize: "0.72rem", color: "#2B4E5B", fontWeight: 700, background: "#E7EFF3", padding: "2px 8px", borderRadius: "10px" }}>
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

      {filterModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setFilterModalOpen(false)}
        >
          <section
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filterModalTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="filterModalTitle">Filter</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setFilterModalOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {filterGroups.map((group) => (
                <div key={group.title}>
                  <div className="filter-group-title">{group.title}</div>
                  <div className="checkbox-list">
                    {group.options.map((option) => (
                      <label className="checkbox-item" key={option}>
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(option)}
                          onChange={() => toggleFilter(option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="clear-btn"
                onClick={() => setSelectedFilters([])}
              >
                Clear all
              </button>
              <button
                type="button"
                className="apply-btn"
                onClick={() => setFilterModalOpen(false)}
              >
                See {displayedServices.length} results
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
