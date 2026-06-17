// Datos de contacto compartidos por la web. En producción content.generated.js trae los
// valores de Sanity (build); aquí cada uno cae al valor local si Sanity no lo provee.
// Excepción documentada: el JSON-LD de index.html (plantilla estática) duplica teléfono
// y dirección — actualizarlo a mano si cambian.
import generated from './content.generated.js';

const g = generated.contact || {};
const pick = (value, fallback) =>
  value == null
  || (typeof value === 'string' && value.trim() === '')
  || (Array.isArray(value) && value.length === 0)
    ? fallback
    : value;

export const CONTACT_EMAIL = pick(g.email, 'info@contalfa.com');

export const PHONE_DISPLAY = pick(g.telefonoDisplay, '(0212) 205 19 11');
export const PHONE_TEL = pick(g.telefonoTel, '+582122051911'); // formato href tel:

export const ADDRESS_LINES = pick(g.direccion, ['C.C. Macaracuay Plaza, Piso 3, Torre B', 'Urb. Macaracuay, Caracas']);

export const SCHEDULE = pick(g.horario, 'Lunes a viernes, de 8:00 a.m. a 5:00 p.m.');

// PROVISIONAL: número de la oficina hasta que la empresa confirme cuál tiene WhatsApp
// Business. Formato internacional sin '+', espacios ni guiones (wa.me lo exige).
export const WHATSAPP_NUMBER = pick(g.whatsapp, '582122051911');

export const WHATSAPP_GREETING = 'Hola, vengo de la web de Contalfa. Me gustaría más información sobre sus servicios.';

export function whatsappUrl(text = WHATSAPP_GREETING) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
