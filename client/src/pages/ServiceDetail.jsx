import { Link, useParams } from 'react-router-dom';
import { CTABand } from '../components/sections/CTABand.jsx';
import { PageHero } from '../components/sections/PageHero.jsx';
import { SEO } from '../components/layout/SEO.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { getService, services } from '../data/services.js';
import { NotFound } from './NotFound.jsx';

const colors = ['var(--teal)', 'var(--navy)', 'var(--green-ink)'];

export function ServiceDetail() {
  const { slug } = useParams();
  const service = getService(slug);
  if (!service) return <NotFound />;

  const related = services.filter((item) => item.slug !== service.slug);

  return (
    <>
      <SEO title={`${service.title} — Contalfa`} description={service.metaDescription} />
      <PageHero
        kicker="Servicio"
        title={service.heroTitle}
        lead={service.description}
        crumbs={[{ label: 'Servicios', to: '/servicios' }, { label: service.title }]}
      />
      <section className="page-section">
        <div className="wrap">
          <div className="split">
            <Reveal className="prose">
              {service.intro.map((text) => <p key={text}>{text}</p>)}
              <h2>Para quién es</h2>
              <p>{service.forWhom}</p>
            </Reveal>
            <Reveal as="aside" className="split-aside">
              <div className="panel">
                <h4>Incluye</h4>
                <ul className="checks">{service.includes.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="page-section page-section--mist">
        <div className="wrap">
          <div className="split split--media">
            <Reveal as="figure" className="media">
              <img src={service.image} alt={service.imageAlt} width="1300" height="900" loading="lazy" />
            </Reveal>
            <Reveal className="prose">
              <span className="kicker">Cercanía</span>
              <h2>{service.closenessTitle}</h2>
              <p>{service.closenessText}</p>
              <ul className="checks">{service.closeness.map((item) => <li key={item}>{item}</li>)}</ul>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="wrap">
          <div className="section-head in" data-reveal>
            <span className="overline">Otros servicios</span>
            <h2 className="t-h2-display">Bajo un mismo criterio y un mismo responsable.</h2>
          </div>
          <div className="cards">
            {related.map((item, index) => (
              <Link className="card card--link" to={`/servicios/${item.slug}`} style={{ borderTopColor: colors[index % colors.length] }} key={item.slug}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="link">Ver el servicio <span className="arr" aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="page-section page-section--mist">
        <div className="wrap">
          <div className="section-head in" data-reveal>
            <span className="overline">{service.detailOverline}</span>
            <h2 className="t-h2-display">{service.detailTitle}</h2>
            {service.detailText && <p>{service.detailText}</p>}
          </div>
          <div className="cards">
            {service.detailCards.map((card, index) => <Card key={card.title} {...card} color={colors[index % colors.length]} />)}
          </div>
        </div>
      </section>
      <CTABand title={service.ctaTitle} text={service.ctaText} secondaryTo="/tecnologia" secondaryText="Conocer nuestra tecnología" />
    </>
  );
}
