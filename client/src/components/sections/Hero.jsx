import { Link } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { Reveal } from '../ui/Reveal.jsx';

export function Hero() {
  return (
    <section id="hero" className="band-navy hero--media" aria-labelledby="hero-h1" data-screen-label="01 Hero">
      <div className="wrap wrap--wide">
        <div className="hero-grid">
          <div className="hero-copy">
            <Reveal as="span" className="overline">Firma contable · Caracas · desde 1964</Reveal>
            <Reveal as="h1" id="hero-h1">Seis décadas cuidando las finanzas de las empresas venezolanas.</Reveal>
            <Reveal as="p" className="lede">Outsourcing contable, impuestos, nómina y derecho corporativo, con tecnología propia. Más de 1.000 empresas confían su cumplimiento a Contalfa.</Reveal>
            <Reveal className="hero-actions">
              <Button to="/contacto" variant="primary-on-dark">Agendar un diagnóstico</Button>
              <Link className="link link--on-dark" to="/servicios">Ver nuestros servicios <span className="arr" aria-hidden="true">→</span></Link>
            </Reveal>
          </div>
          <div className="hero-stage" aria-hidden="true">
            <figure className="brand-plate">
              <span className="bp-kicker">Firma contable</span>
              <div className="bp-mark"><img src="/assets/logos/alfa_2.png" alt="" width="859" height="559" /></div>
              <span className="bp-rule"></span>
              <figcaption className="bp-cap">Fundada en 1964 · Caracas, Venezuela</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
