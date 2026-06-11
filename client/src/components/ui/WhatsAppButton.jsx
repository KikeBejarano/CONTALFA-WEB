import { whatsappUrl } from '../../data/contact.js';

// Botón flotante de click-to-chat. Es un enlace estático (sin JS), así que funciona
// también en el HTML prerenderizado antes de hidratar.
export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-fab"
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbanos por WhatsApp (se abre en una ventana nueva)"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M16.04 3C9.4 3 4 8.36 4 14.96c0 2.11.56 4.16 1.62 5.97L4 27l6.24-1.62a12.1 12.1 0 0 0 5.79 1.47h.01c6.63 0 12.03-5.36 12.03-11.96A11.87 11.87 0 0 0 24.5 6.5 12.06 12.06 0 0 0 16.04 3zm0 21.84h-.01a10.1 10.1 0 0 1-5.12-1.4l-.37-.22-3.7.96.99-3.59-.24-.37a9.85 9.85 0 0 1-1.54-5.26c0-5.48 4.49-9.93 10-9.93a9.99 9.99 0 0 1 10 9.95c0 5.48-4.5 9.86-10.01 9.86zm5.49-7.43c-.3-.15-1.78-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.48-.9-.79-1.5-1.77-1.68-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.68-.51l-.57-.01c-.2 0-.53.07-.8.37-.28.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.22 1.37.19 1.88.11.58-.08 1.78-.72 2.03-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
}
