import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { SeoCollectorContext } from './components/layout/seo-meta.js';

// Render estático de una ruta para el prerender de build (scripts/prerender.mjs).
// `prerender` espera a que resuelvan los React.lazy de las páginas antes de emitir,
// así el HTML llega completo y no con el fallback de <Suspense>.
export async function render(url) {
  let meta = null;
  const { prelude } = await prerender(
    <SeoCollectorContext.Provider value={(value) => { meta = value; }}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </SeoCollectorContext.Provider>,
    {
      // Por encima del umbral por defecto (~12 kB) React saca la boundary de Suspense
      // fuera de línea (fallback visible + contenido en <div hidden> + script de swap):
      // inútil para bots sin JS e incompatible con una CSP sin inline scripts. Con un
      // umbral holgado, todo el contenido queda inline en el flujo del documento.
      progressiveChunkSize: 1024 * 1024,
    },
  );
  return { html: await new Response(prelude).text(), meta };
}
