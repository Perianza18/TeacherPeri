// ---------------------------------------------------------------------------
// Aviso por correo de cada mensaje del formulario de Contacto.
//
// El mensaje siempre se guarda en Mongo primero (ContactMessage); este correo
// es solo un aviso a la bandeja del equipo. Se manda con la API web de Resend
// (https://resend.com/docs/api-reference/emails/send-email) usando el fetch
// que ya trae Node, así que no hace falta ninguna librería nueva.
//
// Variables de entorno (solo en el panel de Render, nunca en el repositorio):
//   RESEND_API_KEY      clave de Resend. Sin ella no se manda nada (así
//                       funcionan las pruebas y el desarrollo local).
//   CONTACT_EMAIL_TO    a dónde llega el aviso. Por defecto contacto@teacherperi.com
//   CONTACT_EMAIL_FROM  remitente; debe ser de un dominio verificado en Resend.
//                       Por defecto «TeacherPeri <avisos@teacherperi.com>».
// ---------------------------------------------------------------------------

export const DEFAULT_TO = 'contacto@teacherperi.com'
export const DEFAULT_FROM = 'TeacherPeri <avisos@teacherperi.com>'
const RESEND_URL = 'https://api.resend.com/emails'
const SEPARADOR = '------------------------------'

// Un asunto nunca debe llevar saltos de línea.
function unaLinea(texto) {
  return String(texto ?? '').replace(/\s+/g, ' ').trim()
}

// «26 nov 2026, 15:40 (hora de CDMX)»
export function formatearFecha(fecha) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(fecha))
      .map((p) => [p.type, p.value]),
  )
  const mes = partes.month.replace('.', '')
  return `${partes.day} ${mes} ${partes.year}, ${partes.hour}:${partes.minute} (hora de CDMX)`
}

// «Otro: Directora de escuela» cuando la opción es «Otro».
function conDetalle(opcion, detalle) {
  return opcion === 'Otro' && detalle ? `Otro: ${detalle}` : opcion
}

// Arma asunto y cuerpo (texto plano) a partir del mensaje guardado y su autor.
export function buildContactEmail(mensaje, autor) {
  const usuario = autor?.username ? `@${autor.username}` : '(usuario desconocido)'
  const correo = autor?.email || '(sin correo)'
  const motivo = conDetalle(mensaje.motivo, mensaje.motivoOtro)

  const subject = unaLinea(`[Contacto TeacherPeri] ${motivo} · ${usuario}`)
  const text = [
    'Nuevo mensaje desde la página Contacto',
    '',
    `Usuario:   ${usuario}`,
    `Correo:    ${correo}`,
    `¿Quién eres?: ${conDetalle(mensaje.perfil, mensaje.perfilOtro)}`,
    `Motivo:    ${motivo}`,
    `Fecha:     ${formatearFecha(mensaje.createdAt || Date.now())}`,
    '',
    'Mensaje:',
    SEPARADOR,
    mensaje.mensaje,
    SEPARADOR,
    '',
  ].join('\n')

  return { subject, text, replyTo: autor?.email || undefined }
}

// Manda el aviso. Devuelve { sent: true } o { sent: false, reason }.
// Nunca lanza: un fallo del correo no debe tumbar el envío del formulario.
export async function sendContactEmail(mensaje, autor, { env = process.env, fetchImpl = fetch } = {}) {
  const apiKey = env.RESEND_API_KEY
  if (!apiKey) return { sent: false, reason: 'sin RESEND_API_KEY' }

  const { subject, text, replyTo } = buildContactEmail(mensaje, autor)
  try {
    const res = await fetchImpl(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_EMAIL_FROM || DEFAULT_FROM,
        to: [env.CONTACT_EMAIL_TO || DEFAULT_TO],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      const detalle = await res.text().catch(() => '')
      return { sent: false, reason: `Resend respondió ${res.status} ${detalle}`.trim() }
    }
    return { sent: true }
  } catch (err) {
    return { sent: false, reason: err.message }
  }
}
