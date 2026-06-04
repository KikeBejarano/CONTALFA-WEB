import { Link } from 'react-router-dom';
import { CredibilityStrip } from '../components/sections/CredibilityStrip.jsx';
import { Hero } from '../components/sections/Hero.jsx';
import { ProblemCards } from '../components/sections/ProblemCards.jsx';
import { ProcessTimeline } from '../components/sections/ProcessTimeline.jsx';
import { ServiceGrid } from '../components/sections/ServiceGrid.jsx';
import { StatsGrid } from '../components/sections/StatsGrid.jsx';
import { TeamSection } from '../components/sections/TeamSection.jsx';
import { TechTeaser } from '../components/sections/TechTeaser.jsx';
import { Testimonials } from '../components/sections/Testimonials.jsx';
import { SEO } from '../components/layout/SEO.jsx';
import { seo } from '../data/seo.js';

export function Home() {
  return (
    <>
      <SEO {...seo.home} />
      <Hero />
      <CredibilityStrip />
      <StatsGrid />
      <ProblemCards />
      <ServiceGrid showGateway />
      <ProcessTimeline />
      <TechTeaser />
      <TeamSection />
      <Testimonials />
      <section id="cierre" aria-labelledby="cierre-h2" data-screen-label="08 Cierre">
        <div className="wrap wrap--wide">
          <div className="cierre-cta in" data-reveal>
            <h2 id="cierre-h2">Hablemos con calma de su cumplimiento.</h2>
            <p>Cuéntenos sobre su empresa y le mostraremos, sin compromiso, cómo podemos asumir su back office con el rigor de seis décadas.</p>
            <div className="actions">
              <Link className="btn btn-primary" to="/contacto">Agendar un diagnóstico</Link>
              <Link className="link" to="/contacto">Escribir a la firma <span className="arr" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
