import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { services } from '../src/data/services.js';

// Prerender post-build: renderiza cada ruta con el bundle SSR (dist-server) y escribe
// dist/<ruta>/index.html con el contenido y las metas de esa ruta, para que los
// crawlers sin JS (Bing, bots sociales/IA) vean título, descripción y canonical reales.

const clientDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(clientDir, 'dist');
const ssrDir = path.join(clientDir, 'dist-server');

// `/404` no existe como ruta: renderiza NotFound (noindex, sin priority → fuera del
// sitemap). Hosts estáticos como Netlify o GitHub Pages sirven 404.html en URLs
// desconocidas, evitando responder con el Home prerenderizado.
// Las rutas de servicios se derivan de data/services.js: añadir un servicio allá
// lo incorpora aquí (y al sitemap) sin tocar este archivo.
const routes = [
  { url: '/', outFile: 'index.html', priority: '1.0' },
  { url: '/servicios', outFile: 'servicios/index.html', priority: '0.9' },
  ...services.map(({ slug }) => ({ url: `/servicios/${slug}`, outFile: `servicios/${slug}/index.html`, priority: '0.8' })),
  { url: '/tecnologia', outFile: 'tecnologia/index.html', priority: '0.7' },
  { url: '/nosotros', outFile: 'nosotros/index.html', priority: '0.7' },
  { url: '/contacto', outFile: 'contacto/index.html', priority: '0.7' },
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

const sitemapEntries = [];

for (const { url, outFile, priority } of routes) {
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
  if (priority) {
    sitemapEntries.push({ loc: meta.canonical, priority });
  }
  console.log(`prerender ${url} -> ${targets.map((file) => `dist/${file}`).join(' + ')} · ${meta.title}`);
}

// Sitemap generado desde las mismas rutas y canonicals del prerender: imposible que
// se desincronice de lo realmente publicado.
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries.map(({ loc, priority }) => `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n    <priority>${priority}</priority>\n  </url>`),
  '</urlset>',
  '',
].join('\n');
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
console.log(`prerender sitemap.xml -> ${sitemapEntries.length} URLs`);

// El bundle SSR es un artefacto intermedio del build; no debe llegar al deploy.
await rm(ssrDir, { recursive: true, force: true });
