# Contalfa

Sitio corporativo de Contalfa: SPA en React/Vite (`client/`) y API Express para el formulario de contacto (`server/`).

## Estructura

```
client/                  # Frontend — React 19, Vite, React Router, Tailwind
  public/                # Assets estáticos (imágenes, logos, robots.txt, sitemap.xml)
  src/
    components/          # layout/ (Header, Footer, SEO...), sections/, ui/
    data/                # Fuentes de contenido (services.js, seo.js)
    hooks/               # useReveal, useCountUp, usePrefersReducedMotion...
    pages/               # Una por ruta, con code-splitting (React.lazy)
server/                  # API — Express 4, Node 20+
  src/
    index.js             # Arranque: dotenv, fail-fast SMTP, listen, graceful shutdown
    app.js               # createApp(): middleware, rutas y manejo de errores (testeable)
    config.js            # Lectura centralizada de variables de entorno
    lib/                 # validate.js, lead-email.js, mailer.js, logger.js (puros/aislados)
    routes/contact.js    # POST /api/contact
  test/                  # node:test — unitarios + integración (sin dependencias extra)
```

## Requisitos

- Node.js ≥ 20 (ver `.nvmrc`)

## Desarrollo

```bash
npm install        # instala raíz + client + server (postinstall)
cd server && cp .env.example .env && cd ..
npm run dev        # levanta API (:3001) y web (:5173) en una sola terminal
```

El dev server de Vite hace proxy de `/api` hacia `http://localhost:3001` (ver `client/vite.config.js`), así el formulario funciona sin configurar CORS en desarrollo.

## Scripts (desde la raíz)

| Comando         | Hace                                              |
| --------------- | ------------------------------------------------- |
| `npm run dev`   | API + web en paralelo (concurrently)              |
| `npm run build` | Build de producción del cliente (`client/dist/`)  |
| `npm test`      | Suite del server (`node --test`, 24 tests)        |
| `npm run lint`  | ESLint en server y client                         |
| `npm start`     | Solo la API, modo producción                      |

## API

| Ruta           | Método | Descripción                                                        |
| -------------- | ------ | ------------------------------------------------------------------ |
| `/api/health`  | GET    | `{ ok, mail }` — `mail` indica si el SMTP está configurado         |
| `/api/contact` | POST   | Recibe el lead, valida, y lo envía por correo (rate-limit 10/15min) |

Respuesta estándar: `{ ok: boolean, errors: { campo: mensaje } }`.

### Variables de entorno del server (`server/.env`)

| Variable          | Descripción                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| `SMTP_HOST/PORT/USER/PASS` | Credenciales del servidor de correo saliente                    |
| `MAIL_TO`         | Buzón que recibe los leads                                               |
| `PORT`            | Puerto de la API (default 3001)                                          |
| `ALLOWED_ORIGINS` | Allowlist CORS, separada por comas                                       |
| `TRUST_PROXY`     | Nº de proxies delante de la app (¡exacto, o el rate-limit se degrada!)   |
| `NODE_ENV`        | Con `production`, el server NO arranca si faltan variables SMTP          |

## Seguridad (decisiones ya tomadas — no romper)

- **Honeypot**: el form envía un campo oculto `website`; si llega con datos, el server responde 200 sin enviar correo. El nombre del campo debe seguir sincronizado entre `Contacto.jsx` y `lib/validate.js`.
- **Allowlist de servicios**: `VALID_SERVICES` (server) debe coincidir con las opciones del `<select>` del cliente.
- **Anti header-injection**: `clean()` elimina CR/LF de todos los campos antes de armar el correo; el HTML del correo se escapa con `escapeHtml()`.
- **SEO sin dependencias**: no usar react-helmet (riesgo supply-chain). `SEO.jsx` actualiza las meta tags que ya existen en `index.html`.

## Despliegue

- **Cliente**: `npm run build` con `VITE_API_URL` apuntando al origen del API (p.ej. `https://contalfa-api.onrender.com`) → servir `client/dist/` desde un host estático. **No** configurar rewrite SPA de todas las rutas a `index.html`: el build emite HTML prerenderizado por ruta (`ruta/index.html` + `ruta.html` + `404.html`); basta servir los archivos tal cual (IIS ya viene cubierto por el `web.config` incluido en `dist/`). Configurar CSP a nivel de host (helmet solo cubre `/api/*`).
- **Server** (Render o similar): `npm start` con el `.env` completo y, explícitamente, `NODE_ENV=production` (activa el fail-fast si faltan variables SMTP). Fijar `ALLOWED_ORIGINS` a los dominios reales y `TRUST_PROXY=1` si hay un proxy/CDN delante (en Render siempre lo hay; con `0`, el rate-limit vería una sola IP para todo el mundo).

## Rutas

`/` · `/servicios` · `/servicios/{outsourcing,impuestos,nomina,derecho-corporativo}` · `/tecnologia` · `/nosotros` · `/contacto`
