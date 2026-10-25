import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./CircleGallery.css";

// Procedural gradient artwork matching the exact visual style in React Bits Pro
const CARD_ARTWORKS = [
  (
    <svg viewBox="0 0 200 250" className="circle-gallery-svg" key="artwork-wave">
      <defs>
        <linearGradient id="g1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#431282" />
          <stop offset="100%" stopColor="#1a0438" />
        </linearGradient>
        <linearGradient id="g1-wave" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff007f" />
          <stop offset="50%" stopColor="#ff2a85" />
          <stop offset="100%" stopColor="#8900ff" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="url(#g1-bg)" />
      <path
        d="M-20,60 C40,40 60,140 140,110 C180,95 210,130 220,150 L220,270 L-20,270 Z"
        fill="url(#g1-wave)"
      />
    </svg>
  ),
  (
    <svg viewBox="0 0 200 250" className="circle-gallery-svg" key="artwork-ring">
      <defs>
        <radialGradient id="g2-circle" cx="60%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ff1475" />
          <stop offset="50%" stopColor="#e60067" />
          <stop offset="90%" stopColor="#3d0370" />
        </radialGradient>
      </defs>
      <rect width="200" height="250" fill="#240747" />
      <circle cx="100" cy="80" r="75" fill="none" stroke="url(#g2-circle)" strokeWidth="48" />
    </svg>
  ),
  (
    <svg viewBox="0 0 200 250" className="circle-gallery-svg" key="artwork-slash">
      <defs>
        <linearGradient id="g3-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff455b" />
          <stop offset="50%" stopColor="#ff158a" />
          <stop offset="100%" stopColor="#ff0055" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="#2d0c5a" />
      <path d="M-10,30 L220,-20 L220,110 L-10,180 Z" fill="url(#g3-grad)" opacity="0.95" />
    </svg>
  ),
  (
    <svg viewBox="0 0 200 250" className="circle-gallery-svg" key="artwork-block">
      <defs>
        <linearGradient id="g4-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff006a" />
          <stop offset="50%" stopColor="#ff4070" />
          <stop offset="100%" stopColor="#2e0854" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="#1f074d" />
      <path d="M0,0 L200,0 L200,120 L130,120 L130,190 L0,190 Z" fill="#ff0077" opacity="0.9" />
      <path d="M125,115 L140,115 L140,150 L125,150 Z" fill="#ffcc00" opacity="0.8" />
    </svg>
  ),
  (
    <svg viewBox="0 0 200 250" className="circle-gallery-svg" key="artwork-split">
      <defs>
        <linearGradient id="g5-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff1a75" />
          <stop offset="100%" stopColor="#e6005c" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="#300a52" />
      <path d="M-20,100 L220,160 L220,270 L-20,270 Z" fill="url(#g5-pink)" />
    </svg>
  ),
  (
    <svg viewBox="0 0 200 250" className="circle-gallery-svg" key="artwork-dome">
      <defs>
        <linearGradient id="g6-sun" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ff2a55" />
          <stop offset="100%" stopColor="#e6004c" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="#200642" />
      <path d="M-10,130 Q100,10 210,130 L210,260 L-10,260 Z" fill="url(#g6-sun)" />
    </svg>
  ),
  (
    <svg viewBox="0 0 200 250" className="circle-gallery-svg" key="artwork-gold">
      <defs>
        <linearGradient id="g7-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2277" />
          <stop offset="50%" stopColor="#ff9900" />
          <stop offset="100%" stopColor="#ffcc00" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="#38094a" />
      <path
        d="M-20,110 C80,90 80,210 220,160 L220,260 L-20,260 Z"
        fill="url(#g7-gold)"
      />
    </svg>
  ),
  (
    <svg viewBox="0 0 200 250" className="circle-gallery-svg" key="artwork-shadow">
      <defs>
        <linearGradient id="g8-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff5500" />
          <stop offset="60%" stopColor="#ff0033" />
          <stop offset="100%" stopColor="#990022" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="#140224" />
      <path d="M-20,60 L220,150 L220,270 L-20,270 Z" fill="url(#g8-red)" />
      <path d="M-20,140 L220,210 L220,270 L-20,270 Z" fill="#0d0117" opacity="0.8" />
    </svg>
  ),
];

