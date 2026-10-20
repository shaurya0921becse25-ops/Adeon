import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowRight, Compass, ShieldCheck, Clock, MapPin, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { setPendingPlan } from '../../store/tripSlice';
import './HeroImageShowcase.css';

const HERO_DESTINATIONS = [
  {
    id: 'shimla',
    name: 'Shimla',
    country: 'India',
    state: 'Himachal Pradesh',
    photo: '/images/hero-shimla-train.jpg',
    headline: 'Colonial ridge walks & mountain toy train',
    stat: 'Ridge to Jakhu: 38 min',
    days: '3–4 days',
    daysNum: 3,
    budget: 7500,
    tag: 'Mountain Railway & Ridge Walk',
    auditScore: '98% Feasible',
    highlights: ['Kalka Toy Train', 'The Ridge', 'Jakhu Ropeway']
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    state: 'Rajasthan',
    photo: '/images/city-jaipur.jpg',
    headline: 'Pink stone architecture & astronomical precision',
    stat: 'City Palace → Amer Fort: 45 min',
    days: '3–4 days',
    daysNum: 3,
    budget: 8500,
    tag: 'Palaces & Heritage Crafts',
    auditScore: '96% Feasible',
    highlights: ['Amer Fort', 'Hawa Mahal', 'LMB Thali']
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    state: 'Kanto',
    photo: '/images/city-tokyo.jpg',
    headline: 'Metro timing precision & neon labyrinth',
    stat: 'Shinjuku platform transfer: 14 min',
    days: '5–7 days',
    daysNum: 5,
    budget: 85000,
    tag: 'Metro Transit & Ancient Shrines',
    auditScore: '99% Feasible',
    highlights: ['Shinjuku Platform', 'Meiji Shrine', 'Shibuya Sky']
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    state: 'Dubai',
    photo: '/images/city-dubai.jpg',
    headline: 'Air-conditioned links & desert logistics',
    stat: 'Dubai Mall → Burj Khalifa: 9 min',
    days: '4–5 days',
    daysNum: 4,
    budget: 65000,
    tag: 'Megastructures & Desert Corridors',
    auditScore: '97% Feasible',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Old Souk']
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    state: 'Goa',
    photo: '/images/city-goa.jpg',
    headline: 'Beach hopping & Portuguese heritage quarters',
    stat: 'Panaji to Baga Beach: 26 min',
    days: '3–5 days',
    daysNum: 3,
    budget: 9000,
    tag: 'Coastal Transit & Heritage Quarters',
    auditScore: '95% Feasible',
    highlights: ['Fontainhas Walk', 'Anjuna Beach', 'Spice Plantation']
  }
];

