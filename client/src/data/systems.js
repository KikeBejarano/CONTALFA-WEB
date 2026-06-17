import generated from './content.generated.js';

// Tuplas [nombre, titulo, descripcion]. Sanity (build) reemplaza la lista si la provee.
const fallback = [
  ['ATR', 'Sistema financiero y contable', 'Sistema financiero y contable basado en la web, completamente adaptado a la realidad fiscal venezolana.'],
  ['SICA', 'Sistema de conciliaciones bancarias', 'Sistema de conciliaciones bancarias.'],
  ['SISA', 'Sistema de seguimiento de actividades', 'Sistema de seguimiento de actividades, con señales en pantalla para los supervisores.'],
  ['Validador', 'Validador de reportes fiscales', 'Valida la calidad de los reportes fiscales; detecta errores en los libros de compras y ventas.'],
  ['Sólidus', 'Sistema de nómina', 'Sistema de nómina: liquida la nómina de los empleados.'],
];

export const systems = generated.systems?.length ? generated.systems : fallback;
