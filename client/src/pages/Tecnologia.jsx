import { CTABand } from '../components/sections/CTABand.jsx';
import { PageHero } from '../components/sections/PageHero.jsx';
import { SEO } from '../components/layout/SEO.jsx';
import { Card } from '../components/ui/Card.jsx';
import { seo } from '../data/seo.js';
import { useSystems } from '../lib/useSanityContent.js';
import { systems as localSystems } from '../data/systems.js';

export function Tecnologia() {
  const systems = useSystems(localSystems);
  return (
    <>
      <SEO {...seo.tecnologia} />
      <PageHero kicker="Tecnología" title="Tecnología propia, pensada para Venezuela." lead="Cinco sistemas desarrollados en casa para sostener procesos contables, fiscales y laborales con trazabilidad y criterio." crumbs={[{ label: 'Tecnología' }]} />
      <section className="page-section">
        <div className="wrap">
          <div className="split split--media">
            <div className="prose">
              <span className="kicker">Ingeniería propia</span>
              <h2>El software lo construimos nosotros.</h2>
              <p>La eficiencia, la seguridad y la solidez de un proceso contable solo se consolidan a través de la innovación. Por eso, a lo largo de los años, plasmamos nuestro conocimiento y experiencia en una serie de sistemas informáticos propios.</p>
              <p>No adaptamos un paquete genérico a la fuerza ni dependemos de un proveedor externo para resolver lo que cambia cada año en el país. Cuando la norma se mueve, ajustamos el sistema.</p>
            </div>
            <figure className="media">
              <img src="/assets/img/corp-6949934.jpg" alt="Tecnología contable de Contalfa" width="1300" height="900" loading="lazy" />
            </figure>
          </div>
        </div>
      </section>
      <section className="page-section page-section--mist">
        <div className="wrap">
          <div className="section-head">
            <span className="overline">Sistemas propios</span>
            <h2 className="t-h2-display">Cinco sistemas, un mismo criterio.</h2>
          </div>
          <div className="cards">
            {systems.map(([name, title, text], index) => <Card key={name} title={`${name} · ${title}`} text={text} color={index % 2 ? 'var(--navy)' : 'var(--teal)'} />)}
          </div>
        </div>
      </section>
      <CTABand title="Vea por dentro la tecnología que sostiene su contabilidad." text="Le mostramos cómo nuestros sistemas propios se integran con su operación y qué ganaría su empresa al apoyarse en ellos. Sin compromiso." />
    </>
  );
}
