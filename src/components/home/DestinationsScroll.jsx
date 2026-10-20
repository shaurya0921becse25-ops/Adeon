import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PILOT_CITIES } from '../../data/destinations';
import { formatINR } from '../../utils/formatters';
import { ArrowUpRight } from 'lucide-react';
import './DestinationsScroll.css';

const STATS = {
  shimla: 'Ridge to Jakhu: 38 min',
  jaipur: 'Amer fort loop: 45 min',
  tokyo: 'Shinjuku hop: 14 min',
  dubai: 'Marina walk: 9 min',
  chandigarh: 'Sector 17 loop: 12 min',
  goa: 'Panaji to Baga: 26 min',
  manali: 'Solang day trip: 22 min',
  udaipur: 'Lake loop: 24 min',
  munnar: 'Top Station: 40 min',
  kyoto: 'Arashiyama line: 28 min',
  bangkok: 'Old town loop: 8 min',
  zurich: 'Lakefront: 11 min',
};

export default function DestinationsScroll() {
  const navigate = useNavigate();

  // Duplicate list to achieve continuous infinite marquee loop without blank gaps
  const tickerItems = [...PILOT_CITIES, ...PILOT_CITIES];

  return (
    <section className="dest-ticker-section" aria-label="Suggested Destinations Corridor">
      <div className="container dest-ticker__intro">
        <div className="dest-ticker__header-row">
          <div>
            <p className="abeon-caption">curated corridors · verified timings</p>
            <h2 className="dest-ticker__title">Suggested Places</h2>
          </div>
          <p className="dest-ticker__hint">Hover to pause · Click to plan itinerary</p>
        </div>
      </div>

      {/* Infinite Marquee Strip */}
      <div className="dest-ticker__viewport">
        <div className="dest-ticker__track">
          {tickerItems.map((city, idx) => (
            <article 
              key={`${city.id}-${idx}`} 
              className="dest-ticker__card"
              onClick={() => navigate(`/itinerary?city=${encodeURIComponent(city.name)}`)}
              role="button"
              tabIndex={0}
              aria-label={`Plan ${city.name} trip`}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/itinerary?city=${encodeURIComponent(city.name)}`)}
            >
              <div className="dest-ticker__arch">
                <img
                  src={city.photo}
                  alt={city.name}
                  width={340}
                  height={440}
                  loading="lazy"
                  className="dest-ticker__photo"
                />
                <div className="dest-ticker__arch-overlay">
                  <span className="dest-ticker__pill">
                    {city.state ? `${city.state}, ` : ''}{city.country}
                  </span>
                  <span className="dest-ticker__go-icon" aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>

              <div className="dest-ticker__info">
                <div className="dest-ticker__info-top">
                  <h3 className="dest-ticker__name">{city.name}</h3>
                  <span className="dest-ticker__price">from {formatINR(city.dailyCostEst)}/day</span>
                </div>
                <p className="dest-ticker__stat">{STATS[city.id] || city.headline}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
