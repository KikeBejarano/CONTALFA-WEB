import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO por página',
  type: 'document',
  fields: [
    defineField({name: 'pagina', title: 'Página', type: 'string', description: 'home, servicios, nosotros, tecnologia, contacto', validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
  ],
  preview: {select: {title: 'pagina', subtitle: 'title'}},
})