export default function HeroImageShowcase() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const activeDest = HERO_DESTINATIONS[activeIndex];
  const nextIndex = (activeIndex + 1) % HERO_DESTINATIONS.length;
  const nextDest = HERO_DESTINATIONS[nextIndex];

  // Auto-advance photos every 6 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % HERO_DESTINATIONS.length);
    }, 6000);

    return () => clearInterval(timerRef.current);
  }, [isHovered]);

  const handleLaunchPlan = (dest) => {
    dispatch(
      setPendingPlan({
        city: dest.name,
        cityId: dest.id,
        days: dest.daysNum,
        budget: dest.budget * 2,
        source: 'hero-image-showcase'
      })
    );
    navigate(`/dashboard?city=${dest.name}`);
  };

  return (
    <div
      className="hero-image-showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Interactive Destination Gallery"
    >
      {/* ── Destination Quick Switcher Tabs ──────────────────────────────── */}
      <div className="showcase-nav-row" role="tablist" aria-label="Select Destination">
        {HERO_DESTINATIONS.map((dest, idx) => (
          <button
            key={dest.id}
            role="tab"
            aria-selected={idx === activeIndex}
            className={`showcase-tab ${idx === activeIndex ? 'is-active' : ''}`}
            onClick={() => setActiveIndex(idx)}
          >
            <span className="showcase-tab-dot" />
            <span className="showcase-tab-name">{dest.name}</span>
          </button>
        ))}
      </div>

      {/* ── Main Stage Photo Card ────────────────────────────────────────── */}
      <div className="showcase-main-card">
        {/* Floating Feasibility Pill (Top Left) */}
        <div className="floating-badge floating-badge--top">
          <ShieldCheck size={14} className="badge-icon" />
          <span>Real Transit Tested · 0 Clichés</span>
        </div>

        {/* Floating Corridor Pill (Top Right) */}
        <div className="floating-badge floating-badge--audit">
          <span className="badge-pulse" />
          <span>{activeDest.auditScore}</span>
        </div>

        {/* The featured image */}
        <div className="showcase-photo-container">
          <img
            key={activeDest.id}
            src={activeDest.photo}
            alt={`${activeDest.name} - ${activeDest.headline}`}
            className="showcase-photo"
            loading="eager"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/hero-shimla-train.jpg';
            }}
          />

          {/* Gradients for readability */}
          <div className="showcase-gradient-top" />
          <div className="showcase-gradient-bottom" />

          {/* Photo Top Overlay */}
          <div className="showcase-overlay-top">
            <div className="showcase-location-chip">
              <Compass size={14} className="chip-icon" />
              <span>{activeDest.name}, {activeDest.country}</span>
              <span className="chip-sep">·</span>
              <span className="chip-tag">{activeDest.tag}</span>
            </div>
          </div>

          {/* Photo Bottom Content Overlay */}
          <div className="showcase-overlay-bottom">
            <h3 className="showcase-headline">{activeDest.headline}</h3>

            <div className="showcase-meta-row">
              <div className="showcase-meta-item">
                <Clock size={13} />
                <span>{activeDest.stat}</span>
              </div>
              <div className="showcase-meta-item">
                <MapPin size={13} />
                <span>{activeDest.days}</span>
              </div>
              <div className="showcase-meta-item showcase-meta-item--price">
                <span>from {formatINR(activeDest.budget)}</span>
              </div>
            </div>

            <div className="showcase-card-actions">
              <button
                className="showcase-explore-btn"
                onClick={() => handleLaunchPlan(activeDest)}
              >
                <span>Plan trip to {activeDest.name}</span>
                <ArrowRight size={15} />
              </button>

              <div className="showcase-highlights-preview">
                {activeDest.highlights.map((h, i) => (
                  <span key={i} className="highlight-pill">{h}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Layered Companion Secondary Card (Polaroid Style) ─────────── */}
        <div
          className="companion-floating-card"
          onClick={() => setActiveIndex(nextIndex)}
          title={`Switch to ${nextDest.name}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(nextIndex)}
        >
          <div className="companion-badge">
            <Sparkles size={11} />
            <span>Next Corridor</span>
          </div>

          <div className="companion-thumb-wrap">
            <img
              src={nextDest.photo}
              alt={nextDest.name}
              className="companion-thumb"
              loading="lazy"
            />
          </div>

          <div className="companion-info">
            <strong className="companion-name">{nextDest.name}</strong>
            <span className="companion-stat">{nextDest.stat}</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Thumbnail Strip ───────────────────────────────────────── */}
      <div className="showcase-thumbnails-strip" aria-label="Quick destination thumbnails">
        {HERO_DESTINATIONS.map((dest, idx) => (
          <button
            key={dest.id}
            className={`thumb-btn ${idx === activeIndex ? 'is-active' : ''}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`View ${dest.name}`}
          >
            <img src={dest.photo} alt={dest.name} className="thumb-btn-img" />
            <div className="thumb-btn-meta">
              <span className="thumb-btn-city">{dest.name}</span>
              <span className="thumb-btn-budget">from {formatINR(dest.budget)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
