import { Router } from 'express';
import { sendLead } from '../lib/mailer.js';

const router = Router();
const validServices = new Set([
  'Outsourcing contable',
  'Impuestos y consultoría tributaria',
  'Administración de nómina',
  'Derecho corporativo',
  'Aún no estoy seguro'
]);

function clean(value, max = 1000) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function cleanMessage(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, 2000);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(body) {
  const data = {
    nombre: clean(body.nombre, 120),
    empresa: clean(body.empresa, 160),
    correo: clean(body.correo, 180).toLowerCase(),
    telefono: clean(body.telefono, 80),
    servicio: clean(body.servicio, 120),
    mensaje: cleanMessage(body.mensaje)
  };
  const errors = {};

  if (!data.nombre) errors.nombre = 'Indique su nombre.';
  if (!data.empresa) errors.empresa = 'Indique el nombre de la empresa.';
  if (!data.correo) errors.correo = 'Indique su correo.';
  else if (!isEmail(data.correo)) errors.correo = 'Indique un correo válido.';
  if (!data.servicio) errors.servicio = 'Seleccione un servicio.';
  else if (!validServices.has(data.servicio)) errors.servicio = 'Seleccione una opción válida.';
  if (!data.mensaje) errors.mensaje = 'Escriba un mensaje.';
  else if (data.mensaje.length < 10) errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';

  return { data, errors };
}

router.post('/', async (req, res) => {
  const body = req.body || {};

  // Honeypot: campos invisibles que un humano nunca rellena. Si llegan con datos, es un bot.
  // Respondemos 200 "ok" para no revelarle el filtro, pero NO enviamos correo.
  if (clean(body.website, 200) || clean(body.empresa_url, 200)) {
    return res.json({ ok: true, errors: {} });
  }

  const { data, errors } = validate(body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  try {
    const delivery = await sendLead(data);
    return res.json({ ok: true, errors: {}, delivery });
  } catch (error) {
    console.error('[contact error]', error?.message || error);
    return res.status(500).json({
      ok: false,
      errors: { form: 'No pudimos enviar el mensaje. Inténtelo nuevamente.' }
    });
  }
});

export default router;
