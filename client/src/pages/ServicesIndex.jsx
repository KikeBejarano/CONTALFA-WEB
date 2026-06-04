import { CTABand } from '../components/sections/CTABand.jsx';
import { PageHero } from '../components/sections/PageHero.jsx';
import { ProcessTimeline } from '../components/sections/ProcessTimeline.jsx';
import { ServiceGrid } from '../components/sections/ServiceGrid.jsx';
import { TechTeaser } from '../components/sections/TechTeaser.jsx';
import { SEO } from '../components/layout/SEO.jsx';
import { seo } from '../data/seo.js';

export function ServicesIndex() {
  return (
    <>
      <SEO {...seo.servicios} />
      <PageHero
        kicker="Servicios"
        title="Una sola firma, cuatro frentes de cumplimiento."
        lead="Asumimos su back office completo —contable, fiscal, laboral y legal— bajo un mismo criterio y un mismo responsable, con el rigor de seis décadas y tecnología propia."
        crumbs={[{ label: 'Servicios' }]}
      />
      <ServiceGrid />
      <ProcessTimeline compact />
      <TechTeaser page />
      <CTABand />
    </>
  );
}
