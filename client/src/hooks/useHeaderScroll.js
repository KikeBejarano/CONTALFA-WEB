import { useEffect, useState } from 'react';

export function useHeaderScroll() {
  const [state, setState] = useState({ scrolled: false, onDark: false });

  useEffect(() => {
    let ticking = false;

    function compute() {
      const y = window.scrollY || window.pageYOffset;
      const probe = y + 36;
      const darkBands = document.querySelectorAll('.band-navy');
      let onDark = false;
      for (const band of darkBands) {
        const top = band.offsetTop;
        if (probe >= top && probe < top + band.offsetHeight) {
          onDark = true;
          break;
        }
      }
      setState({ scrolled: y > 8, onDark });
      ticking = false;
    }

    // Coalesce los eventos de scroll a un cálculo por frame para evitar layout thrashing.
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

  return state;
}
