/**
 * TreeStory — Scroll-driven chapter story
 * Canvas 2D animated tree stays pinned on the right;
 * five chapter panels scroll in from the left.
 * GSAP ScrollTrigger pins the scene for ≈ 2500px of scroll travel.
 */
import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createNoise2D } from 'simplex-noise';
import './TreeStory.css';

gsap.registerPlugin(ScrollTrigger);

/* ─── chapter data ─────────────────────────────────────────────────────────── */
const CHAPTERS = [
  {
    id: 'time',
    num: '01',
    title: 'Time',
    label: 'opening-hours layer',
    body: 'Every stop is checked against real opening windows. The demo planner flags conflicts before you ever pack a bag.',
    stat: '38 min',
    statLabel: 'avg gap saved per day',
    color: '#91B8C7',
  },
  {
    id: 'money',
    num: '02',
    title: 'Money',
    label: 'honest budget bands',
    body: 'Budget splits across stays, food, and activities with ₹ bands clearly labelled as sample data — no hidden surprises.',
    stat: '₹2–8K',
    statLabel: 'daily range per city',
    color: '#D8BDA6',
  },
  {
    id: 'distance',
    num: '03',
    title: 'Distance',
    label: 'transit-gap checker',
    body: 'Transit gaps between every stop are surfaced so you can instantly see when a day is physically over-packed.',
    stat: '12 km',
    statLabel: 'avg inter-stop gap',
    color: '#D9E7EB',
  },
  {
    id: 'people',
    num: '04',
    title: 'People',
    label: 'community field notes',
    body: "Local guide field notes and traveller posts add on-the-ground context the algorithm alone can't know.",
    stat: '36+',
    statLabel: 'local services in demo',
    color: '#765F53',
  },
  {
    id: 'safety',
    num: '05',
    title: 'Safety',
    label: 'practical cautions',
    body: 'Emergency numbers and practical cautions per destination — honest about what is static vs. live alert data.',
    stat: '100%',
    statLabel: 'clearly labelled demo',
    color: '#3F6E80',
  },
];

/* ─── Simplex noise for organic breeze sway ──────────────────────────────── */
const noise2D = createNoise2D();

// Pre-seeded falling petal positions for consistent smooth drift
const FALLING_PETALS = Array.from({ length: 18 }, (_, i) => ({
  seedX: (i * 0.17 + 0.1) % 1,
  seedY: (i * 0.23 + 0.05) % 1,
  speed: 18 + (i % 5) * 6,
  size: 4 + (i % 4) * 1.8,
  swayFreq: 0.8 + (i % 3) * 0.4,
  swayAmp: 14 + (i % 4) * 5,
  rotSpeed: 0.8 + (i % 3) * 0.5,
  colorType: i % 3, // 0 = blush pink, 1 = ivory porcelain, 2 = soft aegean
}));

/**
 * Draws a 5-petal blooming blossom with glowing golden pistil
 */
