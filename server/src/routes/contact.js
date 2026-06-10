import { Router } from 'express';
import { logger } from '../lib/logger.js';
import { sendLead } from '../lib/mailer.js';
import { isHoneypotTripped, validate } from '../lib/validate.js';

const router = Router();

router.post('/', async (req, res) => {
  const body = req.body || {};

  // Honeypot disparado: respondemos 200 "ok" para no revelar el filtro al bot,
  // pero NO enviamos correo.
  if (isHoneypotTripped(body)) {
    return res.json({ ok: true, errors: {} });
  }

  const { data, errors } = validate(body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  try {
    const delivery = await sendLead(data);
    logger.info('[contact] lead entregado', delivery.messageId);
    return res.json({ ok: true, errors: {}, delivery });
  } catch (error) {
    if (error?.code === 'SMTP_NOT_CONFIGURED') {
      logger.error('[contact] configuración incompleta:', error.message);
      return res.status(503).json({
        ok: false,
        errors: { form: 'El canal de contacto no está configurado. Inténtelo nuevamente más tarde.' }
      });
    }

    logger.error('[contact]', error?.message || error);
    return res.status(500).json({
      ok: false,
      errors: { form: 'No pudimos enviar el mensaje. Inténtelo nuevamente.' }
    });
  }
});

export default router;
