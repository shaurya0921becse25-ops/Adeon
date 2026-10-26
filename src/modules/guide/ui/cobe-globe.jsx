import React, { useCallback, useEffect, useRef } from "react";
import createGlobe from "cobe";

const EMPTY_MARKERS = [];
const EMPTY_ARCS = [];

export function Globe({
  markers = EMPTY_MARKERS,
  arcs = EMPTY_ARCS,
  className = "",
  markerColor = [0.3, 0.45, 0.85],
  baseColor = [1, 1, 1],
  arcColor = [0.3, 0.45, 0.85],
  glowColor = [0.94, 0.93, 0.91],
  dark = 0,
  mapBrightness = 10,
  markerSize = 0.025,
  markerElevation = 0.01,
  arcWidth = 0.5,
  arcHeight = 0.25,
  speed = 0.003,
  theta = 0.2,
  diffuse = 1.5,
  mapSamples = 16000,
}) {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const globeRef = useRef(null);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((event) => {
    pointerInteracting.current = { x: event.clientX, y: event.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerMove = useCallback((event) => {
    if (pointerInteracting.current === null) return;

    const deltaX = event.clientX - pointerInteracting.current.x;
    const deltaY = event.clientY - pointerInteracting.current.y;
    dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 };
    globeRef.current?.update({
      phi: phiOffsetRef.current + dragOffset.current.phi,
      theta: theta + thetaOffsetRef.current + dragOffset.current.theta,
    });
  }, [theta]);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
      globeRef.current?.update({
        phi: phiOffsetRef.current,
        theta: theta + thetaOffsetRef.current,
      });
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, [theta]);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContainer = canvas?.parentElement;
    if (!canvas || !canvasContainer) return undefined;

    const globeMarkers = markers.map((marker) => ({
      location: marker.location,
      size: markerSize,
      id: marker.id,
    }));
    const globeArcs = arcs.map((arc) => ({
      from: arc.from,
      to: arc.to,
      id: arc.id,
    }));
    let globe = null;
    let previousWidth = 0;
    let initializationTimer = 0;
    let redrawTimer = 0;
    let animationId = 0;
    let phi = 0;

    const initializeGlobe = () => {
      const width = canvas.offsetWidth;
      if (width === 0 || width === previousWidth) return;

      window.clearTimeout(redrawTimer);
      window.cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
      if (canvas.parentElement !== canvasContainer) {
        const previousWrapper = canvas.parentElement;
        canvasContainer.appendChild(canvas);
        if (previousWrapper && previousWrapper.childElementCount === 0) {
          previousWrapper.remove();
        }
      }
      previousWidth = width;
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      globe = createGlobe(canvas, {
        devicePixelRatio,
        width,
        height: width,
        phi: 0,
        theta,
        dark,
        diffuse,
        mapSamples,
        mapBrightness,
        baseColor,
        markerColor,
        glowColor,
        markerElevation,
        markers: globeMarkers,
        arcs: globeArcs,
        arcColor,
        arcWidth,
        arcHeight,
        opacity: 0.7,
      });
      globeRef.current = globe;
      canvas.style.opacity = "1";

      const animate = () => {
        if (!isPausedRef.current) phi += speed;
        globe.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: theta + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = window.requestAnimationFrame(animate);
      };
      redrawTimer = window.setTimeout(animate, 300);
    };

    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(initializationTimer);
      initializationTimer = window.setTimeout(initializeGlobe, 100);
    });
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      window.clearTimeout(initializationTimer);
      window.clearTimeout(redrawTimer);
      window.cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
      globeRef.current = null;
      if (canvas.parentElement !== canvasContainer) {
        const previousWrapper = canvas.parentElement;
        canvasContainer.appendChild(canvas);
        if (previousWrapper && previousWrapper.childElementCount === 0) {
          previousWrapper.remove();
        }
      }
    };
  }, [
    markers,
    arcs,
    markerColor,
    baseColor,
    arcColor,
    glowColor,
    dark,
    mapBrightness,
    markerSize,
    markerElevation,
    arcWidth,
    arcHeight,
    speed,
    theta,
    diffuse,
    mapSamples,
  ]);

  return (
    <div
      className={`cobe-globe-container ${className}`}
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        userSelect: "none",
        width: "100%",
        maxWidth: "420px",
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
          display: "block",
        }}
      />
      {markers.map((marker) => (
        <div
          key={marker.id}
          style={{
            position: "absolute",
            positionAnchor: `--cobe-${marker.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 8,
            padding: "2px 6px",
            background: "#1a1a2e",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            opacity: `var(--cobe-visible-${marker.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${marker.id}, 0)) * 8px))`,
            transition: "opacity 0.8s, filter 0.8s",
          }}
        >
          {marker.label}
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translate3d(-50%, -1px, 0)",
              border: "5px solid transparent",
              borderTopColor: "#1a1a2e",
            }}
          />
        </div>
      ))}
      {arcs
        .filter((arc) => arc.label)
        .map((arc) => (
          <div
            key={arc.id}
            style={{
              position: "absolute",
              positionAnchor: `--cobe-arc-${arc.id}`,
              bottom: "anchor(top)",
              left: "anchor(center)",
              translate: "-50% 0",
              marginBottom: 8,
              padding: "2px 6px",
              background: "#fff",
              color: "#1a1a2e",
              fontFamily: "monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              opacity: `var(--cobe-visible-arc-${arc.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-arc-${arc.id}, 0)) * 8px))`,
              transition: "opacity 0.8s, filter 0.8s",
            }}
          >
            {arc.label}
            <span
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translate3d(-50%, -1px, 0)",
                border: "5px solid transparent",
                borderTopColor: "#fff",
              }}
            />
          </div>
        ))}
    </div>
  );
}

export default Globe;
