'use client';

import { useEffect, useRef } from 'react';

// --- CONFIGURATION BASED ON YOUR THEME ---
const GRID_SPACING = 30; // Pixels between squares
const JIGGLE_AMOUNT = 0.5; // How far the squares move
// Colors from your index.css
const PARTICLE_COLORS = ['hsla(260, 100%, 70%, 1)', 'hsla(300, 100%, 60%, 1)'];
const ATMOSPHERE_COLORS = [
  'hsla(260, 100%, 70%, 0.5)', // Purple
  'hsla(300, 100%, 60%, 0.4)', // Magenta
  'hsla(260, 100%, 50%, 0.5)'  // Deeper Purple
];
// --background-page from index.css
const BASE_BG_COLOR_HSL = '240, 10%, 4%'; 
// --- END CONFIGURATION ---

// For the large atmospheric glows
interface GlowParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  speedY: number;
  speedX: number;
  color: string;
}

// For the tiny grid squares
interface GridSquare {
  baseX: number; // The "home" X position
  baseY: number; // The "home" Y position
  x: number;     // The "current" X (for jiggle)
  y: number;     // The "current" Y (for jiggle)
  opacity: number;
  color: string;
  glowSpeed: number; // How fast it pulses
}

export default function AnimatedPurpleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glows = useRef<GlowParticle[]>([]);
  const squares = useRef<GridSquare[]>([]);
  const animationFrameId = useRef<number>();
  const lastTime = useRef<number>(0);

  const init = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    glows.current = [];
    squares.current = [];

    // 1. Create the large atmospheric glows
    const glowSizes = [600, 700, 500];
    const glowPositions = [
      { x: canvas.width * 0.1, y: canvas.height * 0.1 },
      { x: canvas.width * 0.9, y: canvas.height * 0.2 },
      { x: canvas.width * 0.2, y: canvas.height * 0.9 },
    ];

    for (let i = 0; i < 3; i++) {
      const baseOpacity = Math.random() * 0.1 + 0.05;
      glows.current.push({
        x: glowPositions[i].x,
        y: glowPositions[i].y,
        size: glowSizes[i],
        opacity: baseOpacity,
        baseOpacity: baseOpacity,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        color: ATMOSPHERE_COLORS[i],
      });
    }

    // 2. Create the grid of tiny squares
    for (let x = 0; x < canvas.width; x += GRID_SPACING) {
      for (let y = 0; y < canvas.height; y += GRID_SPACING) {
        squares.current.push({
          baseX: x,
          baseY: y,
          x: x,
          y: y,
          opacity: Math.random() * 0.5,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          glowSpeed: Math.random() * 0.02 + 0.005, // Random pulse speed
        });
      }
    }
  };

  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    // Use a slow fade to create motion trails
    ctx.fillStyle = `hsla(${BASE_BG_COLOR_HSL}, 0.1)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- 1. Draw the large "atmosphere" glows ---
    glows.current.forEach(p => {
      // "Glowing up and down"
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity = p.baseOpacity + (Math.sin(time * 0.0005 + p.x) * (p.baseOpacity * 0.5));
      
      // Recycle if off-screen
      if (p.x < -p.size || p.x > canvas.width + p.size) p.speedX *= -1;
      if (p.y < -p.size || p.y > canvas.height + p.size) p.speedY *= -1;

      // Draw the glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1; // Reset alpha

    // --- 2. Draw the tiny "grid" squares ---
    squares.current.forEach(s => {
      // "Glowing in and out"
      s.opacity = (Math.sin(time * 0.002 * s.glowSpeed + s.baseX) + 1) * 0.25; // Pulse from 0 to 0.5
      
      // "Jiggling" in place
      s.x = s.baseX + (Math.sin(time * 0.001 + s.baseY) * JIGGLE_AMOUNT);
      s.y = s.baseY + (Math.cos(time * 0.001 + s.baseX) * JIGGLE_AMOUNT);

      // Draw the square
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.opacity;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 5;
      ctx.fillRect(s.x, s.y, 1, 1); // Draw 1x1 pixel squares
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    
    lastTime.current = time;
    animationFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    init(canvas, ctx);
    animationFrameId.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (canvas && ctx) {
        init(canvas, ctx);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cyberpunk-grid-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: `hsl(${BASE_BG_COLOR_HSL})`, // Your --background-page
      }}
    />
  );
}