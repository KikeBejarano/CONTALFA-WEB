import { createElement } from 'react';
import { useReveal } from '../../hooks/useReveal.js';

export function Reveal({ as = 'div', className = '', stagger = false, children, ...props }) {
  const { ref, visible } = useReveal();
  return createElement(
    as,
    {
      ref,
      className: `${className} ${visible ? 'in' : ''}`.trim(),
      [stagger ? 'data-reveal-stagger' : 'data-reveal']: true,
      ...props,
    },
    children,
  );
}
