import { Link } from 'react-router-dom';
import { Reveal } from '../ui/Reveal.jsx';

export function TechTeaser({ page = false }) {
  if (page) {
    return (
      <section className="page-section">
        <div className="wrap">
          <div className="split split--media">
            <Reveal className="prose">
              <span className="kicker">Ingeniería propia</span>
              <h2>Cada servicio se apoya en tecnología propia.</h2>
              <p>Desarrollamos en casa el software con el que llevamos su contabilidad, sus impuestos y su nómina —ATR, SICA, SISA, Validador y Sólidus—, adaptado a la realidad fiscal venezolana y sin depender de terceros.</p>
              <p><Link className="link" to="/tecnologia">Conocer nuestra tecnología <span className="arr" aria-hidden="true">→</span></Link></p>
            </Reveal>
            <Reveal as="aside" className="split-aside">
              <div className="panel">
                <h4>Sistemas propios</h4>
                <ul className="checks">
                  {['ATR — sistema financiero y contable', 'SICA — conciliaciones bancarias', 'SISA — seguimiento de actividades', 'Validador — calidad de reportes fiscales', 'Sólidus — sistema de nómina'].map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tecnologia" className="band-navy" aria-labelledby="tecnologia-h2" data-screen-label="06 Tecnología">
      <div className="wrap wrap--wide">
        <div className="tech-head">
          <Reveal className="copy">
            <span className="overline">Ingeniería propia</span>
            <h2 id="tecnologia-h2">Por dentro, nuestra firma está hecha de datos.</h2>
            <p>La sub-marca <span className="alpha-word">alpha</span> reúne cinco sistemas desarrollados en casa, pensados para la realidad fiscal venezolana. No dependemos de terceros para resguardar lo suyo.</p>
          </Reveal>
          <Reveal className="tech-stage" aria-hidden="true">
            <div className="alpha-emblem"><img src="/assets/logos/alpha_white.png" alt="" width="591" height="236" /></div>
          </Reveal>
        </div>
        <Reveal className="tech-cta">
          <Link className="link link--on-dark" to="/tecnologia">Conocer nuestra tecnología <span className="arr" aria-hidden="true">→</span></Link>
        </Reveal>
      </div>
    </section>
  );
}
