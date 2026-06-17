import {defineType, defineField} from 'sanity'

// Documento único con las fotos editables del sitio (las de cada servicio van en su
// propio "Servicio"). El cliente sube/reemplaza estas imágenes desde aquí.
export default defineType({
  name: 'imagenesSitio',
  title: 'Fotos del sitio',
  type: 'document',
  fields: [
    defineField({name: 'fotoEquipo', title: 'Foto del equipo (Inicio y Nosotros)', type: 'image', options: {hotspot: true}}),
    defineField({name: 'fotoTecnologia', title: 'Foto de la página Tecnología', type: 'image', options: {hotspot: true}}),
  ],
  preview: {prepare: () => ({title: 'Fotos del sitio'})},
})
