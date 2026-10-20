import React from 'react';
import { MapPin, Calendar, Users, IndianRupee, RotateCcw } from 'lucide-react';
import { useTripContext } from '../../context/TripContext';
import { CITIES } from '../../data/servicesSeed';
import { formatINR } from '../../utils/formatters';
import './StickyTripContextBar.css';

export default function StickyTripContextBar() {
  const { city, date, partySize, budget, setTripContext } = useTripContext();

  const handleCityChange = (e) => {
    setTripContext({ city: e.target.value });
  };

  const handleDateChange = (e) => {
    setTripContext({ date: e.target.value });
  };

  const handlePartyChange = (delta) => {
    const next = Math.max(1, Math.min(12, (partySize || 1) + delta));
    setTripContext({ partySize: next });
  };

  const handleBudgetChange = (e) => {
    const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
    setTripContext({ budget: val });
  };

  const handleReset = () => {
    setTripContext({
      city: 'Shimla',
      date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
      partySize: 2,
      budget: 25000
    });
  };

  return (
    <div className="sticky-trip-bar-wrap">
      <div className="container sticky-trip-bar">
        <div className="trip-bar-header">
          <span className="trip-bar-tag">Active Trip Context</span>
          <span className="trip-bar-note">Drives party pricing, date availability & feasibility</span>
        </div>

        <div className="trip-bar-controls">
          {/* Destination Selector */}
          <div className="trip-bar-item">
            <label htmlFor="trip-city-select" className="trip-bar-label">
              <MapPin size={14} className="trip-bar-icon" />
              <span>Destination</span>
            </label>
            <select
              id="trip-city-select"
              className="trip-bar-select"
              value={city || 'Shimla'}
              onChange={handleCityChange}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Date */}
          <div className="trip-bar-item">
            <label htmlFor="trip-date-input" className="trip-bar-label">
              <Calendar size={14} className="trip-bar-icon" />
              <span>Travel Date</span>
            </label>
            <input
              id="trip-date-input"
              type="date"
              className="trip-bar-input"
              value={date || ''}
              onChange={handleDateChange}
            />
          </div>

          {/* Party Size Stepper */}
          <div className="trip-bar-item">
            <label className="trip-bar-label">
              <Users size={14} className="trip-bar-icon" />
              <span>Party Size</span>
            </label>
            <div className="trip-stepper">
              <button
                type="button"
                className="trip-stepper-btn"
                onClick={() => handlePartyChange(-1)}
                disabled={(partySize || 1) <= 1}
                aria-label="Decrease party size"
              >
                &minus;
              </button>
              <span className="trip-stepper-val tabular-nums">
                {partySize || 1} {partySize === 1 ? 'person' : 'people'}
              </span>
              <button
                type="button"
                className="trip-stepper-btn"
                onClick={() => handlePartyChange(1)}
                disabled={(partySize || 1) >= 12}
                aria-label="Increase party size"
              >
                +
              </button>
            </div>
          </div>

          {/* Optional Trip Budget */}
          <div className="trip-bar-item">
            <label htmlFor="trip-budget-input" className="trip-bar-label">
              <IndianRupee size={14} className="trip-bar-icon" />
              <span>Total Trip Budget</span>
            </label>
            <div className="trip-budget-input-wrap">
              <span className="trip-rupee-symbol">₹</span>
              <input
                id="trip-budget-input"
                type="text"
                className="trip-bar-input tabular-nums"
                value={(budget || 0).toLocaleString('en-IN')}
                onChange={handleBudgetChange}
                placeholder="25,000"
              />
            </div>
          </div>

          {/* Reset button */}
          <button
            type="button"
            className="trip-bar-reset"
            onClick={handleReset}
            title="Reset to default context"
            aria-label="Reset context"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
