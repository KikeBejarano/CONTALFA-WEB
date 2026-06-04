import nodemailer from 'nodemailer';

const requiredSmtpKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'];

function hasSmtpConfig() {
  return requiredSmtpKeys.every((key) => Boolean(process.env[key]));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createTransporter() {
  const port = Number(process.env.SMTP_PORT || 587);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    // Evita que un SMTP lento deje el request colgado y agote conexiones.
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
    pool: true,
    maxConnections: 3
  });
}

export async function sendLead(data) {
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

  if (!hasSmtpConfig()) {
    // Sin SMTP no se entrega el lead. No volcamos PII (correo/teléfono/mensaje) a los logs;
    // solo dejamos constancia del evento para diagnóstico.
    console.warn('[contact] SMTP no configurado; lead NO entregado', { servicio: data.servicio });
    return { mode: 'log' };
  }

  const transporter = createTransporter();
  const result = await transporter.sendMail({
    from: `"Contalfa Web" <${process.env.SMTP_USER}>`,
    replyTo: data.correo,
    to: process.env.MAIL_TO,
    subject,
    text,
    html
  });

  return { mode: 'smtp', messageId: result.messageId };
}
