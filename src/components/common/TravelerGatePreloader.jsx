import React, { useState, useEffect, useRef } from 'react';
import './TravelerGatePreloader.css';

const LETTERS = ['a', 'b', 'e', 'o', 'n'];
const STORAGE_KEY = 'abeon_traveler_gate_passed';

export default function TravelerGatePreloader({ force = false }) {
  const [shouldRender, setShouldRender] = useState(() => {
    if (force) return true;
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem(STORAGE_KEY);
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => {
    const handleTrigger = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      sessionStorage.removeItem(STORAGE_KEY);
      setIsHidden(false);
      setIsOpen(false);
      setShouldRender(true);
      startGateSequence();
    };

    window.addEventListener('trigger_traveler_preloader', handleTrigger);
    return () => {
      window.removeEventListener('trigger_traveler_preloader', handleTrigger);
    };
  }, []);

  const startGateSequence = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reveal timing: 700ms letter reveal + 1100ms admiring hold -> gate pull-up
    const waitTime = reduced ? 600 : 1800;
    const openDuration = 1000;

    const t1 = setTimeout(() => {
      setIsOpen(true);

      const t2 = setTimeout(() => {
        setIsHidden(true);
        setShouldRender(false);
        try {
          sessionStorage.setItem(STORAGE_KEY, 'true');
        } catch (e) {}
      }, openDuration);

      timersRef.current.push(t2);
    }, waitTime);

    timersRef.current.push(t1);
  };

  useEffect(() => {
    if (shouldRender && !isHidden) {
      startGateSequence();
    }
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [shouldRender]);

  if (!shouldRender || isHidden) {
    return null;
  }

  return (
    <div
      className={`gate-preloader ${isOpen ? 'gate-open' : ''}`}
      id="gate"
      aria-label="abeon"
      role="status"
      aria-live="polite"
    >
      <div className="gate-word" id="word" aria-hidden="true">
        {LETTERS.map((char, index) => (
          <span key={index} className="gate-ch">
            <span style={{ '--i': index }}>{char}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
