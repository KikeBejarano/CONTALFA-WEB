import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { getMissingSmtpKeys, loadConfig } from './config.js';
import { logger } from './lib/logger.js';
import contactRouter from './routes/contact.js';

// Fábrica de la app, separada del arranque (index.js) para poder montarla en tests
// con node:test sin abrir el puerto real ni cargar dotenv. `overrides` permite a los
// tests inyectar orígenes CORS o límites de rate-limit sin tocar process.env.
export function createApp(overrides = {}) {
  const config = { ...loadConfig(), ...overrides };
  const rateLimitOptions = { windowMs: 15 * 60 * 1000, limit: 10, ...overrides.rateLimit };

  const app = express();

  app.set('trust proxy', config.trustProxy);
  app.disable('x-powered-by');
  app.use(helmet());

  // CORS restringido a orígenes conocidos. Sin Origin (curl/health checks) se permite;
  // orígenes no listados se bloquean y el error se traduce a 403 más abajo.
  app.use(cors({
    origin(origin, callback) {
      if (!origin || config.allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origen no permitido'));
    },
    methods: ['GET', 'POST'],
    maxAge: 86400
  }));

  app.use(express.json({ limit: '32kb' }));

  const contactLimiter = rateLimit({
    windowMs: rateLimitOptions.windowMs,
    limit: rateLimitOptions.limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, errors: { form: 'Demasiados intentos. Inténtelo más tarde.' } }
  });

  app.get('/api/health', (_req, res) => {
    // `mail` permite al monitoreo detectar credenciales SMTP ausentes sin revelar cuáles.
    res.json({ ok: true, mail: getMissingSmtpKeys().length === 0 ? 'ready' : 'unconfigured' });
  });

  app.use('/api/contact', contactLimiter, contactRouter);

  app.use((_req, res) => {
    res.status(404).json({ ok: false, errors: { route: 'Ruta no encontrada.' } });
  });

  // eslint-disable-next-line no-unused-vars -- Express identifica el handler de error por su firma de 4 argumentos.
  app.use((err, _req, res, _next) => {
    if (err?.message === 'Origen no permitido') {
      return res.status(403).json({ ok: false, errors: { cors: 'Origen no permitido.' } });
    }
    // Errores del body-parser: JSON malformado y payload sobre el límite de 32 kB.
    if (err?.type === 'entity.parse.failed') {
      return res.status(400).json({ ok: false, errors: { form: 'El cuerpo de la petición no es JSON válido.' } });
    }
    if (err?.type === 'entity.too.large') {
      return res.status(413).json({ ok: false, errors: { form: 'La petición es demasiado grande.' } });
    }
    logger.error('[server]', err?.message || err);
    return res.status(500).json({ ok: false, errors: { form: 'Error interno.' } });
  });

  return app;
}
