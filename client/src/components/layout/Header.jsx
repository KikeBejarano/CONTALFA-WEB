import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { services } from '../../data/services.js';
import { useHeaderScroll } from '../../hooks/useHeaderScroll.js';
import { ChevronDown, MenuIcon } from '../ui/Icons.jsx';

export function Header({ menuOpen, setMenuOpen }) {
  const location = useLocation();
  const { scrolled, onDark } = useHeaderScroll();
  const path = location.pathname;

  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef(null);
  const triggerRef = useRef(null);

  function topCurrent(target) {
    return path === target ? 'page' : undefined;
  }

  // Cierra al hacer clic/enfocar fuera del desplegable.
  useEffect(() => {
    if (!ddOpen) return undefined;
    function onPointer(event) {
      if (ddRef.current && !ddRef.current.contains(event.target)) setDdOpen(false);
    }
    function onFocusIn(event) {
      if (ddRef.current && !ddRef.current.contains(event.target)) setDdOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [ddOpen]);

  function onTriggerKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setDdOpen(true);
      // Enfoca el primer enlace del submenú en el siguiente frame.
      requestAnimationFrame(() => {
        ddRef.current?.querySelector('.dd-menu a')?.focus();
      });
    } else if (event.key === 'Escape') {
      setDdOpen(false);
    }
  }

  function onMenuKeyDown(event) {
    if (event.key === 'Escape') {
      setDdOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <header id="site-header" className={`${scrolled ? 'scrolled' : ''} ${onDark ? 'on-dark' : ''}`.trim()}>
      <div className="header-inner">
        <Link className="logo" to="/" aria-label="Contalfa — inicio">
          <img className="logo-sym" src="/assets/logos/alfa_2.png" alt="" width="859" height="559" />
          <span className="wm">CONT<b>ALFA</b></span>
        </Link>
        <nav className="nav" aria-label="Navegación principal">
          <div className={`dd ${ddOpen ? 'open' : ''}`.trim()} ref={ddRef}>
            <button
              type="button"
              ref={triggerRef}
              aria-haspopup="true"
              aria-expanded={ddOpen}
              aria-controls="dd-servicios-menu"
              onClick={() => setDdOpen((open) => !open)}
              onKeyDown={onTriggerKeyDown}
            >
              Servicios <ChevronDown />
            </button>
            <div className="dd-menu" id="dd-servicios-menu" onKeyDown={onMenuKeyDown}>
              <Link to="/servicios" aria-current={topCurrent('/servicios')} onClick={() => setDdOpen(false)}>
                Todos los servicios<small>Vista general</small>
              </Link>
              {services.map((service) => (
                <Link key={service.slug} to={`/servicios/${service.slug}`} aria-current={path === `/servicios/${service.slug}` ? 'page' : undefined} onClick={() => setDdOpen(false)}>
                  {service.menuTitle}<small>{service.subtitle}</small>
                </Link>
              ))}
            </div>
          </div>
          <Link to="/tecnologia" aria-current={topCurrent('/tecnologia')}>Tecnología</Link>
          <Link to="/nosotros" aria-current={topCurrent('/nosotros')}>Nosotros</Link>
          <Link to="/contacto" aria-current={topCurrent('/contacto')}>Contacto</Link>
        </nav>
        <div className="header-cta">
          <Link className="btn btn-primary" to="/contacto">Agendar un diagnóstico</Link>
          <button
            className="menu-toggle"
            id="menu-toggle"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
