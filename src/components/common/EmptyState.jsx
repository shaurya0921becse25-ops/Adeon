import React from 'react';
import './EmptyState.css';

export default function EmptyState({
  title = "No notes found",
  description = "No notes for this filter yet. Be the first to write one.",
  action = null,
  className = ""
}) {
  return (
    <div className={`ww-empty-state ${className}`}>
      <div className="ww-empty-state__illustration" aria-hidden="true">
        {/* Dotted Route Line with Waypoint Pin Motif */}
        <svg width="120" height="72" viewBox="0 0 120 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 52 C35 52, 45 20, 65 20 C85 20, 90 44, 104 36"
            stroke="var(--color-sage)"
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          {/* Waypoints */}
          <circle cx="16" cy="52" r="4" fill="var(--color-warm-paper)" stroke="var(--color-ink-green)" strokeWidth="2" />
          <circle cx="65" cy="20" r="3" fill="var(--color-clay)" />
          {/* Destination Pin */}
          <circle cx="104" cy="36" r="4" fill="var(--color-clay)" />
          <path d="M104 28 C101.5 28 99.5 30 99.5 32.5 C99.5 35.8 104 40 104 40 C104 40 108.5 35.8 108.5 32.5 C108.5 30 106.5 28 104 28 Z" fill="var(--color-clay)" />
        </svg>
      </div>

      <h3 className="ww-empty-state__title">{title}</h3>
      <p className="ww-empty-state__desc">{description}</p>
      {action && <div className="ww-empty-state__action">{action}</div>}
    </div>
  );
}
