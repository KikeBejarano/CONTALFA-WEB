import generated from './content.generated.js';

const g = generated.siteImages || {};
const pick = (value, fallback) => (value == null || value === '' ? fallback : value);

// Fotos editables del sitio. Si Sanity no tiene una imagen subida, se usa la local.
export const siteImages = {
  fotoEquipo: pick(g.fotoEquipo, '/assets/img/corp-7433853.jpg'),
  fotoTecnologia: pick(g.fotoTecnologia, '/assets/img/corp-6949934.jpg'),
};
