import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Cliente de SOLO LECTURA. En Vite las env del front van con prefijo VITE_ y se leen
// con import.meta.env (NUNCA process.env: en el navegador queda undefined y truena).
// projectId/dataset/apiVersion son PÚBLICOS (no secretos): llevan default para que el
// repo funcione recién clonado; las env VITE_* los sobreescriben si existen.
export const sanity = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'hbsenmzc',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01', // fecha fija, no 'v1' ni hoy dinámico
  // useCdn:false en la DEMO → refleja al instante lo que publicas en el Studio
  // (el CDN puede tardar unos segundos). En producción (lecturas en el build) usar true.
  useCdn: false,
})

// Construye URLs de imágenes optimizadas (WebP/redimensionado) desde el CDN de Sanity.
const builder = imageUrlBuilder(sanity)
export function urlForImage(source) {
  return builder.image(source)
}
