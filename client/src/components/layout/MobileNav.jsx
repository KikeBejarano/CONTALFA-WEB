import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { services } from '../../data/services.js';

export function MobileNav({ open, setOpen }) {
  const location = useLocation();
  const navRef = useRef(null);

  // Cierra el menú al cambiar de ruta.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, setOpen]);

  // Gestión de foco, focus trap, scroll-lock y Escape mientras el menú está abierto.
  useEffect(() => {
    if (!open) return undefined;

    const nav = navRef.current;
    const toggle = document.getElementById('menu-toggle');
    document.body.classList.add('menu-open');

    const focusables = () =>
      nav ? Array.from(nav.querySelectorAll('a[href], button:not([disabled])')) : [];

    // Mueve el foco al primer enlace al abrir.
    requestAnimationFrame(() => focusables()[0]?.focus());

    function onKey(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      // Atrapa el foco dentro del menú: el Tab no debe alcanzar el contenido de fondo.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('menu-open');
      // Devuelve el foco al botón que abrió el menú.
      toggle?.focus();
    };
  }, [open, setOpen]);

  return (
    <nav id="mobile-nav" ref={navRef} className={open ? 'open' : ''} aria-label="Navegación móvil" aria-hidden={!open}>
      <ul>
        <li><Link className="m-label" to="/servicios" aria-current={location.pathname === '/servicios' ? 'page' : undefined}>Servicios</Link></li>
        {services.map((service) => (
          <li key={service.slug}><Link className="sub" to={`/servicios/${service.slug}`}>{service.menuTitle}</Link></li>
        ))}
        <li><Link to="/tecnologia">Tecnología</Link></li>
        <li><Link to="/nosotros">Nosotros</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
      </ul>
      <div className="wrap"><Link className="btn btn-primary" to="/contacto">Agendar un diagnóstico</Link></div>
    </nav>
  );
}
