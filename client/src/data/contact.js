// Datos de contacto compartidos por la web. Única fuente de verdad: si la empresa
// cambia de número o correo, se actualiza aquí.

// PROVISIONAL: número de la oficina hasta que la empresa confirme cuál tiene
// WhatsApp Business. Formato internacional sin '+', espacios ni guiones (wa.me lo exige).
export const WHATSAPP_NUMBER = '582122051911';

export const WHATSAPP_GREETING = 'Hola, vengo de la web de Contalfa. Me gustaría más información sobre sus servicios.';

export function whatsappUrl(text = WHATSAPP_GREETING) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
