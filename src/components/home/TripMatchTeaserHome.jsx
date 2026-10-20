import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { VIBE_OPTIONS } from '../../data/destinationMatchProfiles';
import { teaserMatches } from '../../utils/matchScore';
import './TripMatchTeaserHome.css';

const PEBBLES = VIBE_OPTIONS.slice(0, 6);

export default function TripMatchTeaserHome() {
  const [vibe, setVibe] = useState('mountains');
  const matches = teaserMatches(vibe, 3);

  return (
    <section className="tm-teaser" aria-label="Trip Match — find your destination" id="trip-match">
      <div className="container">
        <div className="tm-teaser__header">
          <p className="abeon-caption">
            <Sparkles size={12} style={{ display: 'inline', marginRight: 6 }} aria-hidden="true" />
            ai-powered matching
          </p>
          <h2 className="tm-teaser__title">Trip Match</h2>
          <p className="tm-teaser__sub">
            Tell us what kind of place excites you — we&apos;ll surface the best matching destinations from our pilot cities.
          </p>
        </div>

        <div className="tm-teaser__pebbles" role="group" aria-label="Select your travel vibe">
          {PEBBLES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`tm-teaser__pebble ${vibe === p.id ? 'is-active' : ''}`}
              onClick={() => setVibe(p.id)}
              aria-pressed={vibe === p.id}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="tm-teaser__result" aria-live="polite" aria-label="Matching destinations">
          <span className="tm-teaser__result-label">Top matches for &ldquo;{vibe}&rdquo;</span>
          <p className="tm-teaser__morph">
            {matches.length > 0
              ? matches.map((m) => m.city.name).join(' · ')
              : 'No matches — try another vibe!'}
          </p>
        </div>

        <Link to="/trip-match" className="tm-teaser__cta" id="trip-match-cta">
          Start the full Trip Match <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
