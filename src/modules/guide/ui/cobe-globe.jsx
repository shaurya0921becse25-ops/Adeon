import React, { useEffect, useRef, useCallback, useState } from "react";

// Pre-generate Fibonacci sphere points for smooth 3D globe surface
const FIBONACCI_DOTS_COUNT = 900;
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const BASE_DOTS = [];
for (let i = 0; i < FIBONACCI_DOTS_COUNT; i++) {
  const theta = (2 * Math.PI * i) / GOLDEN_RATIO;
  const phi = Math.acos(1 - (2 * (i + 0.5)) / FIBONACCI_DOTS_COUNT);
  BASE_DOTS.push({
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  });
}

function latLonToVector(lat, lon) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return {
    x: -Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  };
}

export function Globe({
  markers = [],
  arcs = [],
  className = "",
  markerColor = [0.85, 0.36, 0.12], // Warm terracotta amber
  baseColor = [0.98, 0.96, 0.93],
  arcColor = [0.85, 0.45, 0.15],
  speed = 0.003,
  theta: initialTheta = 0.2,
}) {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const lastPointer = useRef(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const velocity = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const [activeMarkers, setActiveMarkers] = useState([]);

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (pointerInteracting.current !== null) {
      const deltaX = e.clientX - pointerInteracting.current.x;
      const deltaY = e.clientY - pointerInteracting.current.y;
      dragOffset.current = { phi: deltaX / 260, theta: deltaY / 800 };
      const now = Date.now();
      if (lastPointer.current) {
        const dt = Math.max(now - lastPointer.current.t, 1);
        const maxVelocity = 0.12;
        velocity.current = {
          phi: Math.max(
            -maxVelocity,
            Math.min(maxVelocity, ((e.clientX - lastPointer.current.x) / dt) * 0.25)
          ),
          theta: Math.max(
            -maxVelocity,
            Math.min(maxVelocity, ((e.clientY - lastPointer.current.y) / dt) * 0.08)
          ),
        };
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now };
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
      lastPointer.current = null;
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

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
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let phi = 0;
    let pulseTime = 0;

    const mR = Math.round(markerColor[0] * 255);
    const mG = Math.round(markerColor[1] * 255);
    const mB = Math.round(markerColor[2] * 255);

    const aR = Math.round(arcColor[0] * 255);
    const aG = Math.round(arcColor[1] * 255);
    const aB = Math.round(arcColor[2] * 255);

    function render() {
      const width = canvas.clientWidth || 380;
      const height = canvas.clientHeight || 380;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.42;

      // Update rotation
      if (!isPausedRef.current) {
        phi += speed;
        if (
          Math.abs(velocity.current.phi) > 0.0001 ||
          Math.abs(velocity.current.theta) > 0.0001
        ) {
          phiOffsetRef.current += velocity.current.phi;
          thetaOffsetRef.current += velocity.current.theta;
          velocity.current.phi *= 0.95;
          velocity.current.theta *= 0.95;
        }
      }
      pulseTime += 0.04;

      const currentPhi = phi + phiOffsetRef.current + dragOffset.current.phi;
      const currentTheta =
        initialTheta + thetaOffsetRef.current + dragOffset.current.theta;

      const cosPhi = Math.cos(currentPhi);
      const sinPhi = Math.sin(currentPhi);
      const cosTheta = Math.cos(currentTheta);
      const sinTheta = Math.sin(currentTheta);

      function project(x, y, z) {
        // Rotate around Y axis (phi)
        const x1 = x * cosPhi + z * sinPhi;
        const z1 = -x * sinPhi + z * cosPhi;
        // Rotate around X axis (theta)
        const y2 = y * cosTheta - z1 * sinTheta;
        const z2 = y * sinTheta + z1 * cosTheta;
        return { x: cx + x1 * R, y: cy - y2 * R, z: z2 };
      }

      // 1. Globe Ambient Shadow & Glow
      const bgGlow = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.15);
      bgGlow.addColorStop(0, "rgba(255, 247, 237, 0.95)");
      bgGlow.addColorStop(0.7, "rgba(254, 215, 170, 0.45)");
      bgGlow.addColorStop(1, "rgba(254, 215, 170, 0)");
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Globe Base Circle
      const baseGrad = ctx.createRadialGradient(
        cx - R * 0.25,
        cy - R * 0.3,
        R * 0.1,
        cx,
        cy,
        R
      );
      baseGrad.addColorStop(0, "#ffffff");
      baseGrad.addColorStop(0.7, "#fff7ed");
      baseGrad.addColorStop(1, "#fed7aa");
      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Globe Border
      ctx.strokeStyle = "rgba(249, 115, 22, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 2. Render Surface Dots
      for (let i = 0; i < BASE_DOTS.length; i++) {
        const dot = BASE_DOTS[i];
        const p = project(dot.x, dot.y, dot.z);
        if (p.z > 0) {
          const alpha = Math.max(0.1, Math.min(0.75, p.z));
          const r = Math.max(1, p.z * 1.85);
          ctx.fillStyle = `rgba(180, 83, 9, ${alpha * 0.45})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Render Flight Arcs
      arcs.forEach((arc) => {
        if (!arc.from || !arc.to) return;
        const v1 = latLonToVector(arc.from[0], arc.from[1]);
        const v2 = latLonToVector(arc.to[0], arc.to[1]);

        ctx.beginPath();
        let started = false;
        const STEPS = 25;
        for (let s = 0; s <= STEPS; s++) {
          const t = s / STEPS;
          // Great-circle slerp interpolation
          const ix = v1.x * (1 - t) + v2.x * t;
          const iy = v1.y * (1 - t) + v2.y * t;
          const iz = v1.z * (1 - t) + v2.z * t;
          const len = Math.sqrt(ix * ix + iy * iy + iz * iz) || 1;
          const arcLift = 1 + Math.sin(t * Math.PI) * 0.22;
          const px = (ix / len) * arcLift;
          const py = (iy / len) * arcLift;
          const pz = (iz / len) * arcLift;

          const p = project(px, py, pz);
          if (p.z > -0.05) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          }
        }
        if (started) {
          ctx.strokeStyle = `rgba(${aR}, ${aG}, ${aB}, 0.7)`;
          ctx.lineWidth = 1.8;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // 4. Render Markers & Pulse Rings
      const visibleMarkers = [];
      markers.forEach((m) => {
        if (!m.location) return;
        const v = latLonToVector(m.location[0], m.location[1]);
        const p = project(v.x, v.y, v.z);
        if (p.z > 0.05) {
          // Pulse halo
          const pulseR = 5 + Math.sin(pulseTime) * 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${mR}, ${mG}, ${mB}, ${Math.max(0, 0.7 - pulseR / 12)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Dot center
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${mR}, ${mG}, ${mB})`;
          ctx.fill();

          visibleMarkers.push({
            id: m.id,
            label: m.label,
            x: p.x,
            y: p.y,
            z: p.z,
          });
        }
      });

      setActiveMarkers(visibleMarkers);
      ctx.restore();
      animationId = requestAnimationFrame(render);
    }

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [markers, arcs, markerColor, arcColor, baseColor, speed, initialTheta]);

  return (
    <div
      className={`cobe-globe-container ${className}`}
      style={{
        position: "relative",
        aspectRatio: "1/1",
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
          borderRadius: "50%",
          touchAction: "none",
          display: "block",
        }}
      />

      {/* Floating Marker Tooltips */}
      {activeMarkers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            left: `${m.x}px`,
            top: `${m.y - 12}px`,
            transform: "translate(-50%, -100%)",
            padding: "2px 8px",
            background: "#1c1917",
            color: "#ffffff",
            fontFamily: "monospace",
            fontSize: "0.68rem",
            fontWeight: "600",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            zIndex: 5,
            opacity: Math.min(1, Math.max(0, (m.z - 0.1) * 2.5)),
            transition: "opacity 0.2s ease",
          }}
        >
          {m.label}
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              border: "4px solid transparent",
              borderTopColor: "#1c1917",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default Globe;
