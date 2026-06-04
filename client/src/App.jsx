import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout.jsx';
import { ScrollToTop } from './components/layout/ScrollToTop.jsx';
import { Contacto } from './pages/Contacto.jsx';
import { Home } from './pages/Home.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { Nosotros } from './pages/Nosotros.jsx';
import { ServiceDetail } from './pages/ServiceDetail.jsx';
import { ServicesIndex } from './pages/ServicesIndex.jsx';
import { Tecnologia } from './pages/Tecnologia.jsx';

function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<ServicesIndex />} />
          <Route path="/servicios/:slug" element={<ServiceDetail />} />
          <Route path="/tecnologia" element={<Tecnologia />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
