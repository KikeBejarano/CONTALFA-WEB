import { Link } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';

export function CTABand({ title = 'Hablemos con calma de su cumplimiento.', text = 'Cuéntenos sobre su empresa y le mostraremos, sin compromiso, cómo asumir su back office con el rigor de seis décadas.', secondaryTo = '/nosotros', secondaryText = 'Conocer la firma' }) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="actions">
          <Button to="/contacto" variant="primary-on-dark">Agendar un diagnóstico</Button>
          <Link className="link link--on-dark" to={secondaryTo}>{secondaryText} <span className="arr" aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
