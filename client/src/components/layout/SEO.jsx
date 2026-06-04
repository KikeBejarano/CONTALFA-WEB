import { useLocation } from 'react-router-dom';

// React 19 eleva automáticamente <title>/<meta>/<link> al <head>; no hace falta react-helmet.
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://contalfa.com';
const SITE_NAME = 'Contalfa';
const DEFAULT_IMAGE = '/assets/img/corp-6950031.jpg';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AccountingService',
  name: 'Contalfa S.C.',
  description:
    'Firma contable, fiscal, de nómina y derecho corporativo para empresas venezolanas. Desde 1964.',
  url: SITE_URL,
  email: 'info@contalfa.com',
  telephone: '+582122051911',
  foundingDate: '1964',
  areaServed: 'VE',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'C.C. Macaracuay Plaza, Piso 3, Torre B, Urb. Macaracuay',
    addressLocality: 'Caracas',
    addressCountry: 'VE',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '17:00',
  },
};

export function SEO({ title, description, image = DEFAULT_IMAGE }) {
  const { pathname } = useLocation();
  const canonical = `${SITE_URL}${pathname}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_VE" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
    </>
  );
}
