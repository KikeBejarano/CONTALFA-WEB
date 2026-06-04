import { services } from '../../data/services.js';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHead } from '../ui/SectionHead.jsx';
import { ServiceCard } from '../ui/ServiceCard.jsx';

export function ServiceGrid({ showGateway = false }) {
  return (
    <section id="servicios" aria-labelledby="servicios-h2" data-screen-label="04 Servicios">
      <div className="wrap wrap--wide">
        <SectionHead overline="Qué hacemos" title="Una sola firma, cuatro frentes de cumplimiento." linkTo={showGateway ? '/servicios' : undefined} linkText="Ver todos los servicios">
          Asumimos su back office completo —contable, fiscal, laboral y legal— bajo un mismo criterio y un mismo responsable.
        </SectionHead>
        <Reveal className="serv-grid" stagger>
          {services.map((service) => <ServiceCard key={service.slug} service={service} />)}
        </Reveal>
      </div>
    </section>
  );
}
