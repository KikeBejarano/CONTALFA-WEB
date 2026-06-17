// Transforms PUROS (sin React ni import.meta): importables desde Node (el script de
// build scripts/fetch-content.mjs) y desde Vite (lib/useSanityContent.js y los data/).
// Una sola fuente para las queries GROQ y la forma en que el contenido de Sanity se
// adapta a la forma que esperan los componentes.

export const QUERIES = {
  servicios: `*[_type=="servicio"]|order(orden asc){
    "slug": slug.current, title, subtitle, heroTitle, description, metaDescription,
    intro, forWhom, includes, "imageUrl": image.asset->url, imageAlt,
    closenessTitle, closenessText, closeness,
    detailOverline, detailTitle, detailText, detailCards[]{title, text, items},
    ctaTitle, ctaText
  }`,
  testimonios: `*[_type=="testimonio"]|order(orden asc){cargo, empresa, cita}`,
  sistemas: `*[_type=="sistema"]|order(orden asc){nombre, titulo, descripcion}`,
  contacto: `*[_type=="datosContacto"][0]{email, telefonoDisplay, telefonoTel, direccion, horario, whatsapp}`,
  nosotros: `*[_type=="paginaNosotros"][0]{titulo, cuerpo, valores[]{titulo, texto}}`,
  seo: `*[_type=="seo"]{pagina, title, description}`,
};

// Portable Text → array de párrafos (strings), como esperan los componentes.
export function ptToParagraphs(pt) {
  return (pt || [])
    .filter((b) => b._type === 'block')
    .map((b) => (b.children || []).map((s) => s.text).join(''));
}

// Superpone los valores definidos de `extra` sobre `base` (ignora null/''/[] vacíos):
// lo que Sanity no provea conserva el valor local (p. ej. imágenes no subidas a Sanity).
export function overlay(base, extra) {
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

// Sanity `servicio` → forma de data/services.js (el consumidor hace overlay sobre el local).
export function mapServicio(s) {
  return {
    slug: s.slug,
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
  };
}

// Tuplas en la forma que ya consumen los componentes.
export const mapTestimonios = (rows) => (rows || []).map((r) => [r.cargo, r.empresa, r.cita]);
export const mapSystems = (rows) => (rows || []).map((r) => [r.nombre, r.titulo, r.descripcion]);

// SEO → objeto { pagina: {title, description} }.
export const mapSeo = (rows) =>
  Object.fromEntries((rows || []).map((r) => [r.pagina, { title: r.title, description: r.description }]));

// Página Nosotros → { titulo, cuerpo: [párrafos], valores: [{titulo, texto}] }.
export function mapNosotros(n) {
  if (!n) return null;
  return { titulo: n.titulo, cuerpo: ptToParagraphs(n.cuerpo), valores: n.valores || [] };
}
