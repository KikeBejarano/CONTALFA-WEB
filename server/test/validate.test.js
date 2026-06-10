import test from 'node:test';
import assert from 'node:assert/strict';
import { clean, cleanMessage, isEmail, isHoneypotTripped, validate, VALID_SERVICES } from '../src/lib/validate.js';

const validBody = {
  nombre: 'Ana Pérez',
  empresa: 'Acme C.A.',
  correo: 'Ana@Empresa.com',
  telefono: '+58 212 555 5555',
  servicio: 'Outsourcing contable',
  mensaje: 'Necesito ayuda con la contabilidad de mi empresa.'
};

test('clean elimina CR/LF y caracteres de control (anti inyección de cabeceras)', () => {
  assert.equal(clean('Hola\r\nBcc: spam@evil.com'), 'Hola Bcc: spam@evil.com');
  assert.equal(clean('a' + String.fromCharCode(0) + 'b'), 'a b');
  assert.equal(clean('  espacios   múltiples  '), 'espacios múltiples');
});

test('clean limita la longitud al máximo indicado', () => {
  assert.equal(clean('x'.repeat(50), 10).length, 10);
});

test('clean tolera null, undefined y no-strings', () => {
  assert.equal(clean(null), '');
  assert.equal(clean(undefined), '');
  assert.equal(clean(42), '42');
});

test('cleanMessage conserva saltos de línea y elimina otros controles', () => {
  assert.equal(cleanMessage('línea 1\r\nlínea 2'), 'línea 1\nlínea 2');
  assert.equal(cleanMessage('a' + String.fromCharCode(7) + 'b'), 'a b');
  assert.equal(cleanMessage('x'.repeat(3000)).length, 2000);
});

test('isEmail acepta correos razonables y rechaza malformados', () => {
  assert.equal(isEmail('persona@empresa.com'), true);
  assert.equal(isEmail('a@b.co'), true);
  assert.equal(isEmail('sin-arroba.com'), false);
  assert.equal(isEmail('dos espacios@x.com'), false);
  assert.equal(isEmail('user@dominio'), false);
});

test('isHoneypotTripped detecta bots y deja pasar humanos', () => {
  assert.equal(isHoneypotTripped({ website: 'http://spam.example' }), true);
  assert.equal(isHoneypotTripped({ empresa_url: 'spam' }), true);
  assert.equal(isHoneypotTripped({ website: '   ' }), false);
  assert.equal(isHoneypotTripped({}), false);
});

test('validate acepta un cuerpo válido y normaliza el correo a minúsculas', () => {
  const { data, errors } = validate(validBody);
  assert.deepEqual(errors, {});
  assert.equal(data.correo, 'ana@empresa.com');
  assert.equal(data.nombre, 'Ana Pérez');
});

test('validate exige los campos obligatorios', () => {
  const { errors } = validate({});
  for (const field of ['nombre', 'empresa', 'correo', 'servicio', 'mensaje']) {
    assert.ok(errors[field], `falta error para ${field}`);
  }
});

test('validate permite teléfono vacío (es opcional)', () => {
  const { errors } = validate({ ...validBody, telefono: '' });
  assert.deepEqual(errors, {});
});

test('validate rechaza correo inválido, servicio fuera de lista y mensaje corto', () => {
  assert.ok(validate({ ...validBody, correo: 'no-es-correo' }).errors.correo);
  assert.ok(validate({ ...validBody, servicio: 'Hackear la NASA' }).errors.servicio);
  assert.ok(validate({ ...validBody, mensaje: 'corto' }).errors.mensaje);
});

test('VALID_SERVICES contiene las 5 opciones del formulario del cliente', () => {
  assert.equal(VALID_SERVICES.size, 5);
});
