# Sanity CMS — cómo funciona en este proyecto

Documento técnico para el equipo. Explica cómo el contenido del sitio se edita en
Sanity y cómo llega a la web, en desarrollo y en producción.

---

## 1. Las piezas

| Pieza | Qué es | Dónde |
|---|---|---|
| **Sanity Studio** | El panel de edición (app React open-source). Define los esquemas en código; el contenido se edita en una UI amigable. | `studio/` |
| **Content Lake** | El almacén de contenido en la nube de Sanity. El Studio escribe; la web lee. | nube (proyecto `hbsenmzc`) |
| **Esquemas** | Definen los tipos de contenido y sus campos. | `studio/schemaTypes/` |
| **Cliente + hooks** | Cómo la web React lee el contenido. | `client/src/lib/sanity.js`, `useSanityContent.js` |

Proyecto Sanity: **`hbsenmzc`** · dataset **`production`** (público, solo-lectura desde el front).
`projectId`/`dataset` son **públicos** (no secretos); van con default en `client/src/lib/sanity.js`.

### Tipos de contenido (`studio/schemaTypes/`)
`servicio` · `testimonio` · `datosContacto` · `sistema` (tecnología) · `paginaNosotros` · `seo`.

El `intro` de `servicio` es **Portable Text** (texto enriquecido); el resto son campos
simples y listas. Imágenes: se suben al Studio y se sirven optimizadas desde el CDN de Sanity.

---

## 2. Cómo llega el contenido a la web

Esta es la decisión de arquitectura clave, porque el sitio es **estático/prerenderizado**
(HTML horneado en el build → rápido y bueno para SEO). Hay **dos modos**:

### Modo desarrollo — overlay en vivo (instantáneo)
Bandera `VITE_USE_SANITY=true` (en `client/.env.development`, solo `npm run dev`).
Las páginas reales renderizan los datos **locales al instante** y, vía los hooks de
`useSanityContent.js`, **superponen** lo que haya en Sanity (merge campo-por-campo;
conserva lo local que Sanity no tenga, p. ej. imágenes). Editar en el Studio → recargar →
se ve. Útil para desarrollar y para demostrar la edición.

```
Editor → Studio → Content Lake → (fetch en navegador) → página real se actualiza al recargar
```

### Modo producción — horneado en el build + auto-deploy
La bandera **NO** está en `vite build`, así que el sitio publicado **no** consulta a Sanity
en el navegador: el contenido se **trae al construir** y se hornea en el HTML estático.
Cuando el cliente publica un cambio, la web se **reconstruye** y se redespliega:

```
Editor → Studio → Publish → webhook → GitHub Actions (build trae Sanity + deploy) → ravatech
                                                                         ~1–2 min → en vivo
```

El visitante siempre recibe HTML estático (rápido, SEO intacto). **Ambos modos están
implementados**: el overlay de dev y el horneado-en-build (`client/scripts/fetch-content.mjs`,
que corre como primer paso de `npm run build`). El auto-deploy es la plantilla
`.github/workflows/deploy.yml` (necesita los secrets de FTP para activarse).

---

## 3. Mapa del código

```
studio/                         App del Studio (independiente del sitio)
  sanity.config.js              Config del Studio (projectId, plugins, esquemas)
  sanity.cli.ts                 Config de la CLI (.ts a propósito: el loader del CLI
                                  no resuelve .js bajo "type":module)
  schemaTypes/*.js              Un archivo por tipo de contenido
  seed/generate-seed.mjs        Genera seed.ndjson con el contenido real
  seed/seed.ndjson              Contenido inicial (importado con `sanity dataset import`)

client/src/
  lib/sanity.js                 Cliente de solo-lectura (@sanity/client)
  lib/useSanityContent.js       Hooks: useServices/useService/useTestimonials/
                                  useSystems/useContact (overlay + merge + fallback local)
  pages/DemoSanity.jsx          Ejemplo aislado en /demo-sanity
  data/*.js                     Datos locales = el FALLBACK (la web nunca queda sin contenido)
```

