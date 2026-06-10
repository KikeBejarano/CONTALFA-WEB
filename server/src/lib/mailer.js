import nodemailer from 'nodemailer';
import { getMissingSmtpKeys } from '../config.js';
import { buildLeadEmail } from './lead-email.js';

// Transporter singleton con pool: un solo handshake TLS reutilizado entre envíos.
let transporter;

function assertSmtpConfig() {
  const missing = getMissingSmtpKeys();
  if (missing.length === 0) return;

  const error = new Error(`SMTP no configurado: faltan ${missing.join(', ')}`);
  error.code = 'SMTP_NOT_CONFIGURED';
  error.missing = missing;
  throw error;
}

function getTransporter() {
  if (transporter) return transporter;
  assertSmtpConfig();

  const port = Number(process.env.SMTP_PORT || 587);

  transporter = nodemailer.createTransport({
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

  return transporter;
}

export async function sendLead(data) {
  const { subject, text, html } = buildLeadEmail(data);

  const result = await getTransporter().sendMail({
    from: `"Contalfa Web" <${process.env.SMTP_USER}>`,
    replyTo: data.correo,
    to: process.env.MAIL_TO,
    subject,
    text,
    html
  });

  return { mode: 'smtp', messageId: result.messageId };
}

export function closeMailer() {
  if (!transporter) return;
  transporter.close();
  transporter = undefined;
}
