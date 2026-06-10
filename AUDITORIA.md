# Auditoría técnica — CONTALFA

**Fecha:** 2026-06-04
**Alcance:** Frontend (`client/`), Backend (`server/`), seguridad, accesibilidad, SEO y organización del código.
**Método:** auditoría multi-agente de solo lectura (6 especialistas), cada hallazgo fundamentado en código real con cita `archivo:línea`.
**Copia auditada:** raíz `/CONTALFA/client` y `/CONTALFA/server` (se ignoró el clon duplicado `CONTALFA-WEB/`).

---

## Veredicto general

El proyecto está **bien construido en lo esencial**: seguridad madura, base de accesibilidad sólida y estructura interna limpia y consistente. La deuda real se concentra en tres frentes: **(1) capa de repositorio** (clon duplicado, sin coordinación monorepo), **(2) SEO de infraestructura** (SPA sin prerender, faltan robots/sitemap/schema), y **(3) robustez operativa del backend** (puede perder leads en silencio). Casi todo es corregible con esfuerzo bajo-medio.

---

## 🔴 Prioridad alta (atacar primero)

| # | Área | Hallazgo | Ubicación |
|---|------|----------|-----------|
| 1 | Organización | **Clon duplicado `CONTALFA-WEB/` con repo git anidado** (idéntico byte a byte, mismo remoto y commit `8851f43`). Riesgo de editar la copia equivocada; ruido permanente en `git status`. | `/CONTALFA/CONTALFA-WEB/` |
| 2 | SEO | **SPA sin SSR/prerender**: el HTML servido a los bots llega vacío (`<title>Contalfa</title>` genérico, sin description ni OG). Bing y rastreadores sociales/IA no ejecutan JS → no ven el contenido. Es el cuello de botella que limita todo el SEO. | `client/src/main.jsx:7`, `client/index.html:10`, `client/vite.config.js:5-12` |
| 3 | Backend | **El servidor "miente" al cliente**: si faltan variables SMTP no falla al arrancar; en runtime cae a `mode:'log'` y aun así responde `{ ok:true }` → **el lead se pierde en silencio**. El health check devuelve `ok` incondicional. | `server/src/lib/mailer.js:61-66`, `server/src/routes/contact.js:73`, `server/src/index.js:43-45` |
| 4 | Frontend + A11y | **`aria-labelledby` roto en 5 secciones**: apuntan a un `id` que `SectionHead` nunca emite → regiones sin nombre accesible. Bug verificado por dos auditores. | `client/src/components/ui/SectionHead.jsx:8` (consumido por StatsGrid:17, ProblemCards:12, ServiceGrid:8, ProcessTimeline:30, Testimonials:12) |
| 5 | Frontend | **Sin code-splitting**: las 7 páginas viajan en un único bundle (~90 KB gzip). Ver el Home descarga Contacto, todos los ServiceDetail, etc. Penaliza LCP/TBT. | `client/src/App.jsx:1-10` |
| 6 | Frontend + Org | **Tailwind instalado y configurado pero sin usar** (solo 7 de ~230 `className` usan utilidades). Tokens de color/tipografía **duplicados** entre `tailwind.config.js` y el `:root` de `legacy-modelo.css` → dos fuentes de verdad. | `client/tailwind.config.js`, `client/src/legacy-modelo.css:6-37`, todos los `.jsx` |

---

## 🟡 Prioridad media

