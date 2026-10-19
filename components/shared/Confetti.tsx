'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface ConfettiProps {
  burst?: 'standard' | 'large';
}

interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
}

const COLORS = ['#FACC15', '#8B5CF6', '#06D6A0', '#F472B6', '#FFFFFF'];

export function Confetti({ burst = 'standard' }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasStartedRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || hasStartedRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let frameId = 0;
    let startTimeout = 0;
    const canvasElement = canvas;
    const context2d = context;
    const cleanup = () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(startTimeout);
    };

    startTimeout = window.setTimeout(() => {
      if (hasStartedRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      hasStartedRef.current = true;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvasElement.width = width * pixelRatio;
      canvasElement.height = height * pixelRatio;
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      context2d.scale(pixelRatio, pixelRatio);

      const count = burst === 'large' ? 180 : 120;
      const particles: Particle[] = Array.from({ length: count }, (_, index) => {
        const spread = (Math.random() - 0.5) * 8;
        return {
          x: width / 2 + spread * 3,
          y: -12,
          velocityX: spread,
          velocityY: 2 + Math.random() * 3,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.18,
          width: 4 + Math.random() * 5,
          height: 6 + Math.random() * 7,
          color: COLORS[index % COLORS.length],
        };
      });
      const startedAt = performance.now();
      const duration = 3000;

      const drawFrame = (now: number) => {
        const elapsed = now - startedAt;
        context2d.clearRect(0, 0, width, height);
        const progress = Math.min(elapsed / duration, 1);

        for (const particle of particles) {
          const x = particle.x + particle.velocityX * (elapsed / 16);
          const y =
            particle.y +
            particle.velocityY * (elapsed / 16) +
            0.5 * 0.12 * (elapsed / 16) ** 2;
          if (y > height + 20) continue;

          context2d.save();
          context2d.globalAlpha = Math.min(1, (1 - progress) * 1.5);
          context2d.translate(x, y);
          context2d.rotate(particle.rotation + particle.rotationSpeed * (elapsed / 16));
          context2d.fillStyle = particle.color;
          context2d.fillRect(
            -particle.width / 2,
            -particle.height / 2,
            particle.width,
            particle.height
          );
          context2d.restore();
        }

        if (elapsed < duration) {
          frameId = window.requestAnimationFrame(drawFrame);
        } else {
          canvasElement.remove();
          cleanup();
        }
      };

      frameId = window.requestAnimationFrame(drawFrame);
    }, 0);

    return cleanup;
  }, [burst, prefersReducedMotion]);

  if (prefersReducedMotion) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] h-full w-full"
    />
  );
}
