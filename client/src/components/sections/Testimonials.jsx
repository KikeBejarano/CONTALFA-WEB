import { SectionHead } from '../ui/SectionHead.jsx';
import { useTestimonials } from '../../lib/useSanityContent.js';
import { testimonials as localTestimonials } from '../../data/testimonials.js';

export function Testimonials() {
  const testimonials = useTestimonials(localTestimonials);
  return (
    <section id="prueba" aria-labelledby="prueba-h2" data-screen-label="07 Prueba social">
      <div className="wrap wrap--wide">
        <SectionHead id="prueba-h2" overline="Quienes ya descansan en nosotros" title="La permanencia no se declara: se acredita." />
        <div className="testi-grid">
          {testimonials.map(([name, role, quote]) => (
            <figure className="testi" key={role}>
              <span className="mark" aria-hidden="true">“</span>
              <blockquote>{quote}</blockquote>
              <figcaption><div className="name">{name}</div><div className="role">{role}</div></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