### SEO
- **Falta `robots.txt` y `sitemap.xml`** (ausentes en `client/public/`). En una SPA son aún más necesarios para garantizar el descubrimiento de las 9 URLs.
- **Datos estructurados pobres**: el único JSON-LD (`AccountingService`) se **duplica en las 9 páginas** (`SEO.jsx:57`); falta `LocalBusiness` con `geo`/`priceRange`/`sameAs` (el Instagram ya está en `Footer.jsx:18`), `Service` por servicio y `BreadcrumbList` (hay migas visuales en `Breadcrumb.jsx` sin schema). Crítico para una firma contable **local**.
- **Canonicals sin normalizar** (`SEO.jsx:34-35`, `pathname` crudo) → riesgo de duplicados por trailing slash/mayúsculas. **404 responde HTTP 200** sin `noindex` (`App.jsx:24`, `NotFound.jsx`) → riesgo de soft-404. `SEO.jsx` no permite marcar `noindex`.
- **Title del Home demasiado largo** (~80 car., se trunca) y sin keyword local al inicio (`data/seo.js:3`).
- **OG genérica**: foto de stock compartida por todas las páginas (`SEO.jsx:6`); falta imagen de marca 1200×630.

### Rendimiento de imágenes (Frontend + SEO)
- **`<img>` de contenido sin `width`/`height`** → CLS (`ServiceDetail.jsx:49`, `Nosotros.jsx:23`, `Tecnologia.jsx:31`, `TeamSection.jsx:10`).
- **Todas las imágenes en JPG de 90-150 KB** sin WebP/AVIF ni `srcset` → penaliza LCP en móvil.
- La imagen LCP del Hero se carga por `background-image` en CSS (`legacy-modelo.css:441-444`) → no se puede priorizar/preload.

### Backend
- **Transporter de nodemailer recreado en cada request** → el `pool:true` no sirve, handshake TLS por petición (`mailer.js:18-36,68`).
- **Sin graceful shutdown**: en redeploy (`SIGTERM`) se cortan requests y el pool SMTP nunca cierra → correos perdidos (`index.js:62-68`).
- **Sin tests** de la lógica crítica (sanitización, regex email, allowlist, honeypot, escape HTML). Se sugiere `node --test` (cero dependencias).
- Health check trivial (no refleja si SMTP funciona); logging con `console.*` sin estructura.

### Seguridad (postura general SÓLIDA — esto es endurecimiento)
- **Falta CSP efectiva sobre el HTML servido**: `helmet()` solo cubre `/api/*`, no el documento de la SPA (servido por el host estático). Configurar CSP en el CDN/host. (`index.js:16`, `index.html:6-8`)
- `server/.gitignore` vacío: el `.env` solo está protegido por el `.gitignore` raíz (hoy seguro, pero frágil si se reorganiza).
- `TRUST_PROXY` (operacional): documentar el valor correcto según el proxy de producción, o el rate-limit se degrada (`index.js:13`).

### Accesibilidad
- **Saltos de jerarquía de encabezados** h2→h4 por estilo (`ServiceDetail.jsx:38`, `TechTeaser.jsx:18`).
- Anuncios dinámicos `aria-live` frágiles: ruta SPA (`Layout.jsx:18-26`) y errores de formulario (`Contacto.jsx:119`) — requieren verificación con lector real (NVDA/VoiceOver).

### CSS / deuda de migración (Frontend)
- **CSS muerto**: selectores de componentes que ya no existen (canvas WebGL, `prod-*`, `cierre-form`, `btn-secondary`) ~80-100 líneas eliminables (`legacy-modelo.css:171-289`). Capas históricas "v4-v8" que reescriben reglas en lugar de editarlas (`:346-521`).
- **Dos mecanismos de "reveal" en conflicto**: el manual con clase `in` fija nunca anima; el fallback `html:not(.js)` espera una clase `js` que nunca se añade (código muerto pero accesiblemente seguro).

### Organización / tooling
- **Sin coordinación monorepo**: no hay `package.json` raíz ni workspaces; arrancar exige dos terminales. ESLint solo en client; server sin lint.
- **Sin CI, sin pre-commit, sin `.editorconfig`/`.prettierrc`** → diffs ruidosos por formato.

---

