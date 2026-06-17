import { useEffect, useState } from 'react';
import { sanity } from './sanity.js';
import { QUERIES, mapServicio, mapTestimonios, mapSystems, mapNosotros, mapSiteImages, overlay } from './content-transforms.js';
import { services as localServices } from '../data/services.js';
import {
  CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, ADDRESS_LINES, SCHEDULE, WHATSAPP_NUMBER,
} from '../data/contact.js';

// Bandera: activa solo en dev (.env.development). En build de producción es undefined →
// false → las páginas usan el contenido horneado (data/, que en build trae Sanity) y no
// hay fetch en el navegador. Ver content-transforms.js para las queries/transforms.
const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Devuelve `fallback` (lo que el componente ya tiene) al instante; si la bandera está
// activa, consulta Sanity, lo transforma con `map` y reemplaza al llegar. Ante error o
// respuesta vacía conserva el fallback (la web nunca se queda sin contenido).
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
    // `map` se omite a propósito: se recrea en cada render; la query (estable) es la dependencia real.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return data;
}

// Servicios en el shape de data/services.js, con Sanity superpuesto por slug en dev.
export function useServices() {
  return useSanityData(
    QUERIES.servicios,
    (rows) => localServices.map((loc) => {
      const s = rows.find((r) => r.slug === loc.slug);
      return s ? overlay(loc, mapServicio(s)) : loc;
    }),
    localServices,
  );
}

export function useService(slug) {
  return useServices().find((s) => s.slug === slug);
}

export function useTestimonials(fallback) {
  return useSanityData(QUERIES.testimonios, mapTestimonios, fallback);
}

export function useSystems(fallback) {
  return useSanityData(QUERIES.sistemas, mapSystems, fallback);
}

const localContact = {
  email: CONTACT_EMAIL,
  telefonoDisplay: PHONE_DISPLAY,
  telefonoTel: PHONE_TEL,
  direccion: ADDRESS_LINES,
  horario: SCHEDULE,
  whatsapp: WHATSAPP_NUMBER,
};

export function useContact() {
  return useSanityData(QUERIES.contacto, (r) => overlay(localContact, r), localContact);
}

export function useNosotros(fallback) {
  return useSanityData(QUERIES.nosotros, (n) => mapNosotros(n) || fallback, fallback);
}

export function useSiteImages(fallback) {
  return useSanityData(QUERIES.imagenes, (r) => overlay(fallback, mapSiteImages(r)), fallback);
}
