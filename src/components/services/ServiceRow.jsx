import React from 'react';
import {
  Heart, MessageSquare, Check, AlertTriangle, Info, Clock,
  Star, ShieldCheck, ChevronRight
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import './ServiceRow.css';

export default function ServiceRow({
  service,
  partySize = 2,
  tripBudget = 25000,
  travelDate,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onViewDetail,
  onOpenMessage,
  compareCount = 0
}) {
  const guide = service.guide || {};
  const isPerPerson = service.priceMode === 'person';
  const partyTotal = isPerPerson ? service.price * partySize : service.price;

  // Capacity validation
  const isOverCapacity = partySize > service.capacityMax;
  const isUnderCapacityMin = service.capacityMin && partySize < service.capacityMin;

  // Budget fit calculation
  const budgetPct = tripBudget > 0 ? Math.round((partyTotal / tripBudget) * 100) : 0;
  const isBudgetOk = budgetPct <= 35;
  const isBudgetTight = budgetPct > 35 && budgetPct <= 70;

  // Next available dates (up to 3 chips)
  const nextDates = (service.availability || []).slice(0, 3);

  // Compare checkbox disable rule
  const compareDisabled = !isCompared && compareCount >= 3;

  return (
    <article
      className={`service-editorial-row ${isOverCapacity ? 'is-over-capacity' : ''}`}
      aria-label={`${service.title} by ${guide.name || 'Guide'}`}
    >
      {/* Compare Checkbox */}
      <div className="service-row-compare-col">
        <label
          className={`compare-checkbox-label ${compareDisabled ? 'is-disabled' : ''}`}
          title={compareDisabled ? 'Maximum 3 services can be compared' : 'Add to compare matrix'}
        >
          <input
            type="checkbox"
            checked={isCompared}
            disabled={compareDisabled}
            onChange={() => onToggleCompare(service.id)}
            aria-label={`Compare ${service.title}`}
          />
          <span className="compare-checkbox-custom">
            {isCompared && <Check size={12} strokeWidth={2.5} />}
          </span>
        </label>
      </div>

      {/* Guide Arch Portrait with Verified & Demo Profile Badges */}
      <div className="service-row-portrait-col">
        <div className="arch-portrait-wrap" onClick={() => onViewDetail(service)}>
          <img
            src={guide.photo || '/images/guide-portrait.jpg'}
            alt={guide.name || 'Guide'}
            className="arch-portrait-img"
            loading="lazy"
          />
          <span className="demo-badge">demo profile</span>
        </div>
      </div>

      {/* Main Info: Title, Guide, Rating, Languages, Inclusions */}
      <div className="service-row-info-col">
        <div className="service-row-top-meta">
          <div className="guide-meta-inline">
            <span className="guide-name">{guide.name}</span>
            {guide.verified && (
              <span className="verified-pill" title="Verified local guide">
                <ShieldCheck size={12} /> verified
              </span>
            )}
            <span className="meta-separator">&bull;</span>
            <span className="response-time">
              <Clock size={12} /> {guide.responseTime || '< 2h'}
            </span>
          </div>

          <div className="service-rating-inline">
            <Star size={13} className="star-filled" fill="currentColor" />
            <strong className="rating-score tabular-nums">{service.rating || guide.rating || 4.8}</strong>
            <span className="review-count">({service.reviewCount || 0} reviews)</span>
          </div>
        </div>

        <h3
          className="service-row-title"
          onClick={() => onViewDetail(service)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onViewDetail(service)}
        >
          {service.title}
        </h3>

        <div className="service-row-subline">
          <span className="service-type-badge">{service.type}</span>
          <span className="service-duration">{service.duration}</span>
          <span className="meta-separator">&bull;</span>
          <span className="service-languages">
            {(guide.languages || ['English']).join(', ')}
          </span>
        </div>

        {/* Capacity Strip Dots */}
        <div className="capacity-strip-wrap">
          <span className="capacity-strip-label">
            Capacity: min {service.capacityMin || 1} &bull; max {service.capacityMax}
          </span>
          <div
            className="capacity-dots"
            role="img"
            aria-label={`Party capacity: ${partySize} of ${service.capacityMax}`}
          >
            {Array.from({ length: service.capacityMax }).map((_, i) => {
              const isPartyDot = i < partySize;
              return (
                <span
                  key={i}
                  className={`capacity-dot ${isPartyDot ? 'is-filled' : 'is-empty'} ${
                    isOverCapacity ? 'is-over' : ''
                  }`}
                  title={
                    isPartyDot
                      ? `Guest ${i + 1} of your party`
                      : `Available slot ${i + 1}`
                  }
                />
              );
            })}
          </div>
        </div>

        {/* Next Available Dates */}
        <div className="next-dates-row">
          <span className="next-dates-label">Next dates:</span>
          {nextDates.map((d) => (
            <span
              key={d}
              className={`next-date-pill ${d === travelDate ? 'is-selected-date' : ''}`}
            >
              {d === travelDate && <Check size={10} />}
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Feasibility & Pricing Column */}
      <div className="service-row-pricing-col">
        {/* Pricing breakdown */}
        <div className="pricing-box">
          <div className="base-price tabular-nums">
            <span className="price-val">{formatINR(service.price)}</span>
            <span className="price-unit">/{isPerPerson ? 'person' : 'group'}</span>
          </div>
          <div className="party-total tabular-nums">
            <strong>{formatINR(partyTotal)}</strong> total for {partySize} {partySize === 1 ? 'person' : 'guests'}
          </div>
        </div>

        {/* Feasibility Badges */}
        <div className="feasibility-badges-wrap">
          {/* Party feasibility */}
          {isOverCapacity ? (
            <span className="feasibility-flag is-over" role="status">
              <AlertTriangle size={12} />
              <span>over capacity (max {service.capacityMax})</span>
            </span>
          ) : isUnderCapacityMin ? (
            <span className="feasibility-flag is-tight" role="status">
              <Info size={12} />
              <span>requires min {service.capacityMin} guests</span>
            </span>
          ) : (
            <span className="feasibility-flag is-ok" role="status">
              <Check size={12} />
              <span>fits your party</span>
            </span>
          )}

          {/* Budget feasibility */}
          {tripBudget > 0 && (
            <span
              className={`feasibility-flag ${
                isBudgetOk ? 'is-ok' : isBudgetTight ? 'is-tight' : 'is-over'
              }`}
              role="status"
            >
              {isBudgetOk ? (
                <Check size={12} />
              ) : isBudgetTight ? (
                <Info size={12} />
              ) : (
                <AlertTriangle size={12} />
              )}
              <span>
                {isBudgetOk
                  ? `fits your budget (${budgetPct}%)`
                  : `uses ${budgetPct}% of trip budget`}
              </span>
            </span>
          )}
        </div>

        {/* Over-capacity dimming explanation */}
        {isOverCapacity && (
          <p className="dimmed-reason-text">
            Dimmed: party of {partySize} exceeds maximum limit of {service.capacityMax}.
          </p>
        )}

        {/* Row Actions */}
        <div className="service-row-actions">
          <button
            type="button"
            className={`action-icon-btn ${isSaved ? 'is-saved' : ''}`}
            onClick={() => onToggleSave(service.id)}
            title={isSaved ? 'Remove from saved' : 'Save service'}
            aria-label={isSaved ? 'Saved' : 'Save'}
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            className="action-icon-btn"
            onClick={() => onOpenMessage(service)}
            title="Message guide"
            aria-label="Message guide"
          >
            <MessageSquare size={16} />
          </button>

          <button
            type="button"
            className="action-view-btn"
            onClick={() => onViewDetail(service)}
          >
            <span>View</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