## 🟢 Prioridad baja (pulido)
- Listas de "sistemas propios" duplicadas en 3 sitios (`Footer.jsx:29`, `Tecnologia.jsx:8`, `TechTeaser.jsx:20`); campo muerto `legacy:'*.html'` en `services.js`; componente `Button` aplicado de forma inconsistente.
- Un `IntersectionObserver` + un `matchMedia` por cada `<Reveal>` (~15-20 simultáneos en el Home) — ineficiente, sin fuga. Centralizar `prefers-reduced-motion` en un Context.
- `getService` con `find` lineal y `JSON.stringify` del JSON-LD en cada render (`SEO.jsx:57`).
- Falta `engines`/`.nvmrc` (Node ≥18) en `server/package.json`.
- Favicon sin variantes (`apple-touch-icon`, `.ico`, `theme-color`, manifest). `lang="es"` podría afinarse a `es-VE`.
- `<select>` sin `value` explícito (`Contacto.jsx:111`); tira de credibilidad sin semántica de lista (`CredibilityStrip.jsx`).

---

## ✅ Lo que ya está bien (NO romper)

**Seguridad (postura madura):**
- Inyección de cabeceras de correo **mitigada en doble capa**: `clean()` elimina CR/LF (`contact.js:13-19`) + nodemailer 8 sanea cabeceras a nivel de librería.
- XSS en cuerpo del correo mitigado (`escapeHtml` antes de interpolar, `mailer.js:9-16,50-59`); validación server-side con allowlist cerrada; límite de payload 32 kB.
- **Honeypot correcto** en cliente y servidor (doble trampa, responde 200 sin enviar).
- 0 vulnerabilidades en `npm audit`; sin secretos hardcodeados ni commiteados; `x-powered-by` off; timeouts SMTP y de request; CORS restrictivo sin comodín; errores genéricos al cliente.

**Accesibilidad (base fuerte):**
- Focus trap real y completo en el menú móvil (Tab/Shift+Tab, Escape, devuelve foco al disparador) — `MobileNav.jsx:15-55`.
- `prefers-reduced-motion` respetado en los 4 hooks de movimiento; skip link funcional; `:focus-visible` robusto con variante on-dark.
- Contraste AA en todas las combinaciones de texto; labels asociados + `aria-invalid`/`aria-describedby` en el formulario; `alt=""` correcto en decorativas; landmarks y `aria-current` correctos; `lang="es"` y títulos únicos por ruta.

**Arquitectura/estructura interna (limpia):**
- `components/{layout,sections,ui}` + `pages` + `hooks` + `data`; naming consistente (PascalCase componentes, camelCase hooks, named exports).
- SEO con fuente única (`data/seo.js` consumido por `<SEO>`); server con capas claras `index/routes/lib` y `.env.example` ejemplar.
- Código muerto casi inexistente; lockfiles versionados.

---

## Plan de acción sugerido (por esfuerzo/impacto)

**Quick wins (horas, alto impacto):**
1. Eliminar `CONTALFA-WEB/` (tras confirmar que no tiene commits locales sin pushear).
2. Crear `robots.txt` + `sitemap.xml` en `client/public/`.
3. Arreglar `aria-labelledby`: propagar `id` en `SectionHead`.
4. Code-splitting: `React.lazy` + `Suspense` por ruta en `App.jsx`.
5. Backend: no devolver `ok:true` en `mode:'log'`; validar SMTP al arranque (fail-fast en producción).
6. Añadir `width`/`height` a las `<img>` de contenido.

**Medio plazo (días):**
7. Prerender en build (SSG con `vite-plugin-prerender`/`react-snap`) — desbloquea el SEO.
8. Enriquecer JSON-LD (LocalBusiness único + Service + BreadcrumbList).
9. Backend: transporter singleton + graceful shutdown + tests con `node --test`.
10. Convertir imágenes a WebP/AVIF con `srcset`.
11. Decisión explícita Tailwind vs CSS legacy (documentar en un ADR) + purga de CSS muerto.

**Estructural (cuando convenga):**
12. `package.json` raíz con workspaces + scripts unificados (`dev`/`build`/`lint`/`test`).
13. CI mínimo (`.github/workflows/ci.yml`: install + lint + build + test); `.editorconfig` + `.prettierrc`; ESLint también en `server/`.
14. CSP en el host estático/CDN.

