import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '../components/motion/variants'
import { apiFetch } from '../lib/api'
import useDialog from '../hooks/useDialog'
import { useAuth } from '../context/useAuth'
import MathText from '../components/math/MathText'
import LibraryCollection from '../components/training/LibraryCollection'
import CommentSection from '../components/comments/CommentSection'
const TP_ORANGE = '#5B5FE9'
const TP_ACCENT = TP_ORANGE
const formatearTitulo = (p) => p.titulo || p.codigo

function AuthInlineForm({ onAuthSuccess }) {
  const [modo, setModo] = useState('login') // 'login' | 'signup'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const path = modo === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const body =
        modo === 'login' ? { email, password } : { username, email, password }
      const data = await apiFetch(path, { method: 'POST', body })
      onAuthSuccess(data) // { token, user } — el componente padre lo guarda
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const inputClass =
    'rounded-lg border border-brand-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5B5FE9] focus:ring-2 focus:ring-[#5B5FE9]/30'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-brand-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-brand-700">
        {modo === 'login'
          ? 'Inicia sesión para comentar.'
          : 'Crea una cuenta para comentar.'}
      </p>

      {modo === 'signup' && (
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={inputClass}
        />
      )}
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className={inputClass}
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: TP_ACCENT }}
        >
          {enviando ? 'Un momento...' : modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}
        </button>
        <button
          type="button"
          onClick={() => setModo(modo === 'login' ? 'signup' : 'login')}
          className="text-sm text-brand-600 underline hover:text-[#5B5FE9]"
        >
          {modo === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}
        </button>
      </div>
    </form>
  )
}

function ProblemaModal({ problema, onClose, auth, onAuthSuccess, onAuthExpired }) {
  const dialogRef = useDialog(onClose)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.25, ease: EASE }}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-problema"
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#FFFBF5] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Franja de color: mismo gradiente de marca que el resto de la
            página, para que el modal se sienta parte del mismo sistema. */}
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: TP_ACCENT }} />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h3 id="titulo-modal-problema" className="text-xl font-semibold text-brand-900">
              {formatearTitulo(problema)}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-brand-400 transition-transform hover:scale-110 hover:text-brand-900"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          {/* codigo/tipo/año ya no se repiten aquí: formatearTitulo() de
              arriba ya los dice todos — lo único que faltaba es el tema. */}
          <p className="mb-4">
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-500">{problema.tema}</span>
          </p>
          {/* div, no <p>: una fórmula en "display mode" se renderiza como un
              <div>, y un <div> no puede vivir legalmente dentro de un <p> en
              HTML (el mismo tipo de error que se ve en Contacto.jsx). */}
          <div className="mb-6 whitespace-pre-line text-brand-700">
            <MathText text={problema.enunciado} />
          </div>

          <CommentSection
            problemId={problema._id}
            auth={auth}
            onAuthExpired={onAuthExpired}
            signIn={<AuthInlineForm onAuthSuccess={onAuthSuccess} />}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

// Una tarjeta de la cuadrícula de problemas — reemplaza la fila de tabla
// que había antes. `tilt` es un pequeño ángulo (en grados) que la deja
// "ladeada" como una nota pegada en un pizarrón; al pasar el mouse se
// endereza y se levanta un poco (whileHover), inspirado en las tarjetas de
// hackthenorth.com.
export default function Problemas() {
  const [selected, setSelected] = useState(null)
  const { auth, login, logout } = useAuth()
  return <>
    <LibraryCollection type="problems" title="Problemas" subtitle="Practica, escribe una solución y compara tus ideas. Un mismo problema conserva su identidad en listas, exámenes y Rutas." onOpen={setSelected} />
    <AnimatePresence>{selected && <ProblemaModal key={selected._id} problema={selected} onClose={() => setSelected(null)} auth={auth} onAuthSuccess={login} onAuthExpired={logout} />}</AnimatePresence>
  </>
}
