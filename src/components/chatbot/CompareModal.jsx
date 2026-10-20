import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { setPendingPlan } from '../../store/tripSlice';
import { formatINR } from '../../utils/formatters';
import Modal from '../common/Modal';
import Button from '../common/Button';
import './CompareModal.css';

function getDimensionScore(item, key, fallback = 85) {
  if (!item) return fallback;
  const bd = item.breakdown;
  if (!bd) return fallback;

  // Check direct key
  const val = bd[key];
  if (val != null) {
    if (typeof val === 'number') {
      return val <= 1 ? Math.round(val * 100) : Math.round(val);
    }
    if (typeof val === 'object' && typeof val.raw === 'number') {
      return Math.round(val.raw * 100);
    }
  }

  // Dimension fallback mappings
  if (key === 'setting' || key === 'scenery') {
    const s = bd.scenery || bd.setting;
    if (s != null) {
      if (typeof s === 'number') return s <= 1 ? Math.round(s * 100) : Math.round(s);
      if (typeof s === 'object' && typeof s.raw === 'number') return Math.round(s.raw * 100);
    }
  }
  if (key === 'budget') {
    const b = bd.budget || bd.vibe;
    if (b != null) {
      if (typeof b === 'number') return b <= 1 ? Math.round(b * 100) : Math.round(b);
      if (typeof b === 'object' && typeof b.raw === 'number') return Math.round(b.raw * 100);
    }
  }
  if (key === 'duration' || key === 'pace') {
    const p = bd.pace || bd.duration;
    if (p != null) {
      if (typeof p === 'number') return p <= 1 ? Math.round(p * 100) : Math.round(p);
      if (typeof p === 'object' && typeof p.raw === 'number') return Math.round(p.raw * 100);
    }
  }
  if (key === 'season' || key === 'climate') {
    const sn = bd.season || bd.climate;
    if (sn != null) {
      if (typeof sn === 'number') return sn <= 1 ? Math.round(sn * 100) : Math.round(sn);
      if (typeof sn === 'object' && typeof sn.raw === 'number') return Math.round(sn.raw * 100);
    }
  }

  return fallback;
}

export default function CompareModal({ isOpen, onClose, results = [], preferences = {} }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!results || results.length === 0) return null;

  const durationDays = preferences.duration === 'short' ? 3
    : preferences.duration === 'extended' ? 7
    : 4;

  const handleSelectPlan = (cityItem) => {
    const c = cityItem.city || cityItem;
    const cityName = c.name || cityItem.name || 'Shimla';
    const cityId = c.id || cityItem.id || 'shimla';
    const days = c.daysMin || durationDays;
    const budget = c.sampleBudgetMin || 18000;

    dispatch(
      setPendingPlan({
        city: cityName,
        cityId: cityId,
        days: days,
        budget: budget,
        settings: preferences.settings || [],
        group: preferences.travelers || preferences.group || 'Solo',
        season: preferences.season || 'winter',
        source: 'trip-match-compare'
      })
    );
    onClose();
    navigate(`/itinerary?city=${encodeURIComponent(cityName)}&days=${days}&budget=${budget}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Compare Top ${results.length} Feasible Destinations`}
      subtitle="Side-by-side logistics comparison based on your honest budget, time window, and preferred landscape."
      size="full"
    >
      <div className="compare-table-container">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="compare-th-metric">Criteria</th>
              {results.map((res, idx) => {
                const c = res.city || res;
                const name = c.name || res.name || 'Destination';
                const id = c.id || res.id || idx;
                const photo = c.photo || res.photo || '';
                const matchPct = res.matchPercentage ?? 85;

                return (
                  <th key={id} className="compare-th-city">
                    <div className="compare-city-header">
                      {photo && (
                        <img
                          src={photo}
                          alt={name}
                          className="compare-city-thumb"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <strong>{name}</strong>
                        <span className="compare-match-pill">{matchPct}% Match</span>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="compare-metric-name">Tagline & Character</td>
              {results.map((res, idx) => {
                const c = res.city || res;
                const headline = c.headline || res.headline || res.whyThisFits || res.whyFit || '';
                return (
                  <td key={c.id || res.id || idx} className="compare-metric-val">
                    {headline}
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="compare-metric-name">Setting & Landscape Fit</td>
              {results.map((res, idx) => {
                const score = getDimensionScore(res, 'setting', 85);
                const id = res.city?.id || res.id || idx;
                return (
                  <td key={id} className="compare-metric-val">
                    <div className="compare-score-bar-wrap">
                      <div className="compare-bar-track">
                        <div className="compare-bar-fill" style={{ width: `${score}%` }} />
                      </div>
                      <span>{score}%</span>
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="compare-metric-name">Budget Feasibility</td>
              {results.map((res, idx) => {
                const score = getDimensionScore(res, 'budget', 80);
                const id = res.city?.id || res.id || idx;
                return (
                  <td key={id} className="compare-metric-val">
                    <div className="compare-score-bar-wrap">
                      <div className="compare-bar-track">
                        <div className="compare-bar-fill" style={{ width: `${score}%` }} />
                      </div>
                      <span>{score}%</span>
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="compare-metric-name">Duration & Schedule Fit</td>
              {results.map((res, idx) => {
                const score = getDimensionScore(res, 'duration', 80);
                const id = res.city?.id || res.id || idx;
                return (
                  <td key={id} className="compare-metric-val">
                    <div className="compare-score-bar-wrap">
                      <div className="compare-bar-track">
                        <div className="compare-bar-fill" style={{ width: `${score}%` }} />
                      </div>
                      <span>{score}%</span>
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="compare-metric-name">Season & Climate Match</td>
              {results.map((res, idx) => {
                const score = getDimensionScore(res, 'season', 85);
                const id = res.city?.id || res.id || idx;
                return (
                  <td key={id} className="compare-metric-val">
                    <div className="compare-score-bar-wrap">
                      <div className="compare-bar-track">
                        <div className="compare-bar-fill" style={{ width: `${score}%` }} />
                      </div>
                      <span>{score}%</span>
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="compare-metric-name">Est. Daily Cost</td>
              {results.map((res, idx) => {
                const c = res.city || res;
                const cost = res.dailyCostEst ?? c.dailyCostEst ?? 3000;
                const id = c.id || res.id || idx;
                return (
                  <td key={id} className="compare-metric-val tabular-nums">
                    <strong>{formatINR(cost)}</strong> / day
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="compare-metric-name">Typical Trip Length</td>
              {results.map((res, idx) => {
                const c = res.city || res;
                const days = res.typicalDays || c.typicalDays || `${c.daysMin || 3}–${c.daysMax || 5} days`;
                const id = c.id || res.id || idx;
                return (
                  <td key={id} className="compare-metric-val">
                    {days}
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="compare-metric-name">Logistics & Watch Out</td>
              {results.map((res, idx) => {
                const c = res.city || res;
                const watchNote = res.watchOut || c.watchOut || 'Check peak timings in advance.';
                const id = c.id || res.id || idx;
                return (
                  <td key={id} className="compare-metric-val compare-watch-val">
                    <AlertTriangle size={14} className="watch-icon" />
                    <span>{watchNote}</span>
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="compare-metric-name">Action</td>
              {results.map((res, idx) => {
                const c = res.city || res;
                const name = c.name || res.name || 'Trip';
                const id = c.id || res.id || idx;
                return (
                  <td key={id} className="compare-metric-val">
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<ArrowRight size={14} />}
                      onClick={() => handleSelectPlan(res)}
                    >
                      Plan {name}
                    </Button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
