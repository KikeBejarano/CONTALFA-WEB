import { Link } from 'react-router-dom';

export function Breadcrumb({ items }) {
  return (
    <nav className="crumbs" aria-label="Ruta">
      <Link to="/">Inicio</Link>
      {items.map((item) => (
        <span key={item.label}>
          <span className="sep">/</span>
          {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
        </span>
      ))}
    </nav>
  );
}
