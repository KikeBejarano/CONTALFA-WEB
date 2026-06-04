import { Link } from 'react-router-dom';
import { Reveal } from './Reveal.jsx';

export function SectionHead({ overline, title, children, linkTo, linkText }) {
  return (
    <Reveal className="section-head">
      {overline && <span className="overline">{overline}</span>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {linkTo && <Link className="link" to={linkTo}>{linkText} <span className="arr" aria-hidden="true">→</span></Link>}
    </Reveal>
  );
}
