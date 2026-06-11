// Datos de contacto compartidos por la web. Única fuente de verdad para los
// componentes: si la empresa cambia de número, correo o dirección, se actualiza aquí.
// Excepción documentada: el JSON-LD de index.html (plantilla estática) duplica
// teléfono y dirección — actualizarlo a mano si cambian.

export const CONTACT_EMAIL = 'info@contalfa.com';

export const PHONE_DISPLAY = '(0212) 205 19 11';
export const PHONE_TEL = '+582122051911'; // formato href tel:

export const ADDRESS_LINES = ['C.C. Macaracuay Plaza, Piso 3, Torre B', 'Urb. Macaracuay, Caracas'];

export const SCHEDULE = 'Lunes a viernes, de 8:00 a.m. a 5:00 p.m.';

// PROVISIONAL: número de la oficina hasta que la empresa confirme cuál tiene
// WhatsApp Business. Formato internacional sin '+', espacios ni guiones (wa.me lo exige).
export const WHATSAPP_NUMBER = '582122051911';

export const WHATSAPP_GREETING = 'Hola, vengo de la web de Contalfa. Me gustaría más información sobre sus servicios.';

export function whatsappUrl(text = WHATSAPP_GREETING) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
