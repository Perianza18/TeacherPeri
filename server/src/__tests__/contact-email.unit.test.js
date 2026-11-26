// Pruebas de server/src/lib/contactEmail.js: el formato del aviso por correo
// y cuándo se manda (sin red: fetch es falso).
import { describe, it, expect, vi } from 'vitest'
import { buildContactEmail, formatearFecha, sendContactEmail, DEFAULT_TO, DEFAULT_FROM } from '../lib/contactEmail.js'

const autor = { username: 'ana_mx', email: 'ana@correo.com' }
const mensaje = {
  perfil: 'Otro',
  perfilOtro: 'Directora de escuela',
  motivo: 'Duda sobre extranjero',
  mensaje: '¿Qué exámenes piden en Canadá?',
  createdAt: new Date('2026-11-26T21:40:00Z'),
}

describe('buildContactEmail', () => {
  it('arma asunto, cuerpo y respuesta con el formato acordado', () => {
    const { subject, text, replyTo } = buildContactEmail(mensaje, autor)
    expect(subject).toBe('[Contacto TeacherPeri] Duda sobre extranjero · @ana_mx')
    expect(replyTo).toBe('ana@correo.com')
    expect(text).toBe([
      'Nuevo mensaje desde la página Contacto',
      '',
      'Usuario:   @ana_mx',
      'Correo:    ana@correo.com',
      '¿Quién eres?: Otro: Directora de escuela',
      'Motivo:    Duda sobre extranjero',
      'Fecha:     26 nov 2026, 15:40 (hora de CDMX)',
      '',
      'Mensaje:',
      '------------------------------',
      '¿Qué exámenes piden en Canadá?',
      '------------------------------',
      '',
    ].join('\n'))
  })

  it('muestra la descripción de «Otro» en el motivo y el asunto', () => {
    const { subject, text } = buildContactEmail({ ...mensaje, motivo: 'Otro', motivoOtro: 'Invitar\na un taller' }, autor)
    expect(subject).toBe('[Contacto TeacherPeri] Otro: Invitar a un taller · @ana_mx')
    expect(text).toContain('Motivo:    Otro: Invitar\na un taller')
  })

  it('aguanta un autor sin datos', () => {
    const { subject, replyTo } = buildContactEmail(mensaje, null)
    expect(subject).toContain('(usuario desconocido)')
    expect(replyTo).toBeUndefined()
  })
})

describe('formatearFecha', () => {
  it('usa la hora de la Ciudad de México', () => {
    expect(formatearFecha('2026-01-05T06:05:00Z')).toBe('5 ene 2026, 00:05 (hora de CDMX)')
  })
})

describe('sendContactEmail', () => {
  it('no manda nada sin RESEND_API_KEY', async () => {
    const fetchImpl = vi.fn()
    const res = await sendContactEmail(mensaje, autor, { env: {}, fetchImpl })
    expect(res.sent).toBe(false)
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('llama a Resend con remitente, destino y reply_to', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true })
    const res = await sendContactEmail(mensaje, autor, { env: { RESEND_API_KEY: 'k' }, fetchImpl })
    expect(res).toEqual({ sent: true })
    const [url, opciones] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect(opciones.headers.Authorization).toBe('Bearer k')
    const cuerpo = JSON.parse(opciones.body)
    expect(cuerpo.from).toBe(DEFAULT_FROM)
    expect(cuerpo.to).toEqual([DEFAULT_TO])
    expect(cuerpo.reply_to).toBe('ana@correo.com')
    expect(cuerpo.subject).toContain('@ana_mx')
  })

  it('respeta CONTACT_EMAIL_TO y CONTACT_EMAIL_FROM', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true })
    await sendContactEmail(mensaje, autor, {
      env: { RESEND_API_KEY: 'k', CONTACT_EMAIL_TO: 'otro@x.com', CONTACT_EMAIL_FROM: 'X <a@x.com>' },
      fetchImpl,
    })
    const cuerpo = JSON.parse(fetchImpl.mock.calls[0][1].body)
    expect(cuerpo.to).toEqual(['otro@x.com'])
    expect(cuerpo.from).toBe('X <a@x.com>')
  })

  it('no lanza si Resend falla o la red se cae', async () => {
    const mal = vi.fn().mockResolvedValue({ ok: false, status: 403, text: async () => 'dominio sin verificar' })
    expect(await sendContactEmail(mensaje, autor, { env: { RESEND_API_KEY: 'k' }, fetchImpl: mal }))
      .toEqual({ sent: false, reason: 'Resend respondió 403 dominio sin verificar' })
    const caido = vi.fn().mockRejectedValue(new Error('sin red'))
    expect(await sendContactEmail(mensaje, autor, { env: { RESEND_API_KEY: 'k' }, fetchImpl: caido }))
      .toEqual({ sent: false, reason: 'sin red' })
  })
})
