import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Prerender post-build: renderiza cada ruta con el bundle SSR (dist-server) y escribe
// dist/<ruta>/index.html con el contenido y las metas de esa ruta, para que los
// crawlers sin JS (Bing, bots sociales/IA) vean título, descripción y canonical reales.

const clientDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(clientDir, 'dist');
const ssrDir = path.join(clientDir, 'dist-server');

// `/404` no existe como ruta: renderiza NotFound (noindex). Hosts estáticos como
// Netlify o GitHub Pages sirven 404.html en URLs desconocidas, evitando responder con
// el Home prerenderizado.
const routes = [
  { url: '/', outFile: 'index.html' },
  { url: '/servicios', outFile: 'servicios/index.html' },
  { url: '/servicios/outsourcing', outFile: 'servicios/outsourcing/index.html' },
  { url: '/servicios/impuestos', outFile: 'servicios/impuestos/index.html' },
  { url: '/servicios/nomina', outFile: 'servicios/nomina/index.html' },
  { url: '/servicios/derecho-corporativo', outFile: 'servicios/derecho-corporativo/index.html' },
  { url: '/tecnologia', outFile: 'tecnologia/index.html' },
  { url: '/nosotros', outFile: 'nosotros/index.html' },
  { url: '/contacto', outFile: 'contacto/index.html' },
  { url: '/404', outFile: '404.html' },
];

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
}

// Reemplaza exigiendo exactamente una coincidencia: si la plantilla (index.html) cambia
// y un selector deja de encontrarse, el build falla en vez de publicar metas a medias.
function replaceOne(html, pattern, build, label) {
  let count = 0;
  const result = html.replace(pattern, (...args) => {
    count += 1;
    return build(...args);
  });
  if (count !== 1) {
    throw new Error(`Prerender: ${count} coincidencias para ${label} en la plantilla (se esperaba 1).`);
  }
  return result;
}

function setAttrValue(html, pattern, value, label) {
  return replaceOne(html, pattern, (_match, prefix) => prefix + escapeHtml(value), label);
}

function applyMeta(template, meta) {
  let html = template;
  html = replaceOne(html, /<title>[^<]*<\/title>/, () => `<title>${escapeHtml(meta.title)}</title>`, '<title>');
  html = setAttrValue(html, /(<meta name="description" content=")[^"]*/, meta.description, 'meta description');
  html = setAttrValue(html, /(<meta name="robots" content=")[^"]*/, meta.robots, 'meta robots');
  html = setAttrValue(html, /(<link rel="canonical" href=")[^"]*/, meta.canonical, 'link canonical');
  html = setAttrValue(html, /(<meta property="og:title" content=")[^"]*/, meta.title, 'og:title');
  html = setAttrValue(html, /(<meta property="og:description" content=")[^"]*/, meta.description, 'og:description');
  html = setAttrValue(html, /(<meta property="og:url" content=")[^"]*/, meta.canonical, 'og:url');
  html = setAttrValue(html, /(<meta property="og:image" content=")[^"]*/, meta.image, 'og:image');
  html = setAttrValue(html, /(<meta name="twitter:title" content=")[^"]*/, meta.title, 'twitter:title');
  html = setAttrValue(html, /(<meta name="twitter:description" content=")[^"]*/, meta.description, 'twitter:description');
  html = setAttrValue(html, /(<meta name="twitter:image" content=")[^"]*/, meta.image, 'twitter:image');
  return html;
}

const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

for (const { url, outFile } of routes) {
  const { html: appHtml, meta } = await render(url);
  if (!meta) {
    throw new Error(`Prerender: la ruta ${url} no declaró <SEO>; no hay metas que inyectar.`);
  }
  if (appHtml.length < 1000) {
    throw new Error(`Prerender: HTML sospechosamente corto para ${url} (${appHtml.length} caracteres).`);
  }

  let html = applyMeta(template, meta);
  html = replaceOne(html, /<div id="root"><\/div>/, () => `<div id="root">${appHtml}</div>`, '#root');

  // Doble formato por ruta: `ruta/index.html` (índice de directorio: nginx, Netlify,
  // GitHub Pages) y gemelo plano `ruta.html` (hosts tipo sirv/serve, incluido
  // `vite preview`, que resuelven /ruta -> ruta.html pero no ruta/index.html). La
  // canonical absorbe la URL duplicada con/sin barra final.
  const targets = [outFile];
  if (url !== '/' && outFile.endsWith('/index.html')) {
    targets.push(`${url.slice(1)}.html`);
  }
  for (const relativePath of targets) {
    const target = path.join(distDir, relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html, 'utf8');
  }
  console.log(`prerender ${url} -> ${targets.map((file) => `dist/${file}`).join(' + ')} · ${meta.title}`);
}

// El bundle SSR es un artefacto intermedio del build; no debe llegar al deploy.
await rm(ssrDir, { recursive: true, force: true });
