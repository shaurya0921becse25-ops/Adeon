/**
 * AbeonHero — Cinematic Canvas 2D hero
 * Centered procedural flowering tree, blooming blossoms, falling petals,
 * glowing lantern motes, and atmospheric dusk backdrop.
 */
import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { createNoise2D } from 'simplex-noise';
import { ArrowRight, Sparkles } from 'lucide-react';
import './AbeonHero.css';

/* ─── palette ─────────────────────────────────────────────────────────────── */
const C = {
  groundTop: '#140E0C',
  groundBot: '#261C16',
  trunk: '#E0C7B2',
  trunkShade: '#8A6D5C',
  aegean: '#91B8C7',
  mist: '#D9E7EB',
  limestone: '#D8BDA6',
  porcelain: '#FAF7F0',
  blush: '#FBE2DE',
  blushTip: '#F5BDB5',
  goldCenter: '#F4CE75',
  grass: '#3F6E80',
  glow: 'rgba(145,184,199,0.22)',
  lantern: 'rgba(250,247,240,0.85)',
};

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const noise2D = createNoise2D();

/**
 * Draws a delicate 5-petal blooming blossom with glowing golden core
 */
function drawFlower(ctx, cx, cy, radius, rotation, alpha = 0.95, variant = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  const fills = [
    { fill: '#FCECE9', tip: '#F7C6BF' }, // Cherry blossom
    { fill: '#FAF7F0', tip: '#E8DCCF' }, // Porcelain ivory
    { fill: '#E5F2F7', tip: '#B0D5E2' }, // Soft Aegean mist
  ];
  const { fill, tip } = fills[variant % 3];

  for (let p = 0; p < 5; p++) {
    const angle = (p * Math.PI * 2) / 5;
    ctx.save();
    ctx.rotate(angle);

    const grad = ctx.createRadialGradient(0, radius * 0.45, 0, 0, radius * 0.45, radius);
    grad.addColorStop(0, fill);
    grad.addColorStop(1, tip);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, radius * 0.58, radius * 0.36, radius * 0.58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Golden stamen center
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.26, 0, Math.PI * 2);
  ctx.fillStyle = C.goldCenter;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = '#BA793B';
  ctx.fill();

  ctx.restore();
}

/**
 * Draws a soft organic leaf bud
 */
