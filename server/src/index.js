import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import contactRouter from './routes/contact.js';

const app = express();
const port = Number(process.env.PORT || 3001);

// Confianza en proxies: número de saltos reales delante de la app (Nginx/Cloudflare/Render).
// Nunca usar `true` en público sin proxy: permitiría falsear X-Forwarded-For y evadir el rate-limit.
app.set('trust proxy', Number(process.env.TRUST_PROXY || 0));
app.disable('x-powered-by');

app.use(helmet());

// CORS restringido a orígenes conocidos. Sin Origin (curl/health) se permite; orígenes no listados se bloquean.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://contalfa.com,https://www.contalfa.com')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido'));
  },
  methods: ['GET', 'POST'],
  maxAge: 86400
}));

app.use(express.json({ limit: '32kb' }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, errors: { form: 'Demasiados intentos. Inténtelo más tarde.' } }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
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
  console.error('[server error]', err?.message || err);
  return res.status(500).json({ ok: false, errors: { form: 'Error interno.' } });
});

const server = app.listen(port, () => {
  console.log(`Contalfa API listening on http://localhost:${port}`);
});

// Corta requests colgadas (p. ej. SMTP lento) para no agotar conexiones.
server.requestTimeout = 15000;
server.headersTimeout = 16000;
