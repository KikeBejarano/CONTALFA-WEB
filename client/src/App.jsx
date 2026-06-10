import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout.jsx';
import { ScrollToTop } from './components/layout/ScrollToTop.jsx';

const Contacto = lazy(() => import('./pages/Contacto.jsx').then((module) => ({ default: module.Contacto })));
const Home = lazy(() => import('./pages/Home.jsx').then((module) => ({ default: module.Home })));
const NotFound = lazy(() => import('./pages/NotFound.jsx').then((module) => ({ default: module.NotFound })));
const Nosotros = lazy(() => import('./pages/Nosotros.jsx').then((module) => ({ default: module.Nosotros })));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail.jsx').then((module) => ({ default: module.ServiceDetail })));
const ServicesIndex = lazy(() => import('./pages/ServicesIndex.jsx').then((module) => ({ default: module.ServicesIndex })));
const Tecnologia = lazy(() => import('./pages/Tecnologia.jsx').then((module) => ({ default: module.Tecnologia })));

function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<div className="route-loading" role="status">Cargando...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicios" element={<ServicesIndex />} />
            <Route path="/servicios/:slug" element={<ServiceDetail />} />
            <Route path="/tecnologia" element={<Tecnologia />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}

export default App;
