import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { apiFetch } from '../../lib/api'
import Mascot from '../decor/Mascot'

const PERFILES = [
  'Estudiante de Secundaria/Prepa',
  'Exolímpico/Entrenador',
  'Profesor(a)',
  'Padre/Madre',
  'Otro',
]

const MOTIVOS = [
  'Sugerir un recurso',
  'Compartir experiencia',
  'Duda sobre extranjero',
  'Feedback general',
  'Otro',
]

const OTRO = 'Otro'

const selectClass = 'tp-input'

// El formulario de Contacto, fusionado con la sesión global (ver
// AuthContext): sin sesión, muestra el prompt para iniciar sesión en vez
// del formulario — igual que Problemas.jsx hace con los comentarios,
// mismo patrón "condicional según auth", ahora reusado aquí. Con sesión,
// autocompleta nombre/correo desde auth.user (no pide inputs para eso) y
// solo deja llenar los 2 selects + el mensaje. Si un select queda en «Otro»,
// aparece un campo de texto (obligatorio) para describirlo.
export default function ContactForm() {
  const { auth, abrirModal } = useAuth()
  const [perfil, setPerfil] = useState(PERFILES[0])
  const [perfilOtro, setPerfilOtro] = useState('')
  const [motivo, setMotivo] = useState(MOTIVOS[0])
  const [motivoOtro, setMotivoOtro] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const cuerpo = mensaje.trim()
    const perfilDetalle = perfil === OTRO ? perfilOtro.trim() : ''
    const motivoDetalle = motivo === OTRO ? motivoOtro.trim() : ''
    if (!cuerpo) return
    if (perfil === OTRO && !perfilDetalle) return
    if (motivo === OTRO && !motivoDetalle) return

    setError(null)
    setEnviando(true)
    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        token: auth.token,
        body: { perfil, perfilOtro: perfilDetalle, motivo, motivoOtro: motivoDetalle, mensaje: cuerpo },
      })
      setEnviado(true)
      setMensaje('')
      setPerfilOtro('')
      setMotivoOtro('')
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  if (!auth) {
    return (
      <div className="tp-card flex flex-col items-start gap-4 bg-tp-surface p-7">
        <span className="tp-sticker -rotate-2 bg-tp-yellow">Para escribirme</span>
        <p className="text-[17px] leading-relaxed">Crea una cuenta para contactarnos.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => abrirModal('signup')} className="tp-button bg-tp-violet px-5 font-bold text-white">
            Crear cuenta
          </button>
          <button type="button" onClick={() => abrirModal('login')} className="tp-button bg-tp-surface px-5 font-bold">
            Ya tengo cuenta
          </button>
        </div>
      </div>
    )
  }

  if (enviado) {
    return (
      <div role="status" className="tp-card relative flex flex-col items-start gap-3 bg-tp-mint p-7 pr-32">
        <Mascot pose="cath-patita" className="absolute bottom-3 right-5 h-28" />
        <p className="font-display text-[28px] font-extrabold leading-none tracking-[-0.03em]">¡Mensaje enviado!</p>
        <p className="text-[16px]">Gracias por escribir — te responderé pronto.</p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="mt-1 text-sm font-bold underline decoration-wavy decoration-2 underline-offset-4"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="tp-card flex flex-col gap-4 bg-tp-surface p-6 sm:p-7"
    >
      {/* Nombre/correo NO se piden: ya vienen de la sesión iniciada. */}
      <p className="text-sm text-tp-ink-muted">
        Enviando como <strong className="text-tp-ink">{auth.user.username}</strong>
        {auth.user.email ? ` (${auth.user.email})` : ''}
      </p>

      <label className="flex flex-col gap-1.5 text-sm font-bold">
        ¿Quién eres?
        <select value={perfil} onChange={(e) => setPerfil(e.target.value)} className={selectClass}>
          {PERFILES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>

      {perfil === OTRO && (
        <label className="flex flex-col gap-1.5 text-sm font-bold">
          Cuéntanos quién eres
          <input
            type="text"
            value={perfilOtro}
            onChange={(e) => setPerfilOtro(e.target.value)}
            required
            maxLength={100}
            className={selectClass}
          />
        </label>
      )}

      <label className="flex flex-col gap-1.5 text-sm font-bold">
        Motivo del mensaje
        <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className={selectClass}>
          {MOTIVOS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>

      {motivo === OTRO && (
        <label className="flex flex-col gap-1.5 text-sm font-bold">
          Describe el motivo
          <input
            type="text"
            value={motivoOtro}
            onChange={(e) => setMotivoOtro(e.target.value)}
            required
            maxLength={100}
            className={selectClass}
          />
        </label>
      )}

      <label className="flex flex-col gap-1.5 text-sm font-bold">
        Mensaje
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
          rows={4}
          maxLength={2000}
          className={selectClass}
        />
      </label>

      {error && <p role="alert" className="tp-card-quiet bg-tp-orange-soft px-3 py-2 text-sm font-semibold">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="tp-button bg-tp-violet px-5 font-bold text-white disabled:opacity-50"
      >
        {enviando ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
