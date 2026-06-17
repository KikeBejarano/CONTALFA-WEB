// Genera seed.ndjson con el contenido REAL de Contalfa para importar al dataset.
// Toma servicios/seo/contacto de los archivos de datos del front e incluye en línea
// testimonios y sistemas (hoy hardcodeados en componentes). No sube imágenes: se
// añaden luego en el Studio (buen momento para la demo en vivo).
import {writeFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {services} from '../../client/src/data/services.js'
import {seo} from '../../client/src/data/seo.js'
import {
  CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, ADDRESS_LINES, SCHEDULE, WHATSAPP_NUMBER,
} from '../../client/src/data/contact.js'

let n = 0
const key = () => `k${(n++).toString(36)}`

// Párrafos (strings) -> bloques de Portable Text.
const toPT = (paragraphs) =>
  paragraphs.map((text) => ({
    _type: 'block', _key: key(), style: 'normal', markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }))

const docs = []

services.forEach((s, i) => {
  docs.push({
    _id: `servicio-${s.slug}`,
    _type: 'servicio',
    title: s.title,
    slug: {_type: 'slug', current: s.slug},
    orden: i + 1,
    subtitle: s.subtitle,
    heroTitle: s.heroTitle,
    description: s.description,
    metaDescription: s.metaDescription,
    intro: toPT(s.intro),
    forWhom: s.forWhom,
    includes: s.includes,
    imageAlt: s.imageAlt,
    closenessTitle: s.closenessTitle,
    closenessText: s.closenessText,
    closeness: s.closeness,
    detailCards: (s.detailCards || []).map((c) => ({
      _type: 'modalidad', _key: key(), title: c.title, text: c.text, items: c.items,
    })),
    ctaTitle: s.ctaTitle,
    ctaText: s.ctaText,
  })
})

const testimonios = [
  ['Equipo directivo', 'Poke 212', 'Tuvimos un par de situaciones que necesitaban atención inmediata, y bastaron pocos minutos de una reunión para que nos presentaran alternativas claras. Es un alivio contar con su equipo.'],
  ['Gerencia de operaciones', 'Farmarket', 'Comenzamos delegando diez sucursales, y su desempeño fue tan positivo que hoy administran nuestras veinticinco tiendas. Siempre disponibles ante cualquier requerimiento.'],
  ['Gerencia administrativa', 'Food Hall', 'Sabiendo que existe una complejidad fiscal y tributaria en Venezuela, quisimos contar con la experticia de una firma con más de sesenta años de trayectoria.'],
]
testimonios.forEach(([cargo, empresa, cita], i) => {
  docs.push({_id: `testimonio-${i + 1}`, _type: 'testimonio', cargo, empresa, cita, orden: i + 1})
})

const sistemas = [
  ['ATR', 'Sistema financiero y contable', 'Sistema financiero y contable basado en la web, completamente adaptado a la realidad fiscal venezolana.'],
  ['SICA', 'Sistema de conciliaciones bancarias', 'Sistema de conciliaciones bancarias.'],
  ['SISA', 'Sistema de seguimiento de actividades', 'Sistema de seguimiento de actividades, con señales en pantalla para los supervisores.'],
  ['Validador', 'Validador de reportes fiscales', 'Valida la calidad de los reportes fiscales; detecta errores en los libros de compras y ventas.'],
  ['Sólidus', 'Sistema de nómina', 'Sistema de nómina: liquida la nómina de los empleados.'],
]
sistemas.forEach(([nombre, titulo, descripcion], i) => {
  docs.push({_id: `sistema-${i + 1}`, _type: 'sistema', nombre, titulo, descripcion, orden: i + 1})
})

docs.push({
  _id: 'datosContacto',
  _type: 'datosContacto',
  email: CONTACT_EMAIL,
  telefonoDisplay: PHONE_DISPLAY,
  telefonoTel: PHONE_TEL,
  direccion: ADDRESS_LINES,
  horario: SCHEDULE,
  whatsapp: WHATSAPP_NUMBER,
})

Object.entries(seo).forEach(([pagina, v]) => {
  docs.push({_id: `seo-${pagina}`, _type: 'seo', pagina, title: v.title, description: v.description})
})

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n'
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed.ndjson')
await writeFile(out, ndjson, 'utf8')
console.log(`seed.ndjson generado: ${docs.length} documentos`)
