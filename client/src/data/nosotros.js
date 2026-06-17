import generated from './content.generated.js';

// Contenido editable de la página Nosotros (el hero, las cifras y el CTA quedan en el
// componente). Sanity (build) lo reemplaza si la provee.
const fallback = {
  titulo: 'Quiénes somos',
  cuerpo: [
    'Contalfa nació con una convicción simple: una empresa crece cuando deja de invertir su tiempo en lo transaccional y lo dedica a entender su mercado y a mejorar su operación. Ese ha sido nuestro oficio durante más de seis décadas.',
    'A lo largo de más de sesenta años hemos atendido a más de 1.000 empresas en Caracas y en todo el país, consolidando una práctica que combina el rigor profesional con tecnología propia.',
    'Hoy somos un solo responsable del back office de nuestros clientes: contabilidad, impuestos, nómina y derecho corporativo, coordinados de verdad bajo un mismo techo.',
  ],
  valores: [
    { titulo: 'Rigor', texto: 'Procesos contables confiables y trazables, sostenidos por seis décadas de práctica y por tecnología propia adaptada al marco fiscal venezolano.' },
    { titulo: 'Cercanía', texto: 'Un mismo responsable que conoce su empresa, le anticipa lo que viene y le responde con criterio, en lenguaje de negocio y no en jerga.' },
    { titulo: 'Discreción', texto: 'Resguardamos su información con el cuidado que exige la dirección de una empresa. La confianza se construye con prudencia y constancia.' },
  ],
};

export const nosotros = generated.nosotros || fallback;