---

*Generado por auditoría multi-agente (Frontend Developer · Backend Architect · Security Engineer · Accessibility Auditor · SEO Specialist · Code Reviewer).*

---

# Seguimiento — 2026-06-09

**Alcance:** re-auditoría de verificación, rediseño del backend, limpieza de archivos y coordinación del repo.
**Estado general:** los 6 hallazgos rojos están resueltos o mitigados; la deuda restante es de esfuerzo medio y no bloquea producción.

## Estado de los hallazgos originales

| # | Hallazgo original | Estado |
|---|-------------------|--------|
| 🔴1 | Clon duplicado `CONTALFA-WEB/` | ✅ Resuelto — ya no existe |
| 🔴2 | SPA sin SSR/prerender | ✅ Resuelto — prerender SSG en build (2026-06-10): las 9 rutas + 404 emitidas como HTML estático con metas y contenido por ruta (ver Seguimiento 2026-06-10) |
| 🔴3 | Backend "miente" (leads perdidos en silencio) | ✅ Resuelto — 503 si SMTP falta, fail-fast al arrancar en producción, health reporta `mail: ready\|unconfigured` |
| 🔴4 | `aria-labelledby` roto en 5 secciones | ✅ Resuelto — `SectionHead` emite el `id` |
| 🔴5 | Sin code-splitting | ✅ Resuelto — `React.lazy` + `Suspense` por ruta |
| 🔴6 | Tailwind instalado sin usar / tokens duplicados | 🟡 Parcial — directivas `@tailwind` activas en `index.css`; la decisión Tailwind vs CSS legacy sigue abierta (ADR pendiente) |

**Media/baja resueltos:** robots.txt + sitemap.xml · JSON-LD enriquecido (LocalBusiness + OfferCatalog + WebSite, una sola fuente en `index.html`) · `width`/`height` en las 8 `<img>` · transporter singleton con pool · graceful shutdown · `<select>` con `value` controlado.

## Trabajo de esta sesión (2026-06-09)

**Backend rediseñado** (`server/src/`):
- `config.js` — lectura de entorno centralizada (antes dispersa en 3 archivos).
- `app.js` — `createApp()` separado del arranque: testeable sin abrir puertos ni dotenv; acepta overrides (CORS, rate-limit) para tests.
- `index.js` — solo bootstrap: dotenv, **fail-fast si falta SMTP en producción**, listen, timeouts, shutdown.
- `lib/validate.js` — saneamiento/validación puros (extraídos de la ruta); documenta la sincronía con el cliente.
- `lib/lead-email.js` — construcción del correo pura (escape HTML testeable).
- `lib/logger.js` — logs con timestamp ISO + nivel, sin dependencias.
- Manejo de errores del body-parser: JSON malformado → 400, payload > 32 kB → 413 (antes ambos caían en 500).
- **24 tests** con `node:test` (cero dependencias): sanitización anti header-injection, escape XSS, honeypot, validación por campo, CORS allowlist, rate-limit, 404, 503 sin SMTP, JSON malformado, payload gigante.
- ESLint en server (flat config, mismo stack que client) + `engines: node >=20` + `.gitignore` propio.

**Repo:**
- `package.json` raíz: `npm run dev` levanta API+web en una terminal (concurrently); `build`/`lint`/`test`/`start` unificados. Override de `shell-quote@1.8.4` (concurrently fijaba 1.8.3, vulnerable — GHSA-w7jw-789q-3m8p). **0 vulnerabilidades en los 3 árboles.**
- `.nvmrc` (24) + `.editorconfig` + README reescrito (el anterior mencionaba Helmet, eliminado hace semanas).

