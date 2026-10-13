'use client';

import { useEffect, useRef, useState } from 'react';

interface UseAnimatedNumberOptions {
  duration?: number;
  reducedMotion: boolean;
}

export function useAnimatedNumber(
  value: number,
  { duration = 500, reducedMotion }: UseAnimatedNumberOptions
) {
  const [displayedValue, setDisplayedValue] = useState(0);
  const previousValue = useRef(0);
  const wasReducedMotion = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      previousValue.current = value;
      wasReducedMotion.current = true;
      return;
    }

    if (wasReducedMotion.current) {
      wasReducedMotion.current = false;
      previousValue.current = value;
      const frame = window.requestAnimationFrame(() => setDisplayedValue(value));
      return () => window.cancelAnimationFrame(frame);
    }

    const startValue = previousValue.current;
    if (startValue === value) return;

    let frame = 0;
    let startTime: number | undefined;
    const update = (time: number) => {
      if (startTime === undefined) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextValue = Math.round(startValue + (value - startValue) * easedProgress);
      setDisplayedValue(nextValue);

      if (progress < 1) {
        frame = window.requestAnimationFrame(update);
      } else {
        previousValue.current = value;
      }
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, reducedMotion, value]);

  return reducedMotion ? value : displayedValue;
}
