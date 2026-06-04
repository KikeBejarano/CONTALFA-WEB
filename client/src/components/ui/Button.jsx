import { Link } from 'react-router-dom';

const variants = {
  primary: 'btn btn-primary',
  'primary-on-dark': 'btn btn-primary-on-dark',
  secondary: 'btn',
};

export function Button({ to, href, variant = 'primary', children, ...props }) {
  const className = variants[variant] || variants.primary;
  if (to) return <Link className={className} to={to} {...props}>{children}</Link>;
  if (href) return <a className={className} href={href} {...props}>{children}</a>;
  return <button className={className} {...props}>{children}</button>;
}
