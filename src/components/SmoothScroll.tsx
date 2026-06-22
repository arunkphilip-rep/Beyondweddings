'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Scroll behavior configuration for ultra-smooth rendering (60Hz to 144Hz)
    const lenis = new Lenis({
      lerp: 0.08,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    (window as any).lenisInstance = lenis;

    let animFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animFrameId = requestAnimationFrame(raf);
    }

    animFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animFrameId);
      lenis.destroy();
      (window as any).lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
