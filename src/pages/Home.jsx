import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, MapPin, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AbeonHero from '../components/home/AbeonHero';
import DestinationsScroll from '../components/home/DestinationsScroll';
import TripMatchTeaserHome from '../components/home/TripMatchTeaserHome';
import CommunityMoments from '../components/home/CommunityMoments';
import DuskFinale from '../components/home/DuskFinale';
import PlanItineraryTeaser from '../components/home/PlanItineraryTeaser';
import Button from '../components/common/Button';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { userRole, setRole } = useAuth();
  const [hoveredSide, setHoveredSide] = useState(null);

  const handleSelectRole = (role) => {
    setRole(role);
    navigate(role === 'traveler' ? '/itinerary' : '/services');
  };

  return (
    <main id="main-content" className="home-page">
      {/* 1. Hero */}
      <AbeonHero />

      {/* 2. Role Selection: Explore as Traveller or Guide */}
      <section className="section choose-section" aria-label="Choose your role" id="role-select">
        <div className="container">
          <div className="section-intro section-intro--center">
            <p className="abeon-caption">two perspectives</p>
            <h2 className="choose-heading-main">How would you like to explore?</h2>
            <p className="choose-sub">Choose your role to unlock a personalised experience tailored to your journey.</p>
          </div>
        </div>
        <div
          className={`choose-split-wrap ${hoveredSide ? `hovered-${hoveredSide}` : ''}`}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div
            className={`choose-half choose-half--traveler ${userRole === 'traveler' ? 'is-active' : ''}`}
            onMouseEnter={() => setHoveredSide('traveler')}
            onClick={() => handleSelectRole('traveler')}
            role="button"
            tabIndex={0}
            aria-label="Enter as Traveler"
            onKeyDown={(e) => e.key === 'Enter' && handleSelectRole('traveler')}
          >
            <div className="choose-bg-media" style={{ backgroundImage: "url('/images/hero-shimla-train.jpg')" }} aria-hidden="true" />
            <div className="choose-bg-overlay choose-bg-overlay--traveler" aria-hidden="true" />
            <div className="choose-half-inner">
              <div className="choose-badge"><Compass size={15} /><span>Traveler</span></div>
              <h3 className="choose-heading">I&apos;m planning a trip</h3>
              <p className="choose-desc">Build sample itineraries, match destinations, and discover local guide services.</p>
              <ul className="choose-list">
                {['Trip Match suggestions', 'Itinerary planner', 'Local guide discovery'].map((t) => (
                  <li key={t}><Check size={14} />{t}</li>
                ))}
              </ul>
              <Button variant="primary" size="md" rightIcon={<ArrowRight size={15} />} className="choose-cta">Enter as Traveler</Button>
            </div>
          </div>
          <div
            className={`choose-half choose-half--guide ${userRole === 'guide' ? 'is-active' : ''}`}
            onMouseEnter={() => setHoveredSide('guide')}
            onClick={() => handleSelectRole('guide')}
            role="button"
            tabIndex={0}
            aria-label="Enter as Local Guide"
            onKeyDown={(e) => e.key === 'Enter' && handleSelectRole('guide')}
          >
            <div className="choose-bg-media" style={{ backgroundImage: "url('/images/guide-portrait.jpg')" }} aria-hidden="true" />
            <div className="choose-bg-overlay choose-bg-overlay--guide" aria-hidden="true" />
            <div className="choose-half-inner">
              <div className="choose-badge"><MapPin size={15} /><span>Local Guide</span></div>
              <h3 className="choose-heading">I&apos;m a local insider</h3>
              <p className="choose-desc">Switch to the guide-side services view and share field notes in the community.</p>
              <ul className="choose-list">
                {['Manage your listings', 'View incoming requests', 'Post community field notes'].map((t) => (
                  <li key={t}><Check size={14} />{t}</li>
                ))}
              </ul>
              <Button variant="outline" size="md" rightIcon={<ArrowRight size={15} />} className="choose-cta">Enter as Guide</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Suggested Places */}
      <DestinationsScroll />

      {/* 5. Plan Itinerary */}
      <PlanItineraryTeaser />

      {/* 6. Community Notes */}
      <CommunityMoments />

      {/* 7. Trip Match */}
      <TripMatchTeaserHome />

      {/* Closing CTA */}
      <DuskFinale />
    </main>
  );
}
