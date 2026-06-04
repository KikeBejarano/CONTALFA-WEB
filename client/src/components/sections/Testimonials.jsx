import { Reveal } from '../ui/Reveal.jsx';
import { SectionHead } from '../ui/SectionHead.jsx';

const testimonials = [
  ['Equipo directivo', 'Poke 212', 'Tuvimos un par de situaciones que necesitaban atención inmediata, y bastaron pocos minutos de una reunión para que nos presentaran alternativas claras. Es un alivio contar con su equipo.'],
  ['Gerencia de operaciones', 'Farmarket', 'Comenzamos delegando diez sucursales, y su desempeño fue tan positivo que hoy administran nuestras veinticinco tiendas. Siempre disponibles ante cualquier requerimiento.'],
  ['Gerencia administrativa', 'Food Hall', 'Sabiendo que existe una complejidad fiscal y tributaria en Venezuela, quisimos contar con la experticia de una firma con más de sesenta años de trayectoria.'],
];

export function Testimonials() {
  return (
    <section id="prueba" aria-labelledby="prueba-h2" data-screen-label="07 Prueba social">
      <div className="wrap wrap--wide">
        <SectionHead overline="Quienes ya descansan en nosotros" title="La permanencia no se declara: se acredita." />
        <Reveal className="testi-grid" stagger>
          {testimonials.map(([name, role, quote]) => (
            <figure className="testi" key={role}>
              <span className="mark" aria-hidden="true">“</span>
              <blockquote>{quote}</blockquote>
              <figcaption><div className="name">{name}</div><div className="role">{role}</div></figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
