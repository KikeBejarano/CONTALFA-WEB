import { CTABand } from '../components/sections/CTABand.jsx';
import { PageHero } from '../components/sections/PageHero.jsx';
import { SEO } from '../components/layout/SEO.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { seo } from '../data/seo.js';

export function Nosotros() {
  return (
    <>
      <SEO {...seo.nosotros} />
      <PageHero kicker="Nosotros" title="Seis décadas de oficio contable en Venezuela." lead="Un equipo multidisciplinario, tecnología propia y un mismo responsable para el back office de su empresa." crumbs={[{ label: 'Nosotros' }]} />
      <section className="page-section">
        <div className="wrap">
          <div className="split">
            <Reveal className="prose">
              <h2>Quiénes somos</h2>
              <p>Contalfa nació con una convicción simple: una empresa crece cuando deja de invertir su tiempo en lo transaccional y lo dedica a entender su mercado y a mejorar su operación. Ese ha sido nuestro oficio durante más de seis décadas.</p>
              <p>A lo largo de más de sesenta años hemos atendido a más de 1.000 empresas en Caracas y en todo el país, consolidando una práctica que combina el rigor profesional con tecnología propia.</p>
              <p>Hoy somos un solo responsable del <strong>back office</strong> de nuestros clientes: contabilidad, impuestos, nómina y derecho corporativo, coordinados de verdad bajo un mismo techo.</p>
            </Reveal>
            <Reveal as="figure" className="media media--tall">
              <img src="/assets/img/corp-7433853.jpg" alt="Equipo Contalfa" width="1300" height="900" loading="lazy" />
              <figcaption>Contalfa · Caracas</figcaption>
            </Reveal>
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
          <div className="section-head in" data-reveal>
            <span className="overline">Cómo trabajamos</span>
            <h2 className="t-h2-display">Nuestros valores, en cada cierre.</h2>
          </div>
          <div className="cards">
            <Card title="Rigor" text="Procesos contables confiables y trazables, sostenidos por seis décadas de práctica y por tecnología propia adaptada al marco fiscal venezolano." />
            <Card title="Cercanía" text="Un mismo responsable que conoce su empresa, le anticipa lo que viene y le responde con criterio, en lenguaje de negocio y no en jerga." color="var(--navy)" />
            <Card title="Discreción" text="Resguardamos su información con el cuidado que exige la dirección de una empresa. La confianza se construye con prudencia y constancia." color="var(--green-ink)" />
          </div>
        </div>
      </section>
      <CTABand title="Conversemos sobre su empresa, con calma." text="Cuéntenos sobre su operación y le mostraremos, sin compromiso, cómo asumir su back office con el rigor de seis décadas." />
    </>
  );
}
