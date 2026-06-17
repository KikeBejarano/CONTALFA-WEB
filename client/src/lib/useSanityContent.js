import { useEffect, useState } from 'react';
import { sanity } from './sanity.js';
import { services as localServices } from '../data/services.js';
import {
  CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, ADDRESS_LINES, SCHEDULE, WHATSAPP_NUMBER,
} from '../data/contact.js';

// Bandera: activa solo en dev (.env.development.local). En build de producción es
// undefined → false → las páginas usan datos locales y el prerender no cambia.
const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Hook genérico: devuelve `fallback` (datos locales) al instante; si la bandera está
// activa, consulta Sanity, lo transforma con `map` y reemplaza al llegar. Ante error
// o respuesta vacía, conserva el fallback (el sitio nunca se queda sin contenido).
function useSanityData(query, map, fallback) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    if (!USE_SANITY) return undefined;
    let alive = true;
    sanity
      .fetch(query)
      .then((res) => {
        if (!alive || res == null) return;
        if (Array.isArray(res) && res.length === 0) return;
        setData(map(res));
      })
      .catch(() => {});
    return () => { alive = false; };
    // `map` se omite a propósito: se recrea en cada render; la query (estable por hook) es la dependencia real.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return data;
}

// Superpone los valores definidos de `extra` sobre `base` (ignora null/''/[] vacíos),
// de modo que lo que Sanity no provea (p. ej. imágenes) conserve el valor local.
function overlay(base, extra) {
  if (!extra) return base;
  const out = { ...base };
  for (const [k, v] of Object.entries(extra)) {
    if (v == null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    out[k] = v;
  }
  return out;
}

// Portable Text → array de párrafos (strings), como esperan los componentes.
function ptToParagraphs(pt) {
  return (pt || [])
    .filter((b) => b._type === 'block')
    .map((b) => (b.children || []).map((s) => s.text).join(''));
}

const SERVICIOS_Q = `*[_type=="servicio"]|order(orden asc){
  "slug": slug.current, title, subtitle, heroTitle, description, metaDescription,
  intro, forWhom, includes, "imageUrl": image.asset->url, imageAlt,
  closenessTitle, closenessText, closeness,
  detailOverline, detailTitle, detailText, detailCards[]{title, text, items},
  ctaTitle, ctaText
}`;

// Devuelve la lista de servicios en el MISMO shape que data/services.js, con los
// campos de Sanity superpuestos (emparejando por slug y preservando el orden local).
export function useServices() {
  return useSanityData(
    SERVICIOS_Q,
    (rows) => localServices.map((loc) => {
      const s = rows.find((r) => r.slug === loc.slug);
      if (!s) return loc;
      return overlay(loc, {
        title: s.title,
        menuTitle: s.title,
        subtitle: s.subtitle,
        heroTitle: s.heroTitle,
        description: s.description,
        metaDescription: s.metaDescription,
        intro: ptToParagraphs(s.intro),
        forWhom: s.forWhom,
        includes: s.includes,
        image: s.imageUrl, // si no hay imagen en Sanity, overlay conserva la local
        imageAlt: s.imageAlt,
        closenessTitle: s.closenessTitle,
        closenessText: s.closenessText,
        closeness: s.closeness,
        detailOverline: s.detailOverline,
        detailTitle: s.detailTitle,
        detailText: s.detailText,
        detailCards: s.detailCards,
        ctaTitle: s.ctaTitle,
        ctaText: s.ctaText,
      });
    }),
    localServices,
  );
}

export function useService(slug) {
  return useServices().find((s) => s.slug === slug);
}

const TESTIMONIOS_Q = `*[_type=="testimonio"]|order(orden asc){cargo, empresa, cita}`;

// Devuelve testimonios como tuplas [cargo, empresa, cita] (shape del componente).
export function useTestimonials(fallback) {
  return useSanityData(
    TESTIMONIOS_Q,
    (rows) => rows.map((r) => [r.cargo, r.empresa, r.cita]),
    fallback,
  );
}

const SISTEMAS_Q = `*[_type=="sistema"]|order(orden asc){nombre, titulo, descripcion}`;

// Devuelve sistemas como tuplas [nombre, titulo, descripcion] (shape del componente).
export function useSystems(fallback) {
  return useSanityData(
    SISTEMAS_Q,
    (rows) => rows.map((r) => [r.nombre, r.titulo, r.descripcion]),
    fallback,
  );
}

const CONTACTO_Q = `*[_type=="datosContacto"][0]{email, telefonoDisplay, telefonoTel, direccion, horario, whatsapp}`;

const localContact = {
  email: CONTACT_EMAIL,
  telefonoDisplay: PHONE_DISPLAY,
  telefonoTel: PHONE_TEL,
  direccion: ADDRESS_LINES,
  horario: SCHEDULE,
  whatsapp: WHATSAPP_NUMBER,
};

// Devuelve los datos de contacto (objeto), con Sanity superpuesto sobre lo local.
export function useContact() {
  return useSanityData(CONTACTO_Q, (r) => overlay(localContact, r), localContact);
}
