import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer } from './Footer.jsx';
import { Header } from './Header.jsx';
import { MobileNav } from './MobileNav.jsx';
import { SkipLink } from './SkipLink.jsx';

export function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const announceRef = useRef(null);
  const firstRender = useRef(true);

  // En cada navegación SPA: mover el foco al contenido y anunciar la nueva página a
  // los lectores de pantalla. Sin esto el foco se queda en el enlace anterior y el
  // cambio de página pasa desapercibido para teclado/SR. Se omite en la carga inicial.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus();
    // document.title ya fue actualizado por <SEO> (metadata nativa de React 19).
    if (announceRef.current) announceRef.current.textContent = document.title;
  }, [pathname]);

  return (
    <>
      <SkipLink />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileNav open={menuOpen} setOpen={setMenuOpen} />
      <main id="main" ref={mainRef} tabIndex={-1}>{children}</main>
      <Footer />
      <div ref={announceRef} aria-live="polite" aria-atomic="true" className="sr-only" />
    </>
  );
}
