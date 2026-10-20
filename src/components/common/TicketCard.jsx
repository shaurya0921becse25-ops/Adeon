import React from 'react';
import './TicketCard.css';

/**
 * TicketCard — WanderWise signature motif component
 * Features notched ticket edges, hairline border, and dashed tear line stub
 */
export default function TicketCard({
  children,
  header = null,
  stub = null,
  variant = 'default',
  className = '',
  notchPosition = 'bottom', // 'bottom' | 'middle' | 'both'
  ...props
}) {
  return (
    <div className={`ww-ticket-card ww-ticket-card--${variant} notch-${notchPosition} ${className}`} {...props}>
      {/* Corner notch decorations */}
      <span className="ww-ticket-notch ww-ticket-notch--tl" aria-hidden="true" />
      <span className="ww-ticket-notch ww-ticket-notch--tr" aria-hidden="true" />

      {header && (
        <div className="ww-ticket-card__header">
          {header}
        </div>
      )}

      <div className="ww-ticket-card__body">
        {children}
      </div>

      {stub && (
        <>
          <div className="ww-ticket-card__tear-line" aria-hidden="true">
            <span className="ww-ticket-notch ww-ticket-notch--stub-left" />
            <div className="ww-ticket-card__dashed-rule" />
            <span className="ww-ticket-notch ww-ticket-notch--stub-right" />
          </div>
          <div className="ww-ticket-card__stub">
            {stub}
          </div>
        </>
      )}

      <span className="ww-ticket-notch ww-ticket-notch--bl" aria-hidden="true" />
      <span className="ww-ticket-notch ww-ticket-notch--br" aria-hidden="true" />
    </div>
  );
}
