import { useScrollProgress } from '../../hooks/useScrollProgress.js';
import { SectionHead } from '../ui/SectionHead.jsx';

const steps = [
  ['Diagnóstico', 'Revisamos su situación contable, fiscal y laboral, y le devolvemos un mapa claro de riesgos y prioridades.'],
  ['Transición', 'Asumimos sus procesos sin interrumpir la operación, con un plan ordenado y plazos comprometidos.'],
  ['Operación', 'Ejecutamos el cumplimiento mensual con cifras cuadradas, reportes a tiempo y un único interlocutor.'],
  ['Acompañamiento', 'Anticipamos cambios normativos y le aconsejamos antes de que sean un problema. Criterio, no solo registro.'],
];

export function ProcessTimeline({ compact = false }) {
  const { ref, progress, litCount } = useScrollProgress(steps.length);

  if (compact) {
    return (
      <section className="page-section page-section--mist">
        <div className="wrap">
          <SectionHead overline="Cómo trabajamos" title="Hay método detrás de la tranquilidad.">
            Un acompañamiento ordenado, del primer diagnóstico al cumplimiento sostenido.
          </SectionHead>
          <div className="cards cards--2">
            {steps.map(([title, text], index) => <div className="card" key={title}><span className="num">0{index + 1}</span><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="proceso" aria-labelledby="proceso-h2" data-screen-label="05 Proceso">
      <div className="wrap wrap--wide">
        <SectionHead overline="Cómo trabajamos" title="Hay método detrás de la tranquilidad.">
          Un acompañamiento ordenado, del primer diagnóstico al cumplimiento sostenido.
        </SectionHead>
        <div className="proc in" id="proc" ref={ref} data-reveal>
          <div className="proc-line" aria-hidden="true"><span className="fill" style={{ width: `${progress * 100}%` }}></span></div>
          {steps.map(([title, text], index) => (
            <div className={`proc-step ${index < litCount ? 'lit' : ''}`} key={title}>
              <div className="proc-node">0{index + 1}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
