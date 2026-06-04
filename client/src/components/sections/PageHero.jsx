import { Breadcrumb } from './Breadcrumb.jsx';

export function PageHero({ kicker, title, lead, crumbs = [] }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <Breadcrumb items={crumbs} />
        <span className="kicker">{kicker}</span>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
      </div>
    </section>
  );
}
