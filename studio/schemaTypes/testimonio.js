import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'testimonio',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({name: 'cargo', title: 'Cargo', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'empresa', title: 'Empresa', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'cita', title: 'Cita', type: 'text', rows: 4, validation: (r) => r.required()}),
    defineField({name: 'orden', title: 'Orden', type: 'number'}),
  ],
  preview: {select: {title: 'empresa', subtitle: 'cargo'}},
})