function drawLeafBud(ctx, x, y, angle, length, color = '#A3CCD8') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.85;

  ctx.beginPath();
  ctx.ellipse(0, length * 0.5, length * 0.28, length * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Organic branch drawing with flower buds at terminal ends
 */
function drawBranch(ctx, x, y, angle, len, depth, growProgress, t, noise2D) {
  if (depth === 0 || len < 4) return;
  const sway = noise2D(x * 0.003, t * 0.25) * 0.14;
  const nx = x + Math.cos(angle + sway) * len;
  const ny = y + Math.sin(angle + sway) * len;

  const progress = Math.min(1, growProgress * 1.5 - depth * 0.08);
  if (progress <= 0) return;
  const ex = lerp(x, nx, progress);
  const ey = lerp(y, ny, progress);

  const thick = Math.max(0.7, (depth / 7) * 4.6);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(ex, ey);
  ctx.strokeStyle = depth > 4 ? C.trunk : depth > 2 ? '#D8BDA6' : C.mist;
  ctx.lineWidth = thick;
  ctx.lineCap = 'round';
  ctx.stroke();

  // If this is a terminal branch and grown, blossom!
  if (progress >= 0.82) {
    if (depth <= 2) {
      const flowerAlpha = Math.min(1, (progress - 0.7) / 0.25);
      const pulse = 1 + Math.sin(t * 1.5 + ex * 0.05) * 0.06;
      drawFlower(ctx, ex, ey, 7.5 * pulse, (ex + ey) * 0.1 + t * 0.08, flowerAlpha, depth);
    } else {
      // Leaf buds on mid branches
      if (depth === 3 && Math.random() < 0.25) {
        drawLeafBud(ctx, ex, ey, angle + 0.4, 5.5, '#91B8C7');
      }
    }

    const spread = 0.26 + depth * 0.035;
    drawBranch(ctx, ex, ey, angle - spread, len * 0.72, depth - 1, growProgress, t, noise2D);
    drawBranch(ctx, ex, ey, angle + spread, len * 0.68, depth - 1, growProgress, t, noise2D);
    if (depth > 3) {
      drawBranch(ctx, ex, ey, angle - 0.04, len * 0.52, depth - 2, growProgress, t, noise2D);
    }
  }
}

/* ─── canopy particles / glowing fireflies ────────────────────────────────── */
function makeParticles(count, W, H) {
  return Array.from({ length: count }, () => {
    const pct = Math.random();
    let col;
    if (pct < 0.45) col = '#F4CE75'; // Golden glow
    else if (pct < 0.75) col = C.aegean;
    else if (pct < 0.90) col = C.blush;
    else col = C.porcelain;
    return {
      x: rand(W * 0.35, W * 0.88),
      y: rand(H * 0.06, H * 0.72),
      r: rand(1.4, 4.2),
      col,
      phase: rand(0, Math.PI * 2),
      speed: rand(0.3, 0.9),
      born: rand(0, 0.8),
    };
  });
}

/* ─── falling petals ──────────────────────────────────────────────────────── */
function makeFallingPetals(count, W, H) {
  return Array.from({ length: count }, (_, i) => ({
    x: rand(W * 0.35, W * 0.85),
    y: rand(0, H),
    speed: rand(18, 36),
    size: rand(3.5, 6.5),
    swayFreq: rand(0.6, 1.2),
    swayAmp: rand(12, 26),
    rotSpeed: rand(0.6, 1.4),
    variant: i % 3,
  }));
}

/* ─── grass tufts ─────────────────────────────────────────────────────────── */
function makeGrass(count, W, H) {
  return Array.from({ length: count }, () => ({
    x: rand(W * 0.25, W * 0.95),
    y: H + rand(-6, 2),
    blades: Math.floor(rand(3, 7)),
    h: rand(12, 26),
    col: C.grass,
  }));
}

/* ─── lantern glints ─────────────────────────────────────────────────────── */
function makeLanterns(count, W, H) {
  return Array.from({ length: count }, () => ({
    x: rand(W * 0.36, W * 0.86),
    y: rand(H * 0.65, H * 0.95),
    r: rand(2.8, 5.5),
    phase: rand(0, Math.PI * 2),
  }));
}

/* ─── component ─────────────────────────────────────────────────────────── */
export default function AbeonHero() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef(null);
  const overlayRef = useRef(null);
  const copyRef = useRef(null);
  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── build scene ── */
  const initScene = useCallback((canvas) => {
    const W = canvas.width;
    const H = canvas.height;
    stateRef.current = {
      particles: makeParticles(180, W, H),
      fallingPetals: makeFallingPetals(22, W, H),
      grass: makeGrass(75, W, H),
      lanterns: makeLanterns(10, W, H),
      W, H,
      t: 0,
      growProgress: reduced ? 1 : 0,
    };
  }, [reduced]);

  /* ── draw frame ── */
  const draw = useCallback((canvas, ctx, t) => {
    const s = stateRef.current;
    if (!s) return;
    const { W, H, particles, fallingPetals, grass, lanterns, growProgress } = s;

    /* background gradient */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, C.groundTop);
    bg.addColorStop(0.6, '#221813');
    bg.addColorStop(1, C.groundBot);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Atmospheric sky radiance centered behind the tree */
    const treeCenterX = W * 0.58;
    const gg = ctx.createRadialGradient(treeCenterX, H * 0.52, 0, treeCenterX, H * 0.52, W * 0.48);
    gg.addColorStop(0, 'rgba(63, 110, 128, 0.28)');
    gg.addColorStop(0.5, 'rgba(145, 184, 199, 0.12)');
    gg.addColorStop(1, 'transparent');
    ctx.fillStyle = gg;
    ctx.fillRect(0, 0, W, H);

    /* lanterns / fireflies */
    lanterns.forEach((ln) => {
      const pulse = 0.45 + 0.55 * Math.sin(t * 1.1 + ln.phase);
      const lg = ctx.createRadialGradient(ln.x, ln.y, 0, ln.x, ln.y, ln.r * 4.5);
      lg.addColorStop(0, `rgba(244, 206, 117, ${0.65 * pulse})`);
      lg.addColorStop(0.4, `rgba(250, 247, 240, ${0.35 * pulse})`);
      lg.addColorStop(1, 'transparent');
      ctx.fillStyle = lg;
      ctx.fillRect(ln.x - ln.r * 5, ln.y - ln.r * 5, ln.r * 10, ln.r * 10);
    });

    /* grass tufts along base */
    grass.forEach((g) => {
      for (let b = 0; b < g.blades; b++) {
        const bx = g.x + (b - g.blades / 2) * 3.5;
        const sway = Math.sin(t * 1.1 + g.x * 0.03 + b) * 3;
        ctx.beginPath();
        ctx.moveTo(bx, g.y);
        ctx.quadraticCurveTo(bx + sway, g.y - g.h * 0.6, bx + sway * 1.4, g.y - g.h);
        ctx.strokeStyle = `rgba(63, 110, 128, ${0.5 + 0.3 * (b / g.blades)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    });

    /* tree — centered beautifully at ~58% width */
    const rootX = W * 0.58;
    const rootY = H + 4;
    ctx.save();
    drawBranch(ctx, rootX, rootY, -Math.PI / 2, H * 0.46, 7, growProgress, t, noise2D);
    ctx.restore();

    /* canopy firefly particles — floating motes of golden light */
    if (growProgress > 0.25) {
      const pAlpha = Math.min(1, (growProgress - 0.25) / 0.4);
      particles.forEach((p) => {
        if (growProgress < p.born + 0.2) return;
        const drift = Math.sin(t * p.speed + p.phase) * 2.5;
        const bob = Math.cos(t * p.speed * 0.8 + p.phase) * 1.8;
        const alpha = pAlpha * (0.45 + 0.45 * Math.sin(t * 0.9 + p.phase));
        ctx.beginPath();
        ctx.arc(p.x + drift, p.y + bob, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    /* Falling blossom petals drifting in the dusk breeze */
    if (growProgress > 0.5) {
      const petalFills = ['#FBE2DE', '#FAF7F0', '#B9DCE7'];
      fallingPetals.forEach((p, idx) => {
        const currY = (p.y + t * p.speed) % (H + 20);
        const sway = Math.sin(t * p.swayFreq + idx) * p.swayAmp;
        const currX = p.x + sway;
        const rot = t * p.rotSpeed + idx;
        const flip = Math.cos(t * 1.4 + idx);

        ctx.save();
        ctx.translate(currX, currY);
        ctx.rotate(rot);
        ctx.scale(1, flip);

        ctx.fillStyle = petalFills[p.variant];
        ctx.globalAlpha = 0.55 + 0.3 * Math.abs(flip);

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    /* subtle porcelain starlight sparkles */
    if (Math.random() < 0.02 && growProgress > 0.7) {
      const sx = rand(W * 0.32, W * 0.90);
      const sy = rand(H * 0.08, H * 0.65);
      ctx.beginPath();
      ctx.arc(sx, sy, rand(0.8, 2.2), 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = rand(0.5, 0.95);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }, []);

  /* ── resize ── */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = Math.min(canvas.parentElement?.clientWidth || 1440, 1440);
    const H = Math.min(window.innerHeight, 840);
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    initScene(canvas);
  }, [initScene]);

  /* ── animation loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    resize();
    window.addEventListener('resize', resize);
    const ctx = canvas.getContext('2d');
    let start = null;

    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      if (stateRef.current) {
        stateRef.current.t = elapsed;
        if (!reduced) {
          stateRef.current.growProgress = Math.min(1, elapsed / 2.6);
        }
        draw(canvas, ctx, elapsed);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [resize, draw, reduced]);

  /* ── copy entrance ── */
  useEffect(() => {
    if (reduced || !copyRef.current) return;
    gsap.fromTo(
      copyRef.current.querySelectorAll('.abh-animate'),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out', delay: 0.5 }
    );
  }, [reduced]);

  return (
    <section className="abeon-hero" aria-label="ABEON — feasibility-first travel planning">
      {/* Background landscape texture */}
      <div 
        className="abeon-hero__backdrop" 
        style={{ backgroundImage: "url('/images/hero-shimla-train.jpg')" }} 
        aria-hidden="true" 
      />

      {/* Cinematic canvas with centered flowering tree */}
      <canvas ref={canvasRef} className="abeon-hero__canvas" aria-hidden="true" />

      {/* Gradient overlay — ensures copy stays crisp and legible */}
      <div ref={overlayRef} className="abeon-hero__overlay" aria-hidden="true" />

      {/* Left copy column */}
      <div className="abeon-hero__copy" ref={copyRef}>
        <p className="abeon-hero__eyebrow abh-animate">
          <span className="abeon-hero__rule" aria-hidden="true" />
          feasibility-first travel planning
        </p>
        <h1 className="abeon-hero__title abh-animate">
          plan trips that actually work.
        </h1>
        <p className="abeon-hero__sub abh-animate">
          Sample itineraries, honest budgets, and local guide services — 
          all clearly labelled as demo data.
        </p>
        <div className="abeon-hero__actions abh-animate">
          <button
            id="hero-cta-plan"
            className="abeon-hero__btn abeon-hero__btn--primary"
            onClick={() => navigate('/itinerary')}
            type="button"
          >
            Plan my trip <ArrowRight size={16} strokeWidth={2} />
          </button>
          <button
            id="hero-cta-match"
            className="abeon-hero__btn abeon-hero__btn--ghost"
            onClick={() => navigate('/trip-match')}
            type="button"
          >
            <Sparkles size={15} strokeWidth={2} /> Take Trip Match
          </button>
        </div>

        <div className="abeon-hero__stats abh-animate" aria-label="Quick stats">
          <div className="abeon-hero__stat">
            <span className="abeon-hero__stat-num">12</span>
            <span className="abeon-hero__stat-lbl">destinations</span>
          </div>
          <span className="abeon-hero__stat-sep" aria-hidden="true" />
          <div className="abeon-hero__stat">
            <span className="abeon-hero__stat-num">36+</span>
            <span className="abeon-hero__stat-lbl">guide services</span>
          </div>
          <span className="abeon-hero__stat-sep" aria-hidden="true" />
          <div className="abeon-hero__stat">
            <span className="abeon-hero__stat-num">100%</span>
            <span className="abeon-hero__stat-lbl">demo data</span>
          </div>
        </div>
      </div>
    </section>
  );
}
