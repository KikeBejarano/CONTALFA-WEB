import { Link } from 'react-router-dom';
import { ADDRESS_LINES, CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL } from '../../data/contact.js';
import { services } from '../../data/services.js';

export function Footer() {
  return (
    <footer id="site-footer" className="on-dark">
      <div className="wrap wrap--wide">
        <div className="foot-grid">
          <div className="foot-col foot-brand">
            <div className="wm"><img src="/assets/logos/alfa_2.png" alt="" width="859" height="559" /><span>CONT<b>ALFA</b></span></div>
            <p className="foot-tag">Firma contable, fiscal, de nómina y derecho corporativo para empresas venezolanas. Desde 1964.</p>
            <address className="foot-addr">
              {ADDRESS_LINES[0]}<br />
              {ADDRESS_LINES[1]}<br />
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><br />
              <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
            </address>
            <p className="foot-social"><a href="https://www.instagram.com/contalfa/" target="_blank" rel="noopener noreferrer">Síguenos en Instagram →</a></p>
          </div>
          <div className="foot-col">
            <h2>Servicios</h2>
            <ul>
              {services.map((service) => <li key={service.slug}><Link to={`/servicios/${service.slug}`}>{service.title}</Link></li>)}
            </ul>
          </div>
          <div className="foot-col">
            <h2>Tecnología</h2>
            <ul>
              {['ATR', 'SICA', 'SISA', 'Validador', 'Sólidus'].map((item) => <li key={item}><Link to="/tecnologia">{item}</Link></li>)}
            </ul>
          </div>
          <div className="foot-col">
            <h2>Empresa</h2>
            <ul>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Contalfa S.C. · RIF J-31023511-2 · Todos los derechos reservados.</span>
          <span>Caracas, Venezuela</span>
        </div>
      </div>
    </footer>
  );
}
