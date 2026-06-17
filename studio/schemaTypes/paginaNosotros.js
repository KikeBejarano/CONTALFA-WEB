import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'paginaNosotros',
  title: 'Página Nosotros',
  type: 'document',
  fields: [
    defineField({name: 'titulo', title: 'Título', type: 'string'}),
    defineField({name: 'cuerpo', title: 'Cuerpo (texto enriquecido)', type: 'array', of: [{type: 'block'}]}),
    defineField({
      name: 'valores',
      title: 'Valores',
      type: 'array',
      of: [{type: 'object', name: 'valor', fields: [
        {name: 'titulo', title: 'Título', type: 'string'},
        {name: 'texto', title: 'Texto', type: 'text', rows: 2},
      ]}],
    }),
  ],
  preview: {prepare: () => ({title: 'Página Nosotros'})},
})
