import { Link } from 'react-router-dom';
import { ServiceIcon } from './Icons.jsx';

export function ServiceCard({ service }) {
  return (
    <Link className={`serv-card ${service.cardClass}`} to={`/servicios/${service.slug}`}>
      <div className="sh">
        <ServiceIcon name={service.icon} />
        <span className="num">{service.number}</span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <span className="link">Ver el servicio <span className="arr" aria-hidden="true">→</span></span>
    </Link>
  );
}
