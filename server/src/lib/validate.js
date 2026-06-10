// Saneamiento y validación del lead de contacto. Funciones puras: sin Express ni
// entorno, para poder probarlas con node:test sin levantar el servidor.
//
// IMPORTANTE: `VALID_SERVICES` debe coincidir con las opciones del <select> del
// cliente (client/src/pages/Contacto.jsx). Si se agrega un servicio allá, agregarlo acá.

export const VALID_SERVICES = new Set([
  'Outsourcing contable',
  'Impuestos y consultoría tributaria',
  'Administración de nómina',
  'Derecho corporativo',
  'Aún no estoy seguro'
]);

// Elimina caracteres de control (incluye CR/LF: primera barrera contra inyección de
// cabeceras de correo), colapsa espacios y limita longitud.
export function clean(value, max = 1000) {
  return String(value ?? '')
    // eslint-disable-next-line no-control-regex -- eliminar caracteres de control es el propósito de esta regex
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

// Igual que clean() pero conserva saltos de línea: el mensaje los necesita.
export function cleanMessage(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    // eslint-disable-next-line no-control-regex -- eliminar caracteres de control es el propósito de esta regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, 2000);
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Honeypot: campos invisibles que un humano nunca rellena. Si llegan con datos, es un bot.
// El nombre `website` debe seguir sincronizado con el campo oculto del formulario del cliente.
export function isHoneypotTripped(body) {
  return Boolean(clean(body.website, 200) || clean(body.empresa_url, 200));
}

export function validate(body) {
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
  else if (!VALID_SERVICES.has(data.servicio)) errors.servicio = 'Seleccione una opción válida.';
  if (!data.mensaje) errors.mensaje = 'Escriba un mensaje.';
  else if (data.mensaje.length < 10) errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';

  return { data, errors };
}
