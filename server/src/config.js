// Toda la lectura de variables de entorno vive aquí: una sola fuente de verdad
// para la app, el arranque y los tests.

export const REQUIRED_SMTP_KEYS = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'];

export function getMissingSmtpKeys(env = process.env) {
  return REQUIRED_SMTP_KEYS.filter((key) => !env[key]);
}

export function loadConfig(env = process.env) {
  return {
    isProduction: env.NODE_ENV === 'production',
    port: Number(env.PORT || 3001),
    // Nº de proxies reales delante de la app (Nginx/Cloudflare/Render). Nunca un valor
    // alto sin proxy real: permitiría falsear X-Forwarded-For y evadir el rate-limit.
    trustProxy: Number(env.TRUST_PROXY || 0),
    allowedOrigins: (env.ALLOWED_ORIGINS || 'https://contalfa.com,https://www.contalfa.com')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
    missingSmtpKeys: getMissingSmtpKeys(env)
  };
}
