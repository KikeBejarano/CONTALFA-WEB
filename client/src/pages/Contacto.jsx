import { useState } from 'react';
import { PageHero } from '../components/sections/PageHero.jsx';
import { SEO } from '../components/layout/SEO.jsx';
import { ContactIcon } from '../components/ui/Icons.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { seo } from '../data/seo.js';

// `website` es un honeypot: invisible para humanos; si llega con datos, el backend lo descarta.
const initialForm = { nombre: '', empresa: '', correo: '', telefono: '', servicio: '', mensaje: '', website: '' };
const services = ['Outsourcing contable', 'Impuestos y consultoría tributaria', 'Administración de nómina', 'Derecho corporativo', 'Aún no estoy seguro'];
const fieldOrder = ['nombre', 'empresa', 'correo', 'servicio', 'mensaje'];

function focusFirstError(currentErrors) {
  const first = fieldOrder.find((name) => currentErrors[name]);
  if (first) requestAnimationFrame(() => document.getElementById(`c-${first}`)?.focus());
}

function validate(values) {
  const errors = {};
  if (!values.nombre.trim()) errors.nombre = 'Indique su nombre.';
  if (!values.empresa.trim()) errors.empresa = 'Indique el nombre de la empresa.';
  if (!values.correo.trim()) errors.correo = 'Indique su correo.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) errors.correo = 'Indique un correo válido.';
  if (!values.servicio) errors.servicio = 'Seleccione un servicio.';
  if (!values.mensaje.trim()) errors.mensaje = 'Escriba un mensaje.';
  else if (values.mensaje.trim().length < 10) errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  return errors;
}

export function Contacto() {
  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [statusText, setStatusText] = useState('');

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setStatusText('');
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setStatusText('Revise los campos marcados e intente nuevamente.');
      focusFirstError(nextErrors);
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        const serverErrors = payload.errors || {};
        setErrors(serverErrors);
        setStatus('error');
        setStatusText(serverErrors.form || 'Revise los campos e intente nuevamente.');
        focusFirstError(serverErrors);
        return;
      }
      setValues(initialForm);
      setStatus('success');
      setStatusText('Mensaje enviado. Le responderemos en menos de un día hábil.');
    } catch {
      setStatus('error');
      setStatusText('No pudimos conectar con el servidor. Inténtelo nuevamente.');
    }
  }

  function fieldProps(name) {
    return {
      id: `c-${name}`,
      name,
      value: values[name],
      onChange: update,
      'aria-invalid': errors[name] ? 'true' : 'false',
      'aria-describedby': errors[name] ? `c-${name}-error` : undefined,
    };
  }

  return (
    <>
      <SEO {...seo.contacto} />
      <PageHero kicker="Contacto" title="Hablemos de su empresa." lead="Cuéntenos sobre su operación y le mostramos, sin compromiso, cómo asumir su back office contable, fiscal, de nómina y legal con el rigor de seis décadas." crumbs={[{ label: 'Contacto' }]} />
      <section className="page-section">
        <div className="wrap">
          <div className="split split--media">
            <Reveal className="form-card">
              <form onSubmit={submit} noValidate>
                {/* Honeypot anti-bot: oculto y fuera del orden de tabulación; un humano nunca lo rellena. */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                  <label htmlFor="c-website">No rellenar</label>
                  <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={update} />
                </div>
                <div className="field"><label htmlFor="c-nombre">Nombre</label><input {...fieldProps('nombre')} type="text" autoComplete="name" required />{errors.nombre && <p className="field-error" id="c-nombre-error">{errors.nombre}</p>}</div>
                <div className="field"><label htmlFor="c-empresa">Empresa</label><input {...fieldProps('empresa')} type="text" autoComplete="organization" required />{errors.empresa && <p className="field-error" id="c-empresa-error">{errors.empresa}</p>}</div>
                <div className="field"><label htmlFor="c-correo">Correo</label><input {...fieldProps('correo')} type="email" autoComplete="email" required />{errors.correo && <p className="field-error" id="c-correo-error">{errors.correo}</p>}</div>
                <div className="field"><label htmlFor="c-telefono">Teléfono</label><input {...fieldProps('telefono')} type="tel" autoComplete="tel" /></div>
                <div className="field">
                  <label htmlFor="c-servicio">Servicio de interés</label>
                  <select {...fieldProps('servicio')} required>
                    <option value="">Seleccione una opción</option>
                    {services.map((service) => <option key={service}>{service}</option>)}
                  </select>
                  {errors.servicio && <p className="field-error" id="c-servicio-error">{errors.servicio}</p>}
                </div>
                <div className="field"><label htmlFor="c-mensaje">Mensaje</label><textarea {...fieldProps('mensaje')} required />{errors.mensaje && <p className="field-error" id="c-mensaje-error">{errors.mensaje}</p>}</div>
                <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando...' : 'Enviar'}</button>
                <p className="micro">Le respondemos en menos de un día hábil. Lo que comparta se trata con absoluta reserva.</p>
                <div aria-live="polite">{statusText && <p className={`form-status ${status === 'success' ? 'form-status--success' : 'form-status--error'}`}>{statusText}</p>}</div>
              </form>
            </Reveal>
            <Reveal className="contact-info">
              <div className="row"><span className="ic" aria-hidden="true"><ContactIcon /></span><div><b>Dirección</b><span>C.C. Macaracuay Plaza, Piso 3, Torre B<br />Urb. Macaracuay, Caracas</span></div></div>
              <div className="row"><span className="ic" aria-hidden="true"><ContactIcon type="mail" /></span><div><b>Correo</b><a href="mailto:info@contalfa.com">info@contalfa.com</a></div></div>
              <div className="row"><span className="ic" aria-hidden="true"><ContactIcon type="phone" /></span><div><b>Teléfono</b><a href="tel:+582122051911">(0212) 205 19 11</a></div></div>
              <div className="row"><span className="ic" aria-hidden="true"><ContactIcon type="clock" /></span><div><b>Horario de atención</b><span>Lunes a viernes, de 8:00 a.m. a 5:00 p.m.</span></div></div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
