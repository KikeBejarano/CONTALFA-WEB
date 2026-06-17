import {defineType, defineField, defineArrayMember} from 'sanity'

// Servicio: el contenido más rico del sitio. `intro` es Portable Text (texto
// enriquecido) para mostrar esa capacidad; el resto, campos simples y listas.
export default defineType({
  name: 'servicio',
  title: 'Servicio',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Título', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'orden', title: 'Orden', type: 'number'}),
    defineField({name: 'subtitle', title: 'Subtítulo', type: 'string'}),
    defineField({name: 'heroTitle', title: 'Título del hero', type: 'string'}),
    defineField({name: 'description', title: 'Descripción corta', type: 'text', rows: 2}),
    defineField({name: 'metaDescription', title: 'Meta descripción (SEO)', type: 'text', rows: 2}),
    defineField({name: 'intro', title: 'Introducción (texto enriquecido)', type: 'array', of: [defineArrayMember({type: 'block'})]}),
    defineField({name: 'forWhom', title: 'Para quién es', type: 'text', rows: 3}),
    defineField({name: 'includes', title: 'Incluye', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'image', title: 'Imagen', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imageAlt', title: 'Texto alternativo de la imagen', type: 'string'}),
    defineField({name: 'closenessTitle', title: 'Cercanía · título', type: 'string'}),
    defineField({name: 'closenessText', title: 'Cercanía · texto', type: 'text', rows: 3}),
    defineField({name: 'closeness', title: 'Cercanía · puntos', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'detailOverline', title: 'Detalle · sobretítulo', type: 'string'}),
    defineField({name: 'detailTitle', title: 'Detalle · título', type: 'string'}),
    defineField({name: 'detailText', title: 'Detalle · texto', type: 'text', rows: 2}),
    defineField({
      name: 'detailCards',
      title: 'Modalidades / detalle',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        name: 'modalidad',
        fields: [
          {name: 'title', title: 'Título', type: 'string'},
          {name: 'text', title: 'Texto', type: 'text', rows: 2},
          {name: 'items', title: 'Ítems', type: 'array', of: [{type: 'string'}]},
        ],
      })],
    }),
    defineField({name: 'ctaTitle', title: 'CTA · título', type: 'string'}),
    defineField({name: 'ctaText', title: 'CTA · texto', type: 'text', rows: 2}),
  ],
  orderings: [{title: 'Orden', name: 'ordenAsc', by: [{field: 'orden', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'subtitle', media: 'image'}},
})
