import { useEffect, useRef } from 'react';

/**
 * Terminal Grid Background Component
 * Inspired by konekt.market's futuristic grid aesthetic with purple theme
 * Features: Grid lines, glowing effects, circuit-board aesthetic
 */

const GRID_SIZE = 50; // Grid cell size in pixels
const LINE_WIDTH = 1;
const GRID_COLOR = 'rgba(206, 195, 231, 0.15)'; // Purple-500 with opacity
const GLOW_COLOR = 'rgba(139, 92, 246, 0.3)'; // Stronger purple glow
const ACCENT_GRID_COLOR = 'rgba(168, 139, 250, 0.25)'; // Purple-400 for accent lines

interface GridNode {
  x: number;
  y: number;
  glowIntensity: number;
  glowSpeed: number;
}

export default function TerminalGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GridNode[]>([]);
  const animationFrameId = useRef<number>();

  const init = (canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create grid nodes at intersections
    nodesRef.current = [];
    const cols = Math.ceil(canvas.width / GRID_SIZE);
    const rows = Math.ceil(canvas.height / GRID_SIZE);
    
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        nodesRef.current.push({
          x: i * GRID_SIZE,
          y: j * GRID_SIZE,
          glowIntensity: Math.random(),
          glowSpeed: Math.random() * 0.02 + 0.01
        });
      }
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const cols = Math.ceil(canvas.width / GRID_SIZE);
    const rows = Math.ceil(canvas.height / GRID_SIZE);

    // Draw vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = i * GRID_SIZE;
      ctx.strokeStyle = i % 5 === 0 ? ACCENT_GRID_COLOR : GRID_COLOR;
      ctx.lineWidth = LINE_WIDTH;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let j = 0; j <= rows; j++) {
      const y = j * GRID_SIZE;
      ctx.strokeStyle = j % 5 === 0 ? ACCENT_GRID_COLOR : GRID_COLOR;
      ctx.lineWidth = LINE_WIDTH;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const drawGlowNodes = (ctx: CanvasRenderingContext2D, time: number) => {
    nodesRef.current.forEach((node) => {
      // Animate glow intensity
      node.glowIntensity = (Math.sin(time * node.glowSpeed) + 1) * 0.5;

      // if (node.glowIntensity > 0.7) {
      //   const gradient = ctx.createRadialGradient(
      //     node.x, node.y, 0,
      //     node.x, node.y, 20
      //   );
      //   gradient.addColorStop(0, `rgba(139, 92, 246, ${node.glowIntensity * 0.5})`);
      //   gradient.addColorStop(1, 'transparent');
        
      //   ctx.fillStyle = gradient;
      //   ctx.beginPath();
      //   ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      //   ctx.fill();
      // }
    });
  };

  const drawCircuitAccents = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    // Draw random circuit-like accents
    const pulseAlpha = (Math.sin(time * 0.001) + 1) * 0.15;
    
    // Top-left corner accent
    ctx.strokeStyle = `rgba(139, 92, 246, ${pulseAlpha + 0.2})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(150, 100);
    ctx.lineTo(150, 0);
    ctx.stroke();

    // Top-right corner accent
    ctx.beginPath();
    ctx.moveTo(canvas.width - 150, 0);
    ctx.lineTo(canvas.width - 150, 100);
    ctx.lineTo(canvas.width, 100);
    ctx.stroke();

    // Bottom-left corner accent
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 100);
    ctx.lineTo(150, canvas.height - 100);
    ctx.lineTo(150, canvas.height);
    ctx.stroke();

    // Bottom-right corner accent
    ctx.beginPath();
    ctx.moveTo(canvas.width - 150, canvas.height);
    ctx.lineTo(canvas.width - 150, canvas.height - 100);
    ctx.lineTo(canvas.width, canvas.height - 100);
    ctx.stroke();
  };

  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas);

    // Draw glowing nodes
    drawGlowNodes(ctx, time * 0.001);

    // Draw circuit accents
    drawCircuitAccents(ctx, canvas, time);

    animationFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    init(canvas);
    animationFrameId.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (canvas) {
        init(canvas);
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
      className="terminal-grid-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: '#000000',
      }}
    />
  );
}
