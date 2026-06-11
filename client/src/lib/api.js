// Base del API. En dev queda vacía y el proxy de Vite (vite.config.js) redirige
// /api a localhost:3001. En producción, con la web estática en un host sin Node
// (IIS de ravatech) y el API en otro origen (Render), VITE_API_URL debe apuntar
// allí (p.ej. https://contalfa-api.onrender.com) — el CORS del server ya permite
// contalfa.com. Sin esta variable, el formulario no llega al API en producción.
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
