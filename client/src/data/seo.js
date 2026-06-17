import generated from './content.generated.js';

const fallback = {
  home: {
    title: 'Contalfa — El rigor de seis décadas, al servicio de su tranquilidad fiscal',
    description: 'Firma contable en Caracas desde 1964. Outsourcing contable, impuestos, nómina y derecho corporativo, con tecnología propia. Más de 1.000 empresas confían su cumplimiento a Contalfa.',
  },
  servicios: {
    title: 'Servicios — Contalfa',
    description: 'Una sola firma, cuatro frentes de cumplimiento: outsourcing contable, impuestos y tributario, administración de nómina y derecho corporativo. Back office completo en Caracas.',
  },
  tecnologia: {
    title: 'Tecnología — Contalfa',
    description: 'Sistemas propios para contabilidad, conciliaciones, seguimiento, validación fiscal y nómina. Tecnología contable desarrollada por Contalfa para Venezuela.',
  },
  nosotros: {
    title: 'Nosotros — Contalfa',
    description: 'Más de seis décadas de oficio contable en Venezuela. Contabilidad, impuestos, nómina y derecho corporativo bajo un mismo equipo.',
  },
  contacto: {
    title: 'Contacto — Contalfa',
    description: 'Hablemos de su empresa. Cuéntenos sobre su operación y le mostramos, sin compromiso, cómo asumir su contabilidad, impuestos, nómina y derecho corporativo. Caracas.',
  },
};

// Sanity (build) puede sobreescribir title/description por página; se fusiona sobre el local.
export const seo = generated.seo && Object.keys(generated.seo).length
  ? Object.fromEntries(Object.keys(fallback).map((page) => [page, { ...fallback[page], ...(generated.seo[page] || {}) }]))
  : fallback;
