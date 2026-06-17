import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Configuración del Studio. projectId/dataset son públicos (no son secretos).
export default defineConfig({
  name: 'default',
  title: 'Contalfa',
  projectId: 'hbsenmzc',
  dataset: 'production',
  plugins: [structureTool(), visionTool()], // visionTool = consola GROQ para la demo
  schema: {types: schemaTypes},
})
