import {defineCliConfig} from 'sanity/cli'

// Config de la CLI en .ts: el loader de Sanity la transpila con su propio esbuild,
// evitando el conflicto de "type": module con archivos .js. No añade TypeScript
// al front (es solo configuración de la herramienta del Studio).
export default defineCliConfig({
  api: {
    projectId: 'hbsenmzc',
    dataset: 'production',
  },
  // Subdominio del Studio publicado (npx sanity deploy → https://contalfa.sanity.studio).
  // Es donde los trabajadores invitados entran a editar. Cambiable redeployando.
  studioHost: 'contalfa',
  // Sanity v6: id de la aplicación desplegada (evita el prompt en cada deploy).
  deployment: {
    appId: 'edq7nlzfcbq7i43o2bng7xfs',
  },
})
