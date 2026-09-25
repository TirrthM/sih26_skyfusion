'use client';

import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const effectiveReducedMotion = manualOverride !== null ? manualOverride : prefersReducedMotion;

  const toggleReducedMotion = () => {
    setManualOverride((prev) => (prev === null ? !prefersReducedMotion : !prev));
  };

  return {
    reducedMotion: effectiveReducedMotion,
    toggleReducedMotion,
    isManualOverride: manualOverride !== null,
  };
}