Páginas/componentes conectados: `ServiceGrid`, `ServiceDetail`, `Footer`, `Testimonials`,
`Tecnologia`, `Contacto`, `Header`, `MobileNav`, `WhatsAppButton`.
El `<select>` de servicios de `Contacto.jsx` se deja **local** a propósito: debe coincidir
con la allowlist `VALID_SERVICES` del backend.

---

## 4. Correr en local

```bash
# El panel (Studio) — http://localhost:3333
cd studio && npm install && npm run dev

# El sitio (con overlay de Sanity en vivo) — http://localhost:5173
cd client && npm install && npm run dev
```

Recién clonado funciona sin configurar nada (el `projectId` público va por default).
Para editar contenido por código hace falta `npx sanity login` (en `studio/`).

**Importar/actualizar el contenido semilla:**
```bash
cd studio
npx sanity login                                   # una vez (abre el navegador)
npx sanity dataset import seed/seed.ndjson production --replace
```

**Permitir un origen nuevo (CORS) para leer desde el navegador:**
```bash
cd studio && npx sanity cors add http://localhost:5173 --no-credentials
```

---

## 5. Producción (cuando el contenido esté listo)

1. **Publicar el Studio** para que el cliente lo use desde cualquier lado:
   ```bash
   cd studio && npx sanity deploy        # queda en https://<nombre>.sanity.studio
   ```
2. **Hornear Sanity en el build** ✅ implementado: `npm run build` ejecuta primero
   `client/scripts/fetch-content.mjs`, que trae el contenido de Sanity y lo escribe en
   `client/src/data/content.generated.js`; los `data/*.js` lo fusionan sobre su contenido
   local (fallback). Si Sanity falla, escribe `{}` y se usa lo local — la web nunca se
   rompe. `content.generated.js` es un stub `{}` versionado que el build sobreescribe.
3. **Auto-deploy**: `.github/workflows/deploy.yml` construye y sube `client/dist/` a
   ravatech por FTP. Se dispara con cada push y con un **webhook de Sanity** (al publicar):
   - En GitHub: añadir secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_REMOTE_DIR`.
   - En Sanity (manage → API → Webhooks): apuntar a la API de GitHub
     (`repository_dispatch`, evento `sanity-publish`) con un token de GitHub.

---

## 6. Cómo extenderlo (para devs)

- **Agregar un campo a un tipo**: editar `studio/schemaTypes/<tipo>.js` (`defineField`).
  El Studio lo recoge al instante. Para mostrarlo en la web, añadir el campo a la query
  GROQ del hook correspondiente en `useSanityContent.js` y usarlo en el componente.
- **Agregar un tipo nuevo**: crear `studio/schemaTypes/<nuevo>.js`, registrarlo en
  `schemaTypes/index.js`, y (si va en la web) crear su hook + query.
- **Qué puede editar el cliente**: lo define el esquema. Texto e imágenes sí; tipografía,
  colores y layout **no** (viven en el código del sitio) — separación contenido/diseño.

---

## 7. Usuarios y acceso (los trabajadores)

El Studio está publicado en **https://contalfa.sanity.studio** — los trabajadores entran
ahí desde cualquier navegador (no `localhost`).

- **Invitar a un trabajador**: sanity.io/manage → proyecto `CONTALFA-WEB` → **Members** →
  *Invite members* → su correo + rol. Recibe un email, acepta, entra con Google/email.
- **Roles**: **Editor** (crear/editar/publicar contenido, sin tocar configuración) es el
  correcto para los editores; **Viewer** (solo lectura); **Administrator** (control total:
  miembros, facturación, settings) solo para el dueño/responsable.
- **Login**: Google o email. Sin cuenta de GitHub, sin instalar nada.
- **Plan**: los usuarios **Administrator** son gratis e ilimitados; los asientos
  **Editor/Viewer** están limitados en el plan Free (ver sanity.io/pricing para el número
  vigente). Si hacen falta más editores que los del Free, el salto es **Growth (~$15/usuario/mes)**.
  El proyecto está hoy en **Growth Trial**.
