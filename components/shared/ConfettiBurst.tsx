'use client';

import { useEffect, useRef } from 'react';

interface ConfettiBurstProps {
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  opacity: number;
}

const COLORS = ['#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#fb7185'];
const DURATION_MS = 3000;
const PARTICLE_COUNT = 120;

export function ConfettiBurst({ onComplete }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      onComplete?.();
      return;
    }

    let animationFrame = 0;
    let startTime = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      return {
        x: width / 2,
        y: height * 0.36,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 3,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.24,
        size: 4 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 1,
      };
    });

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      context.clearRect(0, 0, width, height);

      const fade = Math.max(0, 1 - Math.max(0, elapsed - 1900) / 1100);
      for (const particle of particles) {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityY += 0.16;
        particle.velocityX *= 0.995;
        particle.rotation += particle.rotationSpeed;
        particle.opacity = fade;

        context.save();
        context.globalAlpha = particle.opacity;
        context.fillStyle = particle.color;
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.65);
        context.restore();
      }

      if (elapsed < DURATION_MS) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        canvas.remove();
        onComplete?.();
      }
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
      canvas.remove();
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
}
