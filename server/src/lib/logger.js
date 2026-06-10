// Logger mínimo sin dependencias: timestamp ISO + nivel en cada línea, para poder
// filtrar y correlacionar en los logs del host (Render/Railway/PM2) sin instalar nada.

function write(level, ...args) {
  const prefix = `[${new Date().toISOString()}] [${level}]`;
  if (level === 'error') console.error(prefix, ...args);
  else if (level === 'warn') console.warn(prefix, ...args);
  else console.log(prefix, ...args);
}

export const logger = {
  info: (...args) => write('info', ...args),
  warn: (...args) => write('warn', ...args),
  error: (...args) => write('error', ...args)
};
