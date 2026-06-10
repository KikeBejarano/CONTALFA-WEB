import { CTABand } from '../components/sections/CTABand.jsx';
import { PageHero } from '../components/sections/PageHero.jsx';
import { SEO } from '../components/layout/SEO.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { seo } from '../data/seo.js';

const systems = [
  ['ATR', 'Sistema financiero y contable', 'Sistema financiero y contable basado en la web, completamente adaptado a la realidad fiscal venezolana.'],
  ['SICA', 'Sistema de conciliaciones bancarias', 'Sistema de conciliaciones bancarias.'],
  ['SISA', 'Sistema de seguimiento de actividades', 'Sistema de seguimiento de actividades, con señales en pantalla para los supervisores.'],
  ['Validador', 'Validador de reportes fiscales', 'Valida la calidad de los reportes fiscales; detecta errores en los libros de compras y ventas.'],
  ['Sólidus', 'Sistema de nómina', 'Sistema de nómina: liquida la nómina de los empleados.'],
];

export function Tecnologia() {
  return (
    <>
      <SEO {...seo.tecnologia} />
      <PageHero kicker="Tecnología" title="Tecnología propia, pensada para Venezuela." lead="Cinco sistemas desarrollados en casa para sostener procesos contables, fiscales y laborales con trazabilidad y criterio." crumbs={[{ label: 'Tecnología' }]} />
      <section className="page-section">
        <div className="wrap">
          <div className="split split--media">
            <Reveal className="prose">
              <span className="kicker">Ingeniería propia</span>
              <h2>El software lo construimos nosotros.</h2>
              <p>La eficiencia, la seguridad y la solidez de un proceso contable solo se consolidan a través de la innovación. Por eso, a lo largo de los años, plasmamos nuestro conocimiento y experiencia en una serie de sistemas informáticos propios.</p>
              <p>No adaptamos un paquete genérico a la fuerza ni dependemos de un proveedor externo para resolver lo que cambia cada año en el país. Cuando la norma se mueve, ajustamos el sistema.</p>
            </Reveal>
            <Reveal as="figure" className="media">
              <img src="/assets/img/corp-6949934.jpg" alt="Tecnología contable de Contalfa" width="1300" height="900" loading="lazy" />
            </Reveal>
          </div>
        </div>
      </section>
      <section className="page-section page-section--mist">
        <div className="wrap">
          <div className="section-head in" data-reveal>
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
