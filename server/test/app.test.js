import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

// Estado determinista: estos tests asumen SMTP sin configurar, aunque el shell
// tenga variables sueltas. No se carga dotenv aquí (solo index.js lo hace).
for (const key of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO']) {
  delete process.env[key];
}

const validLead = {
  nombre: 'Ana Pérez',
  empresa: 'Acme C.A.',
  correo: 'ana@empresa.com',
  telefono: '',
  servicio: 'Outsourcing contable',
  mensaje: 'Necesito una propuesta para mi empresa.'
};

function startServer(t, overrides) {
  return new Promise((resolve) => {
    const server = createApp(overrides).listen(0, '127.0.0.1', () => {
      t.after(() => new Promise((done) => server.close(done)));
      resolve(`http://127.0.0.1:${server.address().port}`);
    });
  });
}

function postContact(baseUrl, body, headers = {}) {
  return fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

test('GET /api/health responde ok y refleja el estado del correo', async (t) => {
  const baseUrl = await startServer(t);
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, mail: 'unconfigured' });
});

test('una ruta inexistente responde 404 en JSON', async (t) => {
  const baseUrl = await startServer(t);
  const res = await fetch(`${baseUrl}/api/nope`);
  assert.equal(res.status, 404);
  assert.equal((await res.json()).ok, false);
});

test('JSON malformado responde 400, no 500', async (t) => {
  const baseUrl = await startServer(t);
  const res = await postContact(baseUrl, '{"nombre":');
  assert.equal(res.status, 400);
});

test('payload sobre el límite de 32kb responde 413', async (t) => {
  const baseUrl = await startServer(t);
  const res = await postContact(baseUrl, { ...validLead, mensaje: 'a'.repeat(40000) });
  assert.equal(res.status, 413);
});

test('honeypot disparado devuelve 200 sin entregar nada', async (t) => {
  const baseUrl = await startServer(t);
  const res = await postContact(baseUrl, { ...validLead, website: 'http://spam.example' });
  assert.equal(res.status, 200);
  const payload = await res.json();
  assert.equal(payload.ok, true);
  assert.equal(payload.delivery, undefined);
});

test('cuerpo inválido devuelve 400 con errores por campo', async (t) => {
  const baseUrl = await startServer(t);
  const res = await postContact(baseUrl, { correo: 'malo' });
  assert.equal(res.status, 400);
  const { errors } = await res.json();
  assert.ok(errors.nombre);
  assert.ok(errors.correo);
  assert.ok(errors.servicio);
});

test('lead válido sin SMTP configurado devuelve 503 (no se pierde en silencio)', async (t) => {
  const baseUrl = await startServer(t);
  const res = await postContact(baseUrl, validLead);
  assert.equal(res.status, 503);
  const payload = await res.json();
  assert.equal(payload.ok, false);
  assert.ok(payload.errors.form);
});

test('un Origin fuera de la allowlist recibe 403', async (t) => {
  const baseUrl = await startServer(t, { allowedOrigins: ['https://contalfa.com'] });
  const res = await postContact(baseUrl, validLead, { Origin: 'https://evil.example' });
  assert.equal(res.status, 403);
});

test('un Origin permitido recibe la cabecera CORS', async (t) => {
  const baseUrl = await startServer(t, { allowedOrigins: ['https://contalfa.com'] });
  const res = await fetch(`${baseUrl}/api/health`, { headers: { Origin: 'https://contalfa.com' } });
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://contalfa.com');
});

test('el rate-limit corta tras el límite configurado', async (t) => {
  const baseUrl = await startServer(t, { rateLimit: { windowMs: 60000, limit: 2 } });
  const bot = { ...validLead, website: 'spam' };
  assert.equal((await postContact(baseUrl, bot)).status, 200);
  assert.equal((await postContact(baseUrl, bot)).status, 200);
  assert.equal((await postContact(baseUrl, bot)).status, 429);
});
