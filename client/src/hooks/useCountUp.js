import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js';

function format(value, sep) {
  return sep ? String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(value);
}

export function useCountUp(target, { sep = false, enabled = true, duration = 1300 } = {}) {
  const [value, setValue] = useState(() => format(target, sep));
  // Se marca true SOLO al completar la animación, no al iniciarla: así el doble
  // montaje de StrictMode (cuyo cleanup cancela el primer frame) no la deja bloqueada.
  const completed = useRef(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // Con reduce-motion (o ya completado) no se anima: `value` ya arranca en el valor final.
    if (!enabled || completed.current || reduced) {
      return undefined;
    }

    let frame = 0;
    let started = 0;

    function tick(timestamp) {
      if (!started) started = timestamp;
      const progress = Math.min((timestamp - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(format(Math.round(target * eased), sep));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        completed.current = true;
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, enabled, sep, target, reduced]);

  return value;
}
