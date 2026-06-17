// Paso de build: trae el contenido de Sanity y lo escribe en src/data/content.generated.js
// para que el prerender lo hornee en el HTML estático. Lectura pública (sin token).
// Si Sanity falla, escribe {} → los data/ usan su contenido local de respaldo (la web
// nunca se queda sin contenido). Se ejecuta antes de `vite build` (ver package.json).
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import {
  QUERIES, mapServicio, mapTestimonios, mapSystems, mapNosotros, mapSeo,
} from '../src/lib/content-transforms.js';

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'hbsenmzc',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // contenido fresco en el build
});

const outFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/content.generated.js');
const header = '// GENERADO por scripts/fetch-content.mjs — no editar a mano.\n';

async function main() {
  try {
    const [servicios, testimonios, sistemas, contacto, nosotros, seo] = await Promise.all([
      client.fetch(QUERIES.servicios),
      client.fetch(QUERIES.testimonios),
      client.fetch(QUERIES.sistemas),
      client.fetch(QUERIES.contacto),
      client.fetch(QUERIES.nosotros),
      client.fetch(QUERIES.seo),
    ]);
    const content = {
      services: (servicios || []).map(mapServicio),
      testimonials: mapTestimonios(testimonios),
      systems: mapSystems(sistemas),
      contact: contacto || {},
      nosotros: mapNosotros(nosotros),
      seo: mapSeo(seo),
    };
    await writeFile(outFile, `${header}export default ${JSON.stringify(content, null, 2)};\n`, 'utf8');
    console.log(`fetch-content: ${content.services.length} servicios · ${content.testimonials.length} testimonios · ${content.systems.length} sistemas · contacto:${content.contact.email ? 'sí' : 'no'} · nosotros:${content.nosotros ? 'sí' : 'no'} · seo:${Object.keys(content.seo).length}`);
  } catch (error) {
    console.warn(`fetch-content: no se pudo traer de Sanity (${error.message}); se usa el contenido local de respaldo.`);
    await writeFile(outFile, `${header}export default {};\n`, 'utf8');
  }
}

main();
