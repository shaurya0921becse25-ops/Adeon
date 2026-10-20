import React, { useState } from 'react';
import './Tooltip.css';

export default function Tooltip({
  content,
  children,
  position = 'top', // 'top' | 'bottom'
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className={`ww-tooltip-wrap ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="tooltip"
      aria-label={typeof content === 'string' ? content : undefined}
    >
      {children}
      {isVisible && (
        <span className={`ww-tooltip-bubble ww-tooltip-bubble--${position}`} role="status">
          {content}
        </span>
      )}
    </span>
  );
}