**Cliente (micro-fixes):**
- `SEO.jsx`: canonical normalizada (minúsculas, sin barra final) + soporte `noindex`.
- `NotFound.jsx`: `noindex` (evita soft-404).
- **40 líneas de CSS muerto eliminadas** de `legacy-modelo.css` (verificado selector por selector contra JSX/data: `btn-secondary`, `hero/tech-canvas`, `*-poster`, `canvas-ready`, `prod-*`, `cierre-form/grid/copy`). `hero-stage`, `tech-stage`, `#cierre`, `.field` y `cred-strip` están vivos y se conservaron.

**Verificación de archivos innecesarios:** `client/dist/` no está versionado (correcto, regenerable) · `legacy-*.css` están en uso (importados por `index.css`) · no hay archivos huérfanos ni duplicados en el repo.

## Pendiente (por impacto)

~~1. Prerender/SSG por ruta~~ → ✅ resuelto el 2026-06-10 (ver abajo).
~~2. CI mínimo~~ → ✅ resuelto: `.github/workflows/ci.yml` (lint server+client, tests, build con prerender en cada push/PR).

1. Imágenes WebP/AVIF con `srcset` (hoy JPG 90-150 KB).
2. CSP en el host estático/CDN (helmet solo cubre `/api/*`).
3. OG image de marca 1200×630 (hoy foto stock compartida).
4. Decisión Tailwind vs CSS legacy documentada (ADR) + consolidar tokens duplicados.
5. Menores: title del Home ~80 car., listas de "sistemas propios" en 3 sitios, un `IntersectionObserver` por `<Reveal>`.

---

# Seguimiento — 2026-06-10

## Prerender/SSG por ruta (cierra 🔴2)

Implementado **sin dependencias nuevas** (restricción supply-chain). `npm run build` del cliente encadena: build normal → build SSR (`src/entry-server.jsx` → `dist-server/`, artefacto intermedio que se borra al final) → `scripts/prerender.mjs`.

- **Render:** `prerender` de `react-dom/static` (React 19) + `StaticRouter`. Espera a los `React.lazy`, así el HTML llega completo y no con el fallback de `<Suspense>`. **`progressiveChunkSize: 1 MB` es imprescindible:** con el umbral por defecto (~12 kB) React emite las páginas grandes (Home) como fallback visible + contenido en `<div hidden>` + script de swap — inútil para bots sin JS e incompatible con una futura CSP sin inline scripts. Verificado: cero `<script>` en el `<body>` de todos los HTML generados.
- **Metas por ruta sin duplicar fuentes:** `seo-meta.js` centraliza `computeSeoMeta()` (la usa `SEO.jsx` contra el DOM) y un contexto colector (`SeoCollectorContext`) captura durante el prerender exactamente lo que cada página declara con `<SEO>` — los valores salen de `data/seo.js` y `data/services.js`, sin mapa ruta→meta paralelo que pueda desincronizarse.
- **Inyección validada:** el script reemplaza title/description/robots/canonical/og/twitter sobre la plantilla `dist/index.html` exigiendo exactamente 1 coincidencia por tag; si `index.html` cambia de forma, el build (y CI) falla en vez de publicar metas a medias.
- **Salida (18 archivos):** doble formato por ruta — `ruta/index.html` (índice de directorio: nginx, Netlify, GitHub Pages) y gemelo plano `ruta.html` (hosts tipo sirv/serve, incluido `vite preview`); la canonical absorbe la URL duplicada. Más `404.html` (NotFound con `noindex`) para hosts que lo sirven en URLs desconocidas.
- **Hidratación:** `main.jsx` usa `hydrateRoot` cuando el root llega con contenido; conserva `createRoot` en dev.
- **Verificación:** title/description/canonical/og:url correctos por ruta en los 10 documentos · 9 URLs limpias servidas con su HTML propio en `vite preview` · cero marcadores de Suspense pendientes/scripts de swap · lint limpio.

**Nota deploy:** en URLs desconocidas el fallback SPA devuelve el Home prerenderizado y React lo reemplaza al hidratar (warning de hidratación en consola, inofensivo). Si el host soporta `404.html` (Netlify/GitHub Pages), sirve el NotFound estático y no hay warning.

