import React from 'react';
import './Skeleton.css';

export default function Skeleton({
  variant = 'text', // 'text' | 'rect' | 'circle' | 'card'
  width,
  height,
  className = '',
  count = 1
}) {
  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`ww-skeleton ww-skeleton--${variant} ${className}`}
      style={{
        width: width || (variant === 'circle' ? height : undefined),
        height: height || (variant === 'text' ? '1em' : undefined)
      }}
      aria-hidden="true"
    />
  ));

  return count === 1 ? elements[0] : <div className="ww-skeleton-group">{elements}</div>;
}
