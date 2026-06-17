import {defineCliConfig} from 'sanity/cli'

// Config de la CLI en .ts: el loader de Sanity la transpila con su propio esbuild,
// evitando el conflicto de "type": module con archivos .js. No añade TypeScript
// al front (es solo configuración de la herramienta del Studio).
export default defineCliConfig({
  api: {
    projectId: 'hbsenmzc',
    dataset: 'production',
  },
})
