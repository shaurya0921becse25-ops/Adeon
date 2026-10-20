import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { PILOT_CITIES } from '../../data/destinations';
import { formatINR } from '../../utils/formatters';
import { setPendingPlan } from '../../store/tripSlice';
import './FeasibilityBoard.css';

/* ── Sample timetable stat shown on each city in the ticket section ─── */
const CITY_STATS = {
  shimla:      'Ridge to Jakhu: 38 min',
  jaipur:      'City Palace to Amer: 45 min',
  tokyo:       'Shinjuku transfer: 14 min',
  dubai:       'Dubai Mall to Burj: 9 min',
  chandigarh:  'Sector 17 to Garden: 12 min',
  goa:         'Panaji to Baga Beach: 26 min',
  manali:      'Manali to Solang: 22 min',
  udaipur:     'City Palace to Sajjangarh: 24 min',
  munnar:      'Munnar to Top Station: 40 min',
  kyoto:       'Arashiyama to Fushimi: 28 min',
  bangkok:     'Grand Palace to Wat Pho: 8 min',
  zurich:      'Hauptbahnhof to Lindenhügel: 11 min',
};

/* Board destinations (first 5 of PILOT_CITIES) */
const BOARD_CITIES = PILOT_CITIES.slice(0, 5);

/* Flap Cell — 3-D flip animation when value changes */
function FlapCell({ value, className = '' }) {
  const [current, setCurrent] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value !== prevRef.current) {
      setFlipping(true);
      const t = setTimeout(() => {
        setCurrent(value);
        prevRef.current = value;
        setFlipping(false);
      }, 220);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span className={`flap-cell ${flipping ? 'is-flipping' : ''} ${className}`}>
      <span className="flap-top">{current}</span>
      {flipping && <span className="flap-bottom">{value}</span>}
    </span>
  );
}