function drawBlossom(ctx, cx, cy, radius, rotation, alpha = 0.95, colorVariant = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  const petalColors = [
    { fill: '#FCE7E4', tip: '#F5BDB5' }, // Soft cherry blossom
    { fill: '#FAF7F0', tip: '#EADECF' }, // Porcelain ivory
    { fill: '#E0F0F5', tip: '#A7CFDC' }, // Soft Aegean mist
  ];
  const { fill, tip } = petalColors[colorVariant % 3];

  for (let p = 0; p < 5; p++) {
    const angle = (p * Math.PI * 2) / 5;
    ctx.save();
    ctx.rotate(angle);

    const grad = ctx.createRadialGradient(0, radius * 0.5, 0, 0, radius * 0.5, radius);
    grad.addColorStop(0, fill);
    grad.addColorStop(1, tip);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, radius * 0.6, radius * 0.38, radius * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Golden stamen center
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = '#F3CB6C';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = '#C88C4D';
  ctx.fill();

  ctx.restore();
}

/**
 * Draws a soft organic leaf bud
 */
function drawLeafBud(ctx, x, y, angle, length, color = '#A8CFDA') {
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
 * Clean Single-Tier Sculpted Tree with Blooming Flowers & Drifting Petals
 * (Second section/tier of recursive clutter removed!)
 */
function drawTreeCanvas(canvas, t, chapterProgress) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width / window.devicePixelRatio;
  const H = canvas.height / window.devicePixelRatio;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Soft atmospheric ground glow
  const gg = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, W * 0.65);
  gg.addColorStop(0, 'rgba(63, 110, 128, 0.35)');
  gg.addColorStop(0.5, 'rgba(30, 23, 19, 0.15)');
  gg.addColorStop(1, 'transparent');
  ctx.fillStyle = gg;
  ctx.fillRect(0, 0, W, H);

  // Chapter color accent
  const chIdx = Math.min(4, Math.floor(chapterProgress * 5));
  const chapterAccents = ['#91B8C7', '#D8BDA6', '#D9E7EB', '#F4A28C', '#3F6E80'];
  const currentAccent = chapterAccents[chIdx];

  // 2. Trunk — graceful rising wood pillar
  const trunkBaseX = W * 0.5;
  const trunkBaseY = H + 4;
  const trunkSway = noise2D(0.5, t * 0.2) * 8;
  const forkX = W * 0.5 + trunkSway;
  const forkY = H * 0.48;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(trunkBaseX - 5.5, trunkBaseY);
  ctx.quadraticCurveTo(trunkBaseX - 3 + trunkSway * 0.4, H * 0.72, forkX - 3.5, forkY);
  ctx.lineTo(forkX + 3.5, forkY);
  ctx.quadraticCurveTo(trunkBaseX + 3 + trunkSway * 0.4, H * 0.72, trunkBaseX + 5.5, trunkBaseY);
  ctx.closePath();

  const trunkGrad = ctx.createLinearGradient(trunkBaseX, trunkBaseY, forkX, forkY);
  trunkGrad.addColorStop(0, '#C9A88F');
  trunkGrad.addColorStop(1, '#E2C8B4');
  ctx.fillStyle = trunkGrad;
  ctx.fill();

  // Subtle wood outline
  ctx.strokeStyle = 'rgba(216, 189, 166, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // 3. Single Primary Tier: 4 graceful sweeping main branches
  // (NO recursive second tier/fractal clutter!)
  const branches = [
    {
      startX: forkX - 2.5,
      startY: forkY,
      ctrlX: forkX - W * 0.18 + noise2D(1, t * 0.25) * 6,
      ctrlY: forkY - H * 0.12,
      endX: forkX - W * 0.32 + noise2D(1.2, t * 0.25) * 10,
      endY: forkY - H * 0.24,
      width: 3.2,
      variant: 0,
    },
    {
      startX: forkX - 1,
      startY: forkY,
      ctrlX: forkX - W * 0.08 + noise2D(2, t * 0.22) * 5,
      ctrlY: forkY - H * 0.18,
      endX: forkX - W * 0.14 + noise2D(2.2, t * 0.22) * 8,
      endY: forkY - H * 0.35,
      width: 2.8,
      variant: 1,
    },
    {
      startX: forkX + 1,
      startY: forkY,
      ctrlX: forkX + W * 0.08 + noise2D(3, t * 0.22) * 5,
      ctrlY: forkY - H * 0.19,
      endX: forkX + W * 0.15 + noise2D(3.2, t * 0.22) * 8,
      endY: forkY - H * 0.36,
      width: 2.8,
      variant: 2,
    },
    {
      startX: forkX + 2.5,
      startY: forkY,
      ctrlX: forkX + W * 0.18 + noise2D(4, t * 0.25) * 6,
      ctrlY: forkY - H * 0.13,
      endX: forkX + W * 0.32 + noise2D(4.2, t * 0.25) * 10,
      endY: forkY - H * 0.23,
      width: 3.2,
      variant: 0,
    },
  ];

  // Draw the 4 clean main branches
  branches.forEach((b) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(b.startX, b.startY);
    ctx.quadraticCurveTo(b.ctrlX, b.ctrlY, b.endX, b.endY);
    ctx.strokeStyle = '#D8BDA6';
    ctx.lineWidth = b.width;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Leaf buds along each branch curve
    const midX = 0.25 * b.startX + 0.5 * b.ctrlX + 0.25 * b.endX;
    const midY = 0.25 * b.startY + 0.5 * b.ctrlY + 0.25 * b.endY;
    drawLeafBud(ctx, midX - 3, midY, -0.6, 7, '#91B8C7');
    drawLeafBud(ctx, midX + 3, midY - 2, 0.6, 6, '#BED9CE');

    ctx.restore();
  });

  // 4. Blooming Flowers clustered around branch junctions & tips
  const blossomClusters = [
    // Tips of main branches
    { x: branches[0].endX, y: branches[0].endY, size: 13, rot: t * 0.1 + 0.2, variant: 0 },
    { x: branches[0].endX + 10, y: branches[0].endY - 6, size: 10, rot: -t * 0.12 + 0.5, variant: 1 },
    { x: branches[1].endX, y: branches[1].endY, size: 14, rot: t * 0.08 + 1.1, variant: 1 },
    { x: branches[1].endX - 8, y: branches[1].endY + 8, size: 9, rot: -t * 0.1 + 0.8, variant: 2 },
    { x: branches[2].endX, y: branches[2].endY, size: 14, rot: -t * 0.09 + 2.2, variant: 2 },
    { x: branches[2].endX + 8, y: branches[2].endY + 6, size: 10, rot: t * 0.1 + 1.7, variant: 0 },
    { x: branches[3].endX, y: branches[3].endY, size: 13, rot: t * 0.12 + 3.1, variant: 0 },
    { x: branches[3].endX - 10, y: branches[3].endY - 6, size: 9, rot: -t * 0.11 + 2.6, variant: 1 },

    // Branch mid-points
    { x: branches[0].ctrlX, y: branches[0].ctrlY, size: 11, rot: 0.4 + t * 0.05, variant: 1 },
    { x: branches[3].ctrlX, y: branches[3].ctrlY, size: 11, rot: 1.2 - t * 0.05, variant: 2 },

    // Central crown blossom cluster at trunk fork
    { x: forkX, y: forkY - 4, size: 15, rot: t * 0.06, variant: 0 },
    { x: forkX - 12, y: forkY - 14, size: 11, rot: -t * 0.08 + 1.2, variant: 1 },
    { x: forkX + 12, y: forkY - 12, size: 11, rot: t * 0.07 + 2.4, variant: 2 },
  ];

  blossomClusters.forEach((b) => {
    // Gentle pulse effect
    const pulse = 1 + Math.sin(t * 1.6 + b.size) * 0.05;
    drawBlossom(ctx, b.x, b.y, b.size * pulse, b.rot, 0.96, b.variant);
  });

  // 5. Subtle Drifting / Falling Petals & Leaves
  FALLING_PETALS.forEach((p, idx) => {
    const totalY = (p.seedY * H + t * p.speed) % (H + 30);
    const currY = totalY - 15;
    const sway = Math.sin(t * p.swayFreq + idx) * p.swayAmp;
    const currX = (p.seedX * W + sway) % W;
    const rot = t * p.rotSpeed + idx;
    const flip = Math.cos(t * 1.5 + idx);

    ctx.save();
    ctx.translate(currX, currY);
    ctx.rotate(rot);
    ctx.scale(1, flip); // Realistic 3D petal tumble

    const petalFills = ['#F8D5D0', '#FAF7F0', '#B9DCE7'];
    ctx.fillStyle = petalFills[p.colorType];
    ctx.globalAlpha = 0.55 + 0.3 * Math.abs(flip);

    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

/* ─── component ─────────────────────────────────────────────────────────── */
export default function TreeStory() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const chapterProgressRef = useRef(0);
  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = typeof window !== 'undefined'
    && window.matchMedia('(max-width: 768px)').matches;

  /* ── canvas resize ── */
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const W = c.parentElement?.clientWidth || 420;
    const H = c.parentElement?.clientHeight || 560;
    c.width = W * dpr;
    c.height = H * dpr;
    c.style.width = `${W}px`;
    c.style.height = `${H}px`;
    c.getContext('2d').scale(dpr, dpr);
  }, []);

  /* ── canvas animation loop ── */
  useEffect(() => {
    if (mobile) return;
    const c = canvasRef.current;
    if (!c) return;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      drawTreeCanvas(c, t, chapterProgressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mobile, resizeCanvas]);

  /* ── GSAP ScrollTrigger ── */
  useEffect(() => {
    if (!rootRef.current) return;
    const panels = rootRef.current.querySelectorAll('.ts-panel');
    const ctx = gsap.context(() => {
      if (!reduced && !mobile) {
        /* pin the whole section */
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: 'top top',
          end: `+=${CHAPTERS.length * 520}`,
          pin: '.ts-sticky',
          scrub: 0.7,
        });

        /* animate each chapter panel in */
        panels.forEach((panel, i) => {
          gsap.fromTo(
            panel,
            { opacity: 0, x: -40 },
            {
              opacity: 1,
              x: 0,
              scrollTrigger: {
                trigger: rootRef.current,
                start: `top+=${i * 520} top`,
                end: `top+=${i * 520 + 420} top`,
                scrub: 0.5,
                onUpdate: (self) => {
                  chapterProgressRef.current = (i + self.progress) / CHAPTERS.length;
                },
              },
            }
          );
          /* fade out when next panel enters */
          if (i < CHAPTERS.length - 1) {
            gsap.to(panel, {
              opacity: 0,
              x: -24,
              scrollTrigger: {
                trigger: rootRef.current,
                start: `top+=${(i + 0.72) * 520} top`,
                end: `top+=${(i + 1) * 520} top`,
                scrub: 0.5,
              },
            });
          }
        });

        /* progress bar */
        gsap.to('.ts-progress-fill', {
          scaleX: 1,
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: `+=${CHAPTERS.length * 520}`,
            scrub: true,
          },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [reduced, mobile]);

  return (
    <section className="tree-story" ref={rootRef} aria-label="How WanderWise planning works">
      {/* Floral decoration — subtle background accents */}
      <div className="ts-floral-layer" aria-hidden="true">
        <svg className="ts-floral ts-floral--topleft" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0,72,144,216,288].map((deg, i) => (
            <g key={i} transform={`rotate(${deg} 60 60)`}>
              <ellipse cx="60" cy="34" rx="9" ry="14" fill="#D8BDA6" opacity="0.45" />
            </g>
          ))}
          <circle cx="60" cy="60" r="7" fill="#91B8C7" opacity="0.6" />
        </svg>

        <svg className="ts-floral ts-floral--topright" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0,60,120,180,240,300].map((deg, i) => (
            <g key={i} transform={`rotate(${deg} 40 40)`}>
              <ellipse cx="40" cy="18" rx="6" ry="10" fill="#91B8C7" opacity="0.4" />
            </g>
          ))}
          <circle cx="40" cy="40" r="5" fill="#D8BDA6" opacity="0.5" />
        </svg>

        {/* Scattered background petal dots */}
        {[[18,22],[72,8],[88,45],[30,78],[92,70],[52,90],[8,58],[65,30]].map(([x,y], i) => (
          <svg key={i} className="ts-petal-dot" style={{ left: `${x}%`, top: `${y}%` }} viewBox="0 0 20 24" fill="none" width="16" height="20">
            <ellipse cx="10" cy="12" rx="6" ry="10" fill={i % 2 === 0 ? '#D8BDA6' : '#91B8C7'} opacity={0.25 + (i % 3) * 0.08} transform={`rotate(${i * 35} 10 12)`} />
          </svg>
        ))}
      </div>

      {/* Section header — sits above the pin zone */}
      <div className="container ts-header">
        <p className="ts-eyebrow">five planning layers</p>
        <h2 className="ts-title">everything a trip plan needs to actually work.</h2>
        {/* progress bar */}
        <div className="ts-progress" aria-hidden="true">
          <div className="ts-progress-fill" />
        </div>
      </div>

      {/* Sticky container — holds panels (left) + canvas (right) side by side */}
      <div className="ts-sticky">
        <div className="container ts-layout">
          {/* Left: chapter panels */}
          <div className="ts-panels-col">
            {CHAPTERS.map((ch) => (
              <article
                key={ch.id}
                className="ts-panel"
                style={{ '--ch-color': ch.color }}
                aria-label={`Chapter ${ch.num}: ${ch.title}`}
              >
                <div className="ts-panel__header">
                  <span className="ts-panel__num">{ch.num}</span>
                  <span className="ts-panel__label">{ch.label}</span>
                </div>
                <h3 className="ts-panel__title">{ch.title}</h3>
                <p className="ts-panel__body">{ch.body}</p>
                <div className="ts-panel__stat">
                  <span className="ts-panel__stat-val">{ch.stat}</span>
                  <span className="ts-panel__stat-desc">{ch.statLabel}</span>
                </div>
                <div className="ts-panel__swatch" aria-hidden="true" />
              </article>
            ))}
          </div>

          {/* Right: canvas with elegant floral corner accents */}
          <div className="ts-canvas-col">
            <svg className="ts-canvas-floral" aria-hidden="true" viewBox="0 0 420 560" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              {/* corner blossom top-right */}
              {[0,72,144,216,288].map((deg, i) => (
                <g key={`tr-${i}`} transform={`rotate(${deg} 390 30)`}>
                  <ellipse cx="390" cy="16" rx="6" ry="11" fill="#D8BDA6" opacity="0.3" />
                </g>
              ))}
              <circle cx="390" cy="30" r="4" fill="#F4CE75" opacity="0.5" />

              {/* corner blossom bottom-left */}
              {[0,72,144,216,288].map((deg, i) => (
                <g key={`bl-${i}`} transform={`rotate(${deg} 30 530)`}>
                  <ellipse cx="30" cy="516" rx="6" ry="11" fill="#91B8C7" opacity="0.3" />
                </g>
              ))}
              <circle cx="30" cy="530" r="4" fill="#D8BDA6" opacity="0.4" />
            </svg>
            <canvas ref={canvasRef} className="ts-canvas" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Mobile: static stacked layout */}
      <div className="ts-mobile-list container">
        {CHAPTERS.map((ch) => (
          <div key={ch.id} className="ts-mobile-item" style={{ '--ch-color': ch.color }}>
            <div className="ts-mobile-item__accent" />
            <div className="ts-mobile-item__body">
              <span className="ts-panel__num">{ch.num}</span>
              <h3 className="ts-panel__title">{ch.title}</h3>
              <p className="ts-panel__body">{ch.body}</p>
              <span className="ts-panel__stat-val">{ch.stat}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
