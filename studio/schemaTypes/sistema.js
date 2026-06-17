import {defineType, defineField} from 'sanity'

// Sistema propio (sección Tecnología): ATR, SICA, SISA, Validador, Sólidus.
export default defineType({
  name: 'sistema',
  title: 'Sistema (Tecnología)',
  type: 'document',
  fields: [
    defineField({name: 'nombre', title: 'Nombre', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'titulo', title: 'Título', type: 'string'}),
    defineField({name: 'descripcion', title: 'Descripción', type: 'text', rows: 3}),
    defineField({name: 'orden', title: 'Orden', type: 'number'}),
  ],
  preview: {select: {title: 'nombre', subtitle: 'titulo'}},
})
