import { useCountUp } from '../../hooks/useCountUp.js';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHead } from '../ui/SectionHead.jsx';

function Stat({ pre, target, sep, label }) {
  const value = useCountUp(target, { sep });
  return (
    <div className="stat">
      <div className="n">{pre && <span className="pre">{pre}</span>}<span className="count">{value}</span></div>
      <p className="lab">{label}</p>
    </div>
  );
}

export function StatsGrid() {
  return (
    <section id="cifras" aria-labelledby="cifras-h2" data-screen-label="02 Cifras">
      <div className="wrap wrap--wide">
        <SectionHead overline="Lo que sostiene la confianza" title="La permanencia no se declara: se acredita." />
        <Reveal className="stats-grid" stagger>
          <Stat pre="+" target={60} label="Años ejerciendo en Venezuela — hemos visto cada reforma fiscal." />
          <Stat pre="+" target={1000} sep label="Empresas que confían su cumplimiento a la firma." />
          <Stat target={5} label="Sistemas contables propios, desarrollados en casa." />
        </Reveal>
      </div>
    </section>
  );
}
