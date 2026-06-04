# Contalfa

Migración del sitio estático de Contalfa a una SPA React/Vite con backend Express para el formulario de contacto.

## Estructura

- `client/`: frontend React, Vite, React Router, Helmet y Tailwind.
- `server/`: API Express para `/api/contact` y `/api/health`.

## Desarrollo

Backend:

```bash
cd server
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Rutas principales:

- `/`
- `/servicios`
- `/servicios/outsourcing`
- `/servicios/impuestos`
- `/servicios/nomina`
- `/servicios/derecho-corporativo`
- `/tecnologia`
- `/nosotros`
- `/contacto`
