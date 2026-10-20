import React, { useEffect, useRef } from 'react';
import './RouteLine.css';

/**
 * RouteLine — Signature WanderWise Motif
 * Dotted route line with waypoint circles and scroll/progress animation
 */
export default function RouteLine({
  orientation = 'vertical', // 'vertical' | 'horizontal'
  steps = [], // [{ label, completed, active }]
  className = '',
  animated = true
}) {
  const lineRef = useRef(null);

  useEffect(() => {
    if (!animated) return;

    const handleScroll = () => {
      if (!lineRef.current) return;
      const rect = lineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Compute visibility percentage
      const total = rect.height;
      const visible = Math.max(0, Math.min(total, windowHeight - rect.top));
      const progress = Math.min(1, Math.max(0, visible / (total + windowHeight * 0.4)));

      const path = lineRef.current.querySelector('.ww-route-path');
      if (path) {
        const length = path.getTotalLength ? path.getTotalLength() : 400;
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length * (1 - progress)}`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [animated]);

  if (orientation === 'horizontal') {
    return (
      <div className={`ww-route-line-horizontal ${className}`}>
        <div className="ww-route-track" />
        <div className="ww-route-steps">
          {steps.map((step, idx) => {
            const isCompleted = step.completed;
            const isActive = step.active;
            return (
              <div
                key={idx}
                className={`ww-route-step ${isCompleted ? 'is-completed' : ''} ${isActive ? 'is-active' : ''}`}
              >
                <div className="ww-route-waypoint">
                  <span className="ww-route-node" />
                </div>
                {step.label && <span className="ww-route-label">{step.label}</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={lineRef} className={`ww-route-line-vertical ${className}`} aria-hidden="true">
      <svg className="ww-route-svg" viewBox="0 0 24 600" preserveAspectRatio="none">
        <line
          x1="12"
          y1="0"
          x2="12"
          y2="600"
          className="ww-route-path"
          stroke="var(--route-line-color)"
          strokeWidth="2"
          strokeDasharray="4 6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
