import { CTABand } from '../components/sections/CTABand.jsx';
import { PageHero } from '../components/sections/PageHero.jsx';
import { SEO } from '../components/layout/SEO.jsx';
import { Card } from '../components/ui/Card.jsx';
import { useNosotros, useSiteImages } from '../lib/useSanityContent.js';
import { nosotros as localNosotros } from '../data/nosotros.js';
import { siteImages } from '../data/siteImages.js';
import { seo } from '../data/seo.js';

const valorColors = [undefined, 'var(--navy)', 'var(--green-ink)'];

export function Nosotros() {
  const nosotros = useNosotros(localNosotros);
  const images = useSiteImages(siteImages);
  return (
    <>
      <SEO {...seo.nosotros} />
      <PageHero kicker="Nosotros" title="Seis décadas de oficio contable en Venezuela." lead="Un equipo multidisciplinario, tecnología propia y un mismo responsable para el back office de su empresa." crumbs={[{ label: 'Nosotros' }]} />
      <section className="page-section">
        <div className="wrap">
          <div className="split">
            <div className="prose">
              <h2>{nosotros.titulo}</h2>
              {nosotros.cuerpo.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
            </div>
            <figure className="media media--tall">
              <img src={images.fotoEquipo} alt="Equipo Contalfa" width="1300" height="900" loading="lazy" />
              <figcaption>Contalfa · Caracas</figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="page-section page-section--mist">
        <div className="wrap">
          <div className="stat-row">
            <div className="s"><div className="n"><span className="pre">+</span>60</div><p className="lab">años de trayectoria</p></div>
            <div className="s"><div className="n"><span className="pre">+</span>1.000</div><p className="lab">empresas atendidas</p></div>
            <div className="s"><div className="n">5</div><p className="lab">sistemas propios</p></div>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="wrap">
          <div className="section-head">
            <span className="overline">Cómo trabajamos</span>
            <h2 className="t-h2-display">Nuestros valores, en cada cierre.</h2>
          </div>
          <div className="cards">
            {nosotros.valores.map((valor, index) => (
              <Card key={valor.titulo} title={valor.titulo} text={valor.texto} color={valorColors[index % valorColors.length]} />
            ))}
          </div>
        </div>
      </section>
      <CTABand title="Conversemos sobre su empresa, con calma." text="Cuéntenos sobre su operación y le mostraremos, sin compromiso, cómo asumir su back office con el rigor de seis décadas." />
    </>
  );
}