export default function CircleGallery({
  items,
  images,
  itemWidth = 200,
  itemHeight = 250,
  radiusPercent = 22,
  borderRadius = 16,
  itemScale = 0.82,
  autoSpinSpeed = 5, // deg/s
  throwResistance = 0.35,
  enableDrag = true,
  customArtworks,
}) {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Normalize inputs: supports string image URLs, objects with { image/url, alt }, JSX elements, or fallback SVG cards
  const cardList = items || images || customArtworks || CARD_ARTWORKS;
  const count = cardList.length;

  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const startPosRef = useRef({ x: 0, y: 0 });
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef(null);

  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [galleryBounds, setGalleryBounds] = useState({
    width: typeof window === "undefined" ? 1200 : window.innerWidth,
    height: typeof window === "undefined" ? 800 : window.innerHeight,
  });

  useEffect(() => {
    const updateBounds = () => {
      setGalleryBounds({
        width: containerRef.current?.clientWidth ?? window.innerWidth,
        height: containerRef.current?.clientHeight ?? window.innerHeight,
      });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds, { passive: true });
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  // Center coordinates calculation helper
  const getAngleFromCenter = useCallback((clientX, clientY) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);

  // Main animation frame physics loop
  useEffect(() => {
    let prevTimestamp = performance.now();

    const loop = (timestamp) => {
      const dt = Math.min((timestamp - prevTimestamp) / 1000, 0.1);
      prevTimestamp = timestamp;

      // Only auto-spin or apply inertia when NOT actively holding a zoomed card
      if (!isDraggingRef.current && selectedIndex === null) {
        if (Math.abs(velocityRef.current) > 0.05) {
          rotationRef.current += velocityRef.current * dt;
          const frictionFactor = Math.max(0, 1 - throwResistance * 3 * dt);
          velocityRef.current *= frictionFactor;
        } else {
          velocityRef.current = 0;
          if (autoSpinSpeed !== 0) {
            rotationRef.current += autoSpinSpeed * dt;
          }
        }
      }

      setRotation(rotationRef.current);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [autoSpinSpeed, throwResistance, selectedIndex]);

  // Pointer drag start
  const handlePointerDown = (e) => {
    if (!enableDrag) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    startPosRef.current = { x: clientX, y: clientY };
    lastAngleRef.current = getAngleFromCenter(clientX, clientY);
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  // Pointer drag move
  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !enableDrag) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);

    // Track total drag travel to distinguish click from drag
    const moveX = clientX - startPosRef.current.x;
    const moveY = clientY - startPosRef.current.y;
    dragDistanceRef.current = Math.hypot(moveX, moveY);

    // Unselect if dragged while zoomed
    if (dragDistanceRef.current > 8 && selectedIndex !== null) {
      setSelectedIndex(null);
    }

    const currentAngle = getAngleFromCenter(clientX, clientY);
    const now = performance.now();
    const dt = Math.max((now - lastTimeRef.current) / 1000, 0.001);

    let delta = currentAngle - lastAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    rotationRef.current += delta;
    velocityRef.current = delta / dt;

    lastAngleRef.current = currentAngle;
    lastTimeRef.current = now;
  };

  // Drag release
  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const onGlobalUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener("mouseup", onGlobalUp);
    window.addEventListener("touchend", onGlobalUp);
    return () => {
      window.removeEventListener("mouseup", onGlobalUp);
      window.removeEventListener("touchend", onGlobalUp);
    };
  }, []);

  const handleCardClick = (e, i) => {
    e.stopPropagation();
    // Only toggle if this was a clean click without significant drag
    if (dragDistanceRef.current < 6) {
      setSelectedIndex((prev) => (prev === i ? null : i));
    }
  };

  const handleBackgroundClick = () => {
    if (dragDistanceRef.current < 6) {
      setSelectedIndex(null);
    }
  };

  const responsiveScale = Math.max(0.62, Math.min(1, galleryBounds.width / 720));
  const responsiveItemWidth = itemWidth * responsiveScale;
  const responsiveItemHeight = itemHeight * responsiveScale;
  const baseRadius = Math.round(
    Math.min(galleryBounds.width * 0.34, galleryBounds.height * 0.33, 235) * (radiusPercent / 25),
  );
  const angleStep = 360 / count;

  return (
    <div
      ref={containerRef}
      className="circle-gallery-root"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      onClick={handleBackgroundClick}
      role="region"
      aria-label="Circle Gallery"
    >
      <div
        className="circle-gallery-wheel"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {cardList.map((item, i) => {
          const itemAngle = i * angleStep;
          const rad = (itemAngle * Math.PI) / 180;
          const isSelected = selectedIndex === i;
          const isDimmed = selectedIndex !== null && !isSelected;

          // When selected, bring to exact center (0,0) with high scale and light silver rounded border
          const x = isSelected ? 0 : Math.cos(rad) * baseRadius;
          const y = isSelected ? 0 : Math.sin(rad) * baseRadius;
          const scale = isSelected ? 1.35 : itemScale;

          // Compute absolute visual angle considering wheel rotation
          const currentVisualAngle = (itemAngle + rotation) % 360;
          const visualRad = (currentVisualAngle * Math.PI) / 180;
          const depthZ = Math.round((Math.sin(visualRad) + 1) * 50);

          // Extract image source and details
          const isObject = item && typeof item === "object";
          const imgSrc = typeof item === "string" ? item : (item?.src || item?.url || item?.image);
          const title = isObject ? (item.title || item.name) : null;
          const location = isObject ? item.location : null;
          const description = isObject ? item.description : null;

          return (
            <div
              key={i}
              className={`circle-gallery-item ${isSelected ? "is-selected" : ""} ${isDimmed ? "is-dimmed" : ""}`}
              style={{
                width: `${responsiveItemWidth}px`,
                height: `${responsiveItemHeight}px`,
                borderRadius: `${borderRadius}px`,
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${-rotation}deg) scale(${scale})`,
                zIndex: isSelected ? 1000 : depthZ,
              }}
              onClick={(e) => handleCardClick(e, i)}
            >
              {imgSrc ? (
                <>
                  <img
                    src={imgSrc}
                    alt={title || `Travel scenery ${i + 1}`}
                    className="circle-gallery-img"
                    draggable={false}
                  />

                  {/* Clean, elegant Name and Location label */}
                  {title && !isSelected && (
                    <div className="circle-gallery-card-badge">
                      <span className="badge-title">{title}</span>
                      {location && <span className="badge-loc">{location}</span>}
                    </div>
                  )}

                  {/* Rich focused overlay with working action buttons */}
                  {isSelected && (
                    <div className="circle-gallery-selected-overlay">
                      <span className="selected-tag">FEATURED DESTINATION</span>
                      <h4 className="selected-title">{title}</h4>
                      {location && <p className="selected-location">{location}</p>}
                      {description && <p className="selected-desc">{description}</p>}
                      <div className="selected-cta-btns">
                        <button
                          type="button"
                          className="selected-btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/itinerary');
                          }}
                        >
                          Plan Itinerary
                        </button>
                        <button
                          type="button"
                          className="selected-btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/services');
                          }}
                        >
                          View Services
                        </button>
                      </div>
                      <span className="selected-tap-hint">Click background to dismiss</span>
                    </div>
                  )}
                </>
              ) : (
                item
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
