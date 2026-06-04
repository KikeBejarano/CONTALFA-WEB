import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js';

export function useReveal() {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    // Con reduce-motion no se observa: el contenido se muestra sin animación de entrada.
    if (reduced) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  // Visible si el usuario prefiere menos movimiento o si ya entró en viewport.
  return { ref, visible: reduced || seen };
}
