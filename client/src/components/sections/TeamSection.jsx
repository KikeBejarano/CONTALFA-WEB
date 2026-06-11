import { Link } from 'react-router-dom';

export function TeamSection() {
  return (
    <section id="equipo" aria-labelledby="equipo-h2" data-screen-label="Equipo">
      <div className="wrap wrap--wide">
        <div className="equipo-grid">
          <figure className="equipo-foto">
            <img src="/assets/img/corp-7433853.jpg" alt="Equipo de Contalfa trabajando en la oficina" width="1300" height="900" loading="lazy" />
          </figure>
          <div className="equipo-copy">
            <span className="overline">Cercanía</span>
            <h2 id="equipo-h2">Detrás de cada cifra hay un equipo que usted conoce por su nombre.</h2>
            <p>No somos un portal ni un centro de llamadas. Trabajamos cerca de usted: un interlocutor fijo que entiende su empresa y le responde con criterio, no con formularios.</p>
            <ul className="equipo-puntos">
              <li>Un contador responsable asignado a su cuenta, siempre disponible.</li>
              <li>Reuniones de revisión periódicas, en su oficina o en la nuestra.</li>
              <li>Respuestas claras, en lenguaje de negocio y no en jerga fiscal.</li>
            </ul>
            <p className="equipo-mas"><Link className="link" to="/nosotros">Conocer la firma <span className="arr" aria-hidden="true">→</span></Link></p>
          </div>
        </div>
      </div>
    </section>
  );
}