export default function FeasibilityBoard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCityId, setSelectedCityId] = useState(BOARD_CITIES[0].id);
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(20000);

  const city = useMemo(
    () => PILOT_CITIES.find(c => c.id === selectedCityId) || PILOT_CITIES[0],
    [selectedCityId]
  );

  /* ── Compute feasibility ───────────────────────────────────────────── */
  const dailyAvail   = Math.round(budget / days);
  const baseStops    = city.sampleStops;
  const dailyCost    = baseStops.reduce((s, st) => s + st.cost, 0);
  const isOverBudget = dailyAvail < dailyCost;
  const isTight      = !isOverBudget && dailyAvail < dailyCost * 1.3;

  /* Which stops to display */
  const displayStops = useMemo(() => {
    if (!isOverBudget) return baseStops;
    const nonPremium = baseStops.filter(s => !s.isPremium);
    return [...nonPremium, city.swapStop];
  }, [isOverBudget, baseStops, city.swapStop]);

  function statusFor(stop) {
    const isSwap = stop.id?.includes('swap');
    if (isOverBudget || isSwap) return 'OVER BUDGET';
    if (isTight) return 'TIGHT';
    return 'ON TIME';
  }

  /* Slider fill % */
  const minB = 5000, maxB = 100000;
  const fillPct = Math.round(((budget - minB) / (maxB - minB)) * 100);

  const handleOpenPlan = () => {
    dispatch(setPendingPlan({ city: city.name, cityId: city.id, days, budget, source: 'hero-board' }));
    navigate(`/dashboard?city=${city.name}&days=${days}&budget=${budget}`);
  };

  return (
    <div className="fb-outer">
      {/* ── Brass Frame Header ───────────────────────────────────────────── */}
      <div className="fb-header">
        <span className="fb-header-title">FEASIBILITY BOARD</span>
        <span className="fb-header-sub">Sample data · live recompute</span>
      </div>

      {/* ── Controls Row ─────────────────────────────────────────────────── */}
      <div className="fb-controls">
        {/* City chips */}
        <div className="fb-control-group">
          <span className="fb-ctrl-label">DESTINATION</span>
          <div className="fb-chips" role="radiogroup" aria-label="Select destination">
            {BOARD_CITIES.map(c => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selectedCityId === c.id}
                className={`fb-chip ${selectedCityId === c.id ? 'is-active' : ''}`}
                onClick={() => setSelectedCityId(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="fb-controls-row2">
          {/* Days stepper */}
          <div className="fb-control-group">
            <span className="fb-ctrl-label">DAYS</span>
            <div className="fb-stepper" role="group" aria-label="Trip duration">
              <button
                type="button"
                className="fb-step-btn"
                onClick={() => setDays(d => Math.max(1, d - 1))}
                disabled={days <= 1}
                aria-label="Fewer days"
              >
                <Minus size={13} />
              </button>
              <span className="fb-step-val tabular-nums">{days}d</span>
              <button
                type="button"
                className="fb-step-btn"
                onClick={() => setDays(d => Math.min(8, d + 1))}
                disabled={days >= 8}
                aria-label="More days"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Budget slider */}
          <div className="fb-control-group fb-control-group--slider">
            <div className="fb-slider-head">
              <span className="fb-ctrl-label">BUDGET</span>
              <span className="fb-budget-val tabular-nums">{formatINR(budget)}</span>
            </div>
            <input
              id="fb-budget-slider"
              type="range"
              min={minB}
              max={maxB}
              step="2500"
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="fb-slider"
              style={{
                background: `linear-gradient(to right, var(--color-terracotta) 0%, var(--color-terracotta) ${fillPct}%, rgba(217,231,235,0.25) ${fillPct}%, rgba(217,231,235,0.25) 100%)`
              }}
              aria-label="Target budget"
            />
          </div>
        </div>
      </div>

      {/* ── Split-Flap Timetable Board ────────────────────────────────────── */}
      <div className="fb-board" role="table" aria-label="Day 1 Timetable">
        {/* Header row */}
        <div className="fb-row fb-row--head" role="row">
          <span className="fb-col fb-col--time" role="columnheader">TIME</span>
          <span className="fb-col fb-col--stop" role="columnheader">STOP</span>
          <span className="fb-col fb-col--cost" role="columnheader">COST</span>
          <span className="fb-col fb-col--status" role="columnheader">STATUS</span>
        </div>

        {displayStops.map((stop, i) => {
          const st = statusFor(stop);
          const isSwap = stop.id?.includes('swap');
          return (
            <div
              key={stop.id}
              className={`fb-row fb-row--data ${isSwap ? 'fb-row--swap' : ''}`}
              role="row"
            >
              <span className="fb-col fb-col--time" role="cell">
                <FlapCell value={stop.timeWindow?.split('–')[0]?.trim() || `${8 + i * 2}:00`} />
              </span>
              <span className="fb-col fb-col--stop" role="cell">
                <FlapCell value={stop.name.length > 28 ? stop.name.slice(0, 28) + '…' : stop.name} />
                {isSwap && <span className="fb-swap-tag">SWAP SUGGESTED</span>}
              </span>
              <span className="fb-col fb-col--cost tabular-nums" role="cell">
                <FlapCell value={stop.cost === 0 ? 'Free' : formatINR(stop.cost)} />
              </span>
              <span className={`fb-col fb-col--status fb-status--${st.toLowerCase().replace(' ', '-')}`} role="cell">
                <FlapCell value={st} className={`fb-status-pill status-${st.toLowerCase().replace(' ', '-')}`} />
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Footer — daily total + Open Plan CTA ─────────────────────────── */}
      <div className="fb-footer">
        <div className="fb-daily-total">
          <span className="fb-total-label">EST. DAILY TOTAL</span>
          <span className="fb-total-val tabular-nums">
            {formatINR(displayStops.reduce((s, st) => s + st.cost, 0))} / day
          </span>
        </div>
        <button type="button" className="fb-open-btn" onClick={handleOpenPlan}>
          Open full plan
          <ArrowRight size={15} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
