import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckCircle2, AlertTriangle, AlertCircle, ArrowRight, Minus, Plus, RefreshCw, Clock, IndianRupee } from 'lucide-react';
import { PILOT_CITIES } from '../../data/destinations';
import { formatINR } from '../../utils/formatters';
import { setPendingPlan } from '../../store/tripSlice';
import TicketCard from '../common/TicketCard';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './HeroPreviewCard.css';

export default function HeroPreviewCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCityId, setSelectedCityId] = useState('shimla');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(22000);

  const city = useMemo(() => {
    return PILOT_CITIES.find((c) => c.id === selectedCityId) || PILOT_CITIES[0];
  }, [selectedCityId]);

  // Compute feasibility
  const dailyAvailable = Math.round(budget / days);
  
  // Base 4 stops
  const baseStops = city.sampleStops;
  const baseStopsDailyCost = baseStops.reduce((sum, s) => sum + s.cost, 0);

  // Status computation
  const isOverBudget = dailyAvailable < baseStopsDailyCost;
  const deficit = isOverBudget ? baseStopsDailyCost - dailyAvailable : 0;
  const isTight = !isOverBudget && dailyAvailable < baseStopsDailyCost * 1.25;

  let statusBadge = null;
  if (isOverBudget) {
    statusBadge = (
      <Badge variant="danger" icon={<AlertCircle size={14} />}>
        Over budget by {formatINR(deficit * days)}
      </Badge>
    );
  } else if (isTight) {
    statusBadge = (
      <Badge variant="warning" icon={<AlertTriangle size={14} />}>
        Tight budget (Buffer: {formatINR((dailyAvailable - baseStopsDailyCost) * days)})
      </Badge>
    );
  } else {
    statusBadge = (
      <Badge variant="success" icon={<CheckCircle2 size={14} />}>
        Feasible Plan
      </Badge>
    );
  }

  // Active stops shown: if over budget, replace premium stop with swap stop
  const displayStops = useMemo(() => {
    if (!isOverBudget) {
      return baseStops;
    }
    // Filter out premium stop and insert swap stop
    const nonPremium = baseStops.filter((s) => !s.isPremium);
    return [...nonPremium, city.swapStop];
  }, [isOverBudget, baseStops, city.swapStop]);

  const handleOpenPlan = () => {
    dispatch(
      setPendingPlan({
        city: city.name,
        cityId: city.id,
        days,
        budget,
        source: 'hero-preview'
      })
    );
    navigate(`/itinerary?city=${encodeURIComponent(city.name)}&days=${days}&budget=${budget}`);
  };

  return (
    <div className="hero-preview-wrapper">
      <TicketCard
        className="hero-preview-card"
        header={
          <div className="hero-preview-card__header">
            <div className="hero-preview-card__title-group">
              <span className="hero-preview-tag">FEASIBILITY PREVIEW</span>
              <span className="hero-preview-subtag">Demo preview, sample data</span>
            </div>
            {statusBadge}
          </div>
        }
        stub={
          <div className="hero-preview-card__footer">
            <div className="hero-preview-cost-summary">
              <small>TOTAL ESTIMATED DAILY COST</small>
              <div className="hero-preview-cost-val tabular-nums">
                {formatINR(displayStops.reduce((sum, s) => sum + s.cost, 0))} / day
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight size={16} />}
              onClick={handleOpenPlan}
            >
              Open full plan
            </Button>
          </div>
        }
      >
        {/* Controls Section */}
        <div className="hero-preview-controls">
          {/* City Chips */}
          <div className="hero-control-group">
            <label className="hero-control-label">1. DESTINATION</label>
            <div className="hero-city-chips" role="radiogroup" aria-label="Select pilot city">
              {PILOT_CITIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`hero-city-chip ${selectedCityId === c.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedCityId(c.id)}
                  role="radio"
                  aria-checked={selectedCityId === c.id}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-control-row">
            {/* Days Stepper */}
            <div className="hero-control-group hero-control-group--stepper">
              <label className="hero-control-label">2. DURATION</label>
              <div className="hero-stepper" role="group" aria-label="Trip duration in days">
                <button
                  type="button"
                  className="hero-stepper-btn"
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  disabled={days <= 1}
                  aria-label="Decrease days"
                >
                  <Minus size={14} />
                </button>
                <span className="hero-stepper-val tabular-nums">
                  {days} {days === 1 ? 'day' : 'days'}
                </span>
                <button
                  type="button"
                  className="hero-stepper-btn"
                  onClick={() => setDays((d) => Math.min(7, d + 1))}
                  disabled={days >= 7}
                  aria-label="Increase days"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Budget Slider */}
            <div className="hero-control-group hero-control-group--slider">
              <div className="hero-slider-header">
                <label htmlFor="hero-budget-slider" className="hero-control-label">3. TARGET BUDGET</label>
                <span className="hero-budget-readout tabular-nums">{formatINR(budget)}</span>
              </div>
              <input
                id="hero-budget-slider"
                type="range"
                min="5000"
                max="100000"
                step="2500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="hero-range-slider"
                aria-label="Budget slider"
              />
              <div className="hero-slider-scale">
                <small>₹5,000</small>
                <small>₹1,00,000</small>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Mini-Itinerary Stops */}
        <div className="hero-itinerary-preview">
          <div className="hero-itinerary-header">
            <small className="hero-itinerary-title">
              DAY 1 TIMETABLE ({city.name.toUpperCase()})
            </small>
            {isOverBudget && (
              <span className="hero-swap-notice">
                <RefreshCw size={12} className="hero-spin-notice" /> 1 expensive stop replaced to stay balanced
              </span>
            )}
          </div>

          <div className="hero-stops-list">
            {displayStops.map((stop, index) => {
              const isSwapped = stop.id.includes('swap');
              return (
                <div
                  key={stop.id}
                  className={`hero-stop-item ${isSwapped ? 'is-swapped-in' : ''}`}
                >
                  <div className="hero-stop-indicator">
                    <span className="hero-stop-node">{index + 1}</span>
                    {index < displayStops.length - 1 && <span className="hero-stop-line" />}
                  </div>

                  <div className="hero-stop-details">
                    <div className="hero-stop-top">
                      <strong className="hero-stop-name">{stop.name}</strong>
                      <span className="hero-stop-cost tabular-nums">
                        {stop.cost === 0 ? 'Free' : formatINR(stop.cost)}
                      </span>
                    </div>

                    <div className="hero-stop-meta">
                      <span className="hero-stop-time">
                        <Clock size={12} /> {stop.timeWindow}
                      </span>
                      <span className="hero-stop-cat">{stop.category}</span>
                    </div>

                    {isSwapped && (
                      <p className="hero-stop-swap-tag">
                        &bull; Budget substitution: saved {formatINR(1900)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </TicketCard>
    </div>
  );
}
