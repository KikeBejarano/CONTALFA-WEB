// Construcción del correo del lead (asunto, texto plano y HTML). Funciones puras y
// testeables: el escape HTML de estos campos es la barrera anti-XSS del buzón receptor.

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function buildLeadEmail(data) {
  const subject = `Nuevo contacto web: ${data.nombre}`;

  const text = [
    `Nombre: ${data.nombre}`,
    `Empresa: ${data.empresa}`,
    `Correo: ${data.correo}`,
    `Teléfono: ${data.telefono || 'No indicado'}`,
    `Servicio: ${data.servicio}`,
    '',
    data.mensaje
  ].join('\n');

  const html = `
    <h2>Nuevo contacto desde contalfa.com</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(data.nombre)}</p>
    <p><strong>Empresa:</strong> ${escapeHtml(data.empresa)}</p>
    <p><strong>Correo:</strong> ${escapeHtml(data.correo)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(data.telefono || 'No indicado')}</p>
    <p><strong>Servicio:</strong> ${escapeHtml(data.servicio)}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(data.mensaje).replaceAll('\n', '<br>')}</p>
  `;

  return { subject, text, html };
}
