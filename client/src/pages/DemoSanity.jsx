import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import { sanity, urlForImage } from '../lib/sanity.js';

// Consultas GROQ: traen el contenido REAL desde Sanity en vivo (runtime, modo dev).
// En producción este mismo contenido se "hornea" en el build estático.
const QUERY_SERVICIOS = `*[_type == "servicio"]|order(orden asc){
  _id, title, subtitle, description, intro, includes, image, imageAlt
}`;
const QUERY_TESTIMONIOS = `*[_type == "testimonio"]|order(orden asc){ _id, cargo, empresa, cita }`;
const QUERY_CONTACTO = `*[_type == "datosContacto"][0]{ email, telefonoDisplay, horario }`;

export function DemoSanity() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      sanity.fetch(QUERY_SERVICIOS),
      sanity.fetch(QUERY_TESTIMONIOS),
      sanity.fetch(QUERY_CONTACTO),
    ])
      .then(([servicios, testimonios, contacto]) => setData({ servicios, testimonios, contacto }))
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <main className="wrap" style={{ padding: '4rem 0' }}>
        <p>Error al consultar Sanity: {error}</p>
        <p style={{ color: 'var(--muted)' }}>Si es un error de red/CORS, falta permitir el origen http://localhost:5173 en Sanity.</p>
      </main>
    );
  }
  if (!data) {
    return <main className="wrap" style={{ padding: '4rem 0' }}><p role="status">Cargando contenido desde Sanity…</p></main>;
  }
  if (data.servicios.length === 0 && data.testimonios.length === 0) {
    return (
      <main className="wrap" style={{ padding: '4rem 0' }}>
        <p>No hay contenido todavía — crea contenido en el Studio (en <code>studio/</code>: <code>npm run dev</code>).</p>
      </main>
    );
  }

  return (
    <main className="wrap wrap--wide" style={{ padding: '3rem 0' }}>
      <div className="section-head">
        <span className="overline">Demo · contenido en vivo desde Sanity</span>
        <h2>Servicios</h2>
      </div>
      <div className="serv-grid">
        {data.servicios.map((s) => (
          <article className="card" key={s._id}>
            {s.image && (
              <img
                src={urlForImage(s.image).width(600).height(360).fit('crop').auto('format').url()}
                alt={s.imageAlt || ''}
                width="600"
                height="360"
                style={{ borderRadius: 8, marginBottom: 12 }}
              />
            )}
            <h3>{s.title}</h3>
            {s.subtitle && <p style={{ color: 'var(--muted)' }}>{s.subtitle}</p>}
            {s.intro && <div className="prose"><PortableText value={s.intro} /></div>}
            {s.includes?.length > 0 && (
              <ul className="checks">{s.includes.map((i) => <li key={i}>{i}</li>)}</ul>
            )}
          </article>
        ))}
      </div>

      {data.testimonios.length > 0 && (
        <>
          <div className="section-head" style={{ marginTop: '2.5rem' }}>
            <span className="overline">Demo</span>
            <h2>Testimonios</h2>
          </div>
          <div className="testi-grid">
            {data.testimonios.map((t) => (
              <figure className="testi" key={t._id}>
                <blockquote>{t.cita}</blockquote>
                <figcaption><div className="name">{t.cargo}</div><div className="role">{t.empresa}</div></figcaption>
              </figure>
            ))}
          </div>
        </>
      )}

      {data.contacto && (
        <p style={{ marginTop: '2rem', color: 'var(--muted)' }}>
          Contacto (desde Sanity): {data.contacto.email} · {data.contacto.telefonoDisplay} · {data.contacto.horario}
        </p>
      )}
    </main>
  );
}
