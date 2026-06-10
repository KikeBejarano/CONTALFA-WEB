import { Reveal } from '../ui/Reveal.jsx';
import { SectionHead } from '../ui/SectionHead.jsx';

const problems = [
  ['El reparo fiscal', 'Una declaración mal soportada se convierte, meses después, en una sanción con intereses. La prevención cuesta una fracción de lo que cuesta corregir.'],
  ['El error de nómina', 'Un cálculo laboral impreciso erosiona la confianza del equipo y expone a la empresa. La nómina exige exactitud todos los meses, sin excepción.'],
  ['La exposición legal', 'Decisiones corporativas tomadas sin criterio jurídico dejan flancos abiertos. Resolverlos tarde siempre es más caro que estructurarlos a tiempo.'],
];

export function ProblemCards() {
  return (
    <section id="problema" aria-labelledby="problema-h2" data-screen-label="03 Problema">
      <div className="wrap wrap--wide">
        <SectionHead id="problema-h2" overline="Lo que está en juego" title="El riesgo rara vez avisa. Cuando lo hace, ya es un reparo.">
          Para quien firma los estados financieros, una omisión no es un detalle: es una contingencia. Nuestro oficio es que usted nunca tenga que averiguarlo de la forma difícil.
        </SectionHead>
        <Reveal className="prob-grid" stagger>
          {problems.map(([title, text]) => (
            <div className="prob-card" key={title}>
              <div className="ph"><h3>{title}</h3></div>
              <p>{text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
