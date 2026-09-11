import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { apiFetch } from '../../lib/api'

const GRADIENT = 'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)'

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
]

const selectClass =
  'rounded-lg border border-brand-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#E57505] focus:ring-2 focus:ring-[#E57505]/30'

// El formulario de Contacto, fusionado con la sesión global (ver
// AuthContext): sin sesión, muestra el prompt para iniciar sesión en vez
// del formulario — igual que Problemas.jsx hace con los comentarios,
// mismo patrón "condicional según auth", ahora reusado aquí. Con sesión,
// autocompleta nombre/correo desde auth.user (no pide inputs para eso) y
// solo deja llenar los 2 selects + el mensaje.
export default function ContactForm() {
  const { auth, abrirModal } = useAuth()
  const [perfil, setPerfil] = useState(PERFILES[0])
  const [motivo, setMotivo] = useState(MOTIVOS[0])
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const cuerpo = mensaje.trim()
    if (!cuerpo) return

    setError(null)
    setEnviando(true)
    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        token: auth.token,
        body: { perfil, motivo, mensaje: cuerpo },
      })
      setEnviado(true)
      setMensaje('')
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  if (!auth) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-brand-200 bg-white p-8 text-center shadow-sm">
        <p className="text-brand-700">Crea una cuenta para contactarnos.</p>
        <button
          type="button"
          onClick={abrirModal}
          className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md transition-transform active:scale-95"
          style={{ backgroundImage: GRADIENT }}
        >
          Iniciar sesión
        </button>
      </div>
    )
  }

  if (enviado) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center text-emerald-700 shadow-sm">
        <p className="font-semibold">¡Mensaje enviado!</p>
        <p className="text-sm">Gracias por escribir — te responderé pronto.</p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="mt-2 text-sm text-emerald-700 underline underline-offset-4"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-md flex-col gap-4 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm"
    >
      {/* Nombre/correo NO se piden: ya vienen de la sesión iniciada. */}
      <p className="text-sm text-brand-500">
        Enviando como <strong className="text-brand-900">{auth.user.username}</strong>
        {auth.user.email ? ` (${auth.user.email})` : ''}
      </p>

      <label className="flex flex-col gap-1 text-sm text-brand-700">
        ¿Quién eres?
        <select value={perfil} onChange={(e) => setPerfil(e.target.value)} className={selectClass}>
          {PERFILES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-brand-700">
        Motivo del mensaje
        <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className={selectClass}>
          {MOTIVOS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-brand-700">
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

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
        style={{ backgroundImage: GRADIENT }}
      >
        {enviando ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
