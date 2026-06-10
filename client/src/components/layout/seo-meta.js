import { createContext } from 'react';

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://contalfa.com';
export const SITE_NAME = 'Contalfa';
export const DEFAULT_IMAGE = '/assets/img/corp-6950031.jpg';

// El prerender de build (scripts/prerender.mjs) provee este contexto para capturar las
// metas que cada página declara con <SEO>. En el navegador no hay Provider (vale null)
// y <SEO> escribe directamente en el <head>.
export const SeoCollectorContext = createContext(null);

// Única fuente del cálculo de metas por ruta: la consume <SEO> contra el DOM y el
// prerender contra el HTML estático. Canonical normalizada: minúsculas y sin barra
// final (salvo la raíz), para no declarar como distintas /Servicios, /servicios/ y
// /servicios.
export function computeSeoMeta({ title, description, image = DEFAULT_IMAGE, noindex = false, pathname }) {
  const normalizedPath = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const canonical = new URL(normalizedPath, SITE_URL).toString();
  return {
    title,
    description,
    robots: noindex ? 'noindex,follow' : 'index,follow',
    canonical,
    image: image.startsWith('http') ? image : new URL(image, SITE_URL).toString(),
  };
}
