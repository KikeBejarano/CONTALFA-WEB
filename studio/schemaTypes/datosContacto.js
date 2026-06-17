import {defineType, defineField} from 'sanity'

// Documento único (singleton) con los datos de contacto compartidos.
export default defineType({
  name: 'datosContacto',
  title: 'Datos de contacto',
  type: 'document',
  fields: [
    defineField({name: 'email', title: 'Correo', type: 'string'}),
    defineField({name: 'telefonoDisplay', title: 'Teléfono (visible)', type: 'string'}),
    defineField({name: 'telefonoTel', title: 'Teléfono (enlace tel:)', type: 'string'}),
    defineField({name: 'direccion', title: 'Dirección (líneas)', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'horario', title: 'Horario', type: 'string'}),
    defineField({name: 'whatsapp', title: 'WhatsApp (número)', type: 'string'}),
  ],
  preview: {select: {title: 'email'}, prepare: ({title}) => ({title: 'Datos de contacto', subtitle: title})},
})
