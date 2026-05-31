'use client';

import { useEffect, useMemo, useState } from 'react';

// CSS 기준
// - sm:   0 ~ 499
// - md: 500 ~ 768
// - lg: 769 ~ 1024
// - xl: 1025 ~ 1198
// - wide: 1199 ~

const DEFAULT_BREAKPOINTS = {
  sm: 0,
  md: 500,
  lg: 769,
  xl: 1025,
  wide: 1199,
};

export default function useBreakpoint(breakpoints = DEFAULT_BREAKPOINTS) {
  const [bp, setBp] = useState('xl');

  const entries = useMemo(() => {
    return Object.entries(breakpoints).sort((a, b) => a[1] - b[1]);
  }, [breakpoints]);

  useEffect(() => {
    const getCurrent = () => {
      const w = window.innerWidth;
      let current = entries[0]?.[0] ?? 'xl';
      for (const [name, min] of entries) {
        if (w >= min) current = name;
      }
      return current;
    };

    const update = () => setBp(getCurrent());

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [entries]);

  return bp;
}
