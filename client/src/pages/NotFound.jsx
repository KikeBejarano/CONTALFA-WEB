import { Link } from 'react-router-dom';
import { PageHero } from '../components/sections/PageHero.jsx';
import { SEO } from '../components/layout/SEO.jsx';

export function NotFound() {
  return (
    <>
      {/* noindex: una SPA responde 200 incluso en rutas inexistentes; sin esta marca,
          los buscadores indexarían el 404 como página real (soft-404). */}
      <SEO title="Página no encontrada — Contalfa" description="La página solicitada no existe o cambió de ubicación." noindex />
      <PageHero kicker="404" title="Página no encontrada." lead="La dirección solicitada no existe o cambió de ubicación." crumbs={[{ label: '404' }]} />
      <section className="page-section not-found">
        <div className="wrap">
          <Link className="btn btn-primary" to="/">Volver al inicio</Link>
        </div>
      </section>
    </>
  );
}
