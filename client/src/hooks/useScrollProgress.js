import { useEffect, useRef, useState } from 'react';

export function useScrollProgress(stepCount) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // matchMedia se lee una vez fuera del handler, no en cada evento de scroll.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let ticking = false;

    function compute() {
      ticking = false;
      if (!ref.current) return;
      if (reduce.matches) {
        setProgress(1);
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh * 0.78 - rect.top) / (rect.height + vh * 0.3);
      setProgress(Math.max(0, Math.min(1, raw)));
    }

    // Un solo getBoundingClientRect por frame para evitar reflows forzados en cada scroll.
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return {
    ref,
    progress,
    litCount: Math.round(progress * stepCount),
  };
}
