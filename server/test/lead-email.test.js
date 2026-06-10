import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLeadEmail, escapeHtml } from '../src/lib/lead-email.js';

const lead = {
  nombre: 'Ana Pérez',
  empresa: 'Acme & Hijos C.A.',
  correo: 'ana@empresa.com',
  telefono: '',
  servicio: 'Outsourcing contable',
  mensaje: 'Hola,\nnecesito una propuesta.'
};

test('escapeHtml neutraliza los cinco caracteres peligrosos', () => {
  assert.equal(
    escapeHtml(`<script>alert("x&y'z")</script>`),
    '&lt;script&gt;alert(&quot;x&amp;y&#039;z&quot;)&lt;/script&gt;'
  );
});

test('buildLeadEmail arma asunto, texto y HTML coherentes', () => {
  const { subject, text, html } = buildLeadEmail(lead);
  assert.equal(subject, 'Nuevo contacto web: Ana Pérez');
  assert.match(text, /Empresa: Acme & Hijos C\.A\./);
  assert.match(text, /Teléfono: No indicado/);
  assert.match(html, /Acme &amp; Hijos C\.A\./);
  assert.match(html, /Hola,<br>necesito una propuesta\./);
});

test('buildLeadEmail escapa payloads XSS en el HTML del correo', () => {
  const { html } = buildLeadEmail({ ...lead, mensaje: '<img src=x onerror=alert(1)> ataque' });
  assert.ok(!html.includes('<img'));
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
});
