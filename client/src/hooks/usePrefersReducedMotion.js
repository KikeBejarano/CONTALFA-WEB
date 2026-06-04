import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getInitial() {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches;
}

// Fuente única de verdad para prefers-reduced-motion: crea el MediaQueryList una sola vez
// y reacciona a cambios, en lugar de re-evaluar matchMedia en cada hook/efecto.
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(getInitial);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
