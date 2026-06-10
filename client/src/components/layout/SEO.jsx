import { useContext, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { computeSeoMeta, SeoCollectorContext, SITE_NAME } from './seo-meta.js';

function setContent(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute('content', value);
}

function setHref(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute('href', value);
}

export function SEO({ title, description, image, noindex = false }) {
  const { pathname } = useLocation();

  // Durante el prerender no hay DOM: el colector captura las metas para inyectarlas en
  // el HTML estático. Llamarlo en render es seguro: el valor es una función pura de las
  // props por ruta, y en el navegador el colector no existe.
  const collectSeoMeta = useContext(SeoCollectorContext);
  if (collectSeoMeta) {
    collectSeoMeta(computeSeoMeta({ title, description, image, noindex, pathname }));
  }

  useLayoutEffect(() => {
    const meta = computeSeoMeta({ title, description, image, noindex, pathname });

    document.title = meta.title;
    setContent('meta[name="description"]', meta.description);
    setContent('meta[name="robots"]', meta.robots);
    setHref('link[rel="canonical"]', meta.canonical);

    setContent('meta[property="og:type"]', 'website');
    setContent('meta[property="og:site_name"]', SITE_NAME);
    setContent('meta[property="og:locale"]', 'es_VE');
    setContent('meta[property="og:title"]', meta.title);
    setContent('meta[property="og:description"]', meta.description);
    setContent('meta[property="og:url"]', meta.canonical);
    setContent('meta[property="og:image"]', meta.image);

    setContent('meta[name="twitter:card"]', 'summary_large_image');
    setContent('meta[name="twitter:title"]', meta.title);
    setContent('meta[name="twitter:description"]', meta.description);
    setContent('meta[name="twitter:image"]', meta.image);
  }, [description, image, noindex, pathname, title]);

  return null;
}
