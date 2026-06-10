import 'dotenv/config';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { logger } from './lib/logger.js';
import { closeMailer } from './lib/mailer.js';

const config = loadConfig();

// Fail-fast: en producción, arrancar sin SMTP significa perder leads en silencio.
// Mejor negarse a arrancar y que el deploy falle de forma visible.
if (config.missingSmtpKeys.length > 0) {
  const message = `Faltan variables SMTP: ${config.missingSmtpKeys.join(', ')}`;
  if (config.isProduction) {
    logger.error(`[server] ${message}. Abortando arranque.`);
    process.exit(1);
  }
  logger.warn(`[server] ${message}. /api/contact responderá 503 hasta configurarlas.`);
}

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`Contalfa API escuchando en http://localhost:${config.port}`);
});

// Corta requests colgadas (p. ej. SMTP lento) para no agotar conexiones.
server.requestTimeout = 15000;
server.headersTimeout = 16000;

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`[server] ${signal} recibido; cerrando conexiones.`);

  const forceExit = setTimeout(() => {
    logger.error('[server] cierre forzado tras timeout.');
    process.exit(1);
  }, 10000);
  forceExit.unref();

  server.close(() => {
    closeMailer();
    clearTimeout(forceExit);
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
