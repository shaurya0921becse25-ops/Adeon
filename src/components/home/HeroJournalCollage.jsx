import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, Minus, Plus } from 'lucide-react';
import { PILOT_CITIES } from '../../data/destinations';
import { formatINR } from '../../utils/formatters';
import { setPendingPlan } from '../../store/tripSlice';
import Button from '../common/Button';
import './HeroJournalCollage.css';

const COLLAGE_CITIES = [
  { id: 'shimla', name: 'Shimla', dailyCost: 2800 },
  { id: 'jaipur', name: 'Jaipur', dailyCost: 3400 },
  { id: 'tokyo', name: 'Tokyo', dailyCost: 9800 },
  { id: 'dubai', name: 'Dubai', dailyCost: 11500 }
];

export default function HeroJournalCollage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCityId, setSelectedCityId] = useState('shimla');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(24000);

  const selectedCity = useMemo(() => {
    return COLLAGE_CITIES.find(c => c.id === selectedCityId) || COLLAGE_CITIES[0];
  }, [selectedCityId]);

  // Compute feasibility
  const dailyAvailable = Math.round(budget / days);
  const benchmarkCost = selectedCity.dailyCost;

  let status = 'ON TIME';
  let statusText = 'FEASIBLE';
  let statusClass = 'status-feasible';

  if (dailyAvailable < benchmarkCost) {
    status = 'OVER BUDGET';
    statusText = 'OVER BUDGET';
    statusClass = 'status-overbudget';
  } else if (dailyAvailable < benchmarkCost * 1.3) {
    status = 'TIGHT';
    statusText = 'TIGHT';
    statusClass = 'status-tight';
  }

  // Budget slider fill percentage
  const minBudget = 6000;
  const maxBudget = 90000;
  const sliderPercent = Math.min(100, Math.max(0, ((budget - minBudget) / (maxBudget - minBudget)) * 100));

  const handleLaunchPlan = () => {
    dispatch(
      setPendingPlan({
        city: selectedCity.name,
        cityId: selectedCity.id,
        days,
        budget,
        source: 'hero-collage'
      })
    );
    navigate(`/dashboard?city=${selectedCity.name}&days=${days}&budget=${budget}`);
  };

  return (
    <div className="journal-hero-wrap">
      {/* Upper Journal Collage: 3 Taped Photos + 1 Live Ticket Stub + Pink Stamp */}
      <div className="journal-collage" aria-label="Sample Route Journal Collage">
        {/* Photo 1: Shimla Toy Train */}
        <div className="collage-item collage-item--photo1" title="Kalka-Shimla Toy Train Route">
          <span className="washi-tape washi-tape--clay washi-tape--tl" aria-hidden="true" />
          <div className="polaroid-frame">
            <img
              src="/images/hero-shimla-train.jpg"
              alt="Kalka-Shimla Toy Train mountain railway route"
              width="210"
              height="150"
              loading="eager"
            />
            <div className="polaroid-caption">Shimla Toy Train • 2,076m</div>
          </div>
        </div>

        {/* Photo 2: Jaipur Hawa Mahal */}
        <div className="collage-item collage-item--photo2" title="Jaipur Old City Corridor">
          <span className="washi-tape washi-tape--pink washi-tape--tr" aria-hidden="true" />
          <div className="polaroid-frame">
            <img
              src="/images/city-jaipur.jpg"
              alt="Jaipur terracotta palace facade"
              width="190"
              height="140"
              loading="eager"
            />
            <div className="polaroid-caption">Jaipur Heritage Gate</div>
          </div>
        </div>

        {/* Photo 3: Field Verification */}
        <div className="collage-item collage-item--photo3" title="Field Log Audit">
          <span className="washi-tape washi-tape--clay washi-tape--tc" aria-hidden="true" />
          <div className="polaroid-frame">
            <img
              src="/images/guide-portrait.jpg"
              alt="Field verification log by local guide"
              width="160"
              height="130"
              loading="eager"
            />
            <div className="polaroid-caption">Field Verification #04</div>
          </div>
        </div>

        {/* Live Feasibility Ticket Stub with Pink CHECKED Rubber Stamp */}
        <div className="collage-item collage-item--ticket" title="Live Route Feasibility Ticket">
          <div className="collage-ticket-stub">
            <div className="stub-header">
              <span className="stub-code">WW-PASS-2026</span>
              <span className="stub-carrier">WANDERWISE LOGISTICS</span>
            </div>

            <div className="stub-main">
              <div className="stub-row">
                <span className="stub-label">DESTINATION</span>
                <strong className="stub-value stub-dest tabular-nums">{selectedCity.name.toUpperCase()}</strong>
              </div>
              <div className="stub-row">
                <span className="stub-label">DURATION</span>
                <span className="stub-value tabular-nums">{days} {days === 1 ? 'DAY' : 'DAYS'}</span>
              </div>
              <div className="stub-row">
                <span className="stub-label">TARGET BUDGET</span>
                <span className="stub-value tabular-nums">{formatINR(budget)}</span>
              </div>
              <div className="stub-row stub-row--status">
                <span className="stub-label">FEASIBILITY</span>
                <span className={`stub-status-pill ${statusClass}`}>
                  {status === 'ON TIME' && <CheckCircle2 size={12} />}
                  {status === 'TIGHT' && <AlertTriangle size={12} />}
                  {status === 'OVER BUDGET' && <AlertCircle size={12} />}
                  <span>{statusText}</span>
                </span>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="stub-perforated-rule" aria-hidden="true">
              <span className="cutout-left" />
              <span className="cutout-right" />
            </div>

            <div className="stub-barcode">
              <span className="barcode-bars">||| | ||| || |||| | ||| ||</span>
              <span className="stub-sample-tag">SAMPLE ROUTE DATA</span>
            </div>

            {/* Pink Stamp "CHECKED" with ink bleed */}
            <div className="ink-stamp ink-stamp--pink stamp-checked" aria-label="Checked stamp">
              <span className="stamp-inner">CHECKED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Working Feasibility Control Below Collage */}
      <div className="feasibility-control-card">
        <div className="feasibility-card-top">
          <div className="feasibility-card-title-group">
            <span className="feasibility-card-eyebrow">FEASIBILITY CONTROLS</span>
            <span className="feasibility-card-sub">Updates ticket stub live</span>
          </div>
          <span className="feasibility-sample-badge">Sample data</span>
        </div>

        {/* 1. Destination Chips */}
        <div className="feasibility-control-block">
          <label className="feasibility-label">Destination</label>
          <div className="destination-chips" role="radiogroup" aria-label="Select destination">
            {COLLAGE_CITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selectedCityId === c.id}
                className={`destination-chip ${selectedCityId === c.id ? 'is-active' : ''}`}
                onClick={() => setSelectedCityId(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Days Stepper & Budget Slider Row */}
        <div className="feasibility-control-row">
          <div className="feasibility-stepper-wrap">
            <label className="feasibility-label">Days</label>
            <div className="feasibility-stepper" role="group" aria-label="Trip days">
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setDays((d) => Math.max(1, d - 1))}
                disabled={days <= 1}
                aria-label="Decrease days"
              >
                <Minus size={14} />
              </button>
              <span className="stepper-val tabular-nums">{days}d</span>
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setDays((d) => Math.min(7, d + 1))}
                disabled={days >= 7}
                aria-label="Increase days"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="feasibility-slider-wrap">
            <div className="slider-label-line">
              <label htmlFor="feasibility-budget" className="feasibility-label">Target Budget</label>
              <span className="slider-readout tabular-nums">{formatINR(budget)}</span>
            </div>
            <input
              id="feasibility-budget"
              type="range"
              min={minBudget}
              max={maxBudget}
              step="2000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="feasibility-slider"
              style={{
                background: `linear-gradient(to right, var(--color-terracotta) 0%, var(--color-terracotta) ${sliderPercent}%, var(--color-clay) ${sliderPercent}%, var(--color-clay) 100%)`
              }}
              aria-label="Target budget in rupees"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight size={14} />}
            onClick={handleLaunchPlan}
            className="feasibility-open-btn"
          >
            Open Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
