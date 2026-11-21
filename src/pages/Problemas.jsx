import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '../components/motion/variants'
import { apiFetch } from '../lib/api'
import useDialog from '../hooks/useDialog'
import { useAuth } from '../context/useAuth'
import MathText from '../components/math/MathText'
import ProblemImages from '../components/images/ProblemImages'
import LibraryCollection from '../components/training/LibraryCollection'
import CommentSection from '../components/comments/CommentSection'
import { PROPOSE_PATH } from '../lib/submissions'
// Header color per area, the same as the library card strips.
const AREA_STRIPS = { 'Geometría': 'bg-tp-sky', 'Álgebra': 'bg-tp-tint-violet', 'Combinatoria': 'bg-tp-coral', 'Teoría de Números': 'bg-tp-mint' }
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

  const inputClass = 'tp-input'

  return (
    <form onSubmit={handleSubmit} className="tp-card-quiet flex flex-col gap-3 bg-tp-yellow-soft p-5">
      <p className="text-[15px] font-semibold">
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

      {error && <p role="alert" className="tp-card-quiet bg-tp-coral-soft px-3 py-2 text-sm font-semibold">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="tp-button bg-tp-violet px-4 text-sm font-bold text-white disabled:opacity-50"
        >
          {enviando ? 'Un momento...' : modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}
        </button>
        <button
          type="button"
          onClick={() => setModo(modo === 'login' ? 'signup' : 'login')}
          className="text-sm font-bold text-tp-violet underline decoration-wavy decoration-2 underline-offset-4"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-tp-ink/60 p-4 backdrop-blur-sm"
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
        className="tp-card flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden bg-tp-paper"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header strip in the problem's area color, like the library cards. */}
        <div className={`flex shrink-0 items-start justify-between gap-4 border-b-3 border-tp-ink px-6 py-4 ${AREA_STRIPS[problema.tema] || 'bg-tp-yellow'}`}>
          <div className="flex min-w-0 flex-col items-start gap-2">
            <p className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em]">
              {problema.codigo}
              {problema.tema && <span className="tp-pill bg-tp-surface px-2 py-0 text-[11px] normal-case tracking-normal">{problema.tema}</span>}
            </p>
            <h3 id="titulo-modal-problema" className="font-display text-[28px] font-extrabold leading-tight tracking-[-0.03em]">
              {formatearTitulo(problema)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-tp-ink bg-tp-surface text-xl font-bold leading-none shadow-[2px_2px_0_var(--tp-ink)] transition-transform hover:-translate-y-0.5"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
          {/* div, no <p>: una fórmula en "display mode" se renderiza como un
              <div>, y un <div> no puede vivir legalmente dentro de un <p> en
              HTML (el mismo tipo de error que se ve en Contacto.jsx). */}
          <div className="tp-card-quiet mb-6 bg-tp-surface p-5">
            <MathText text={problema.enunciado} className="tp-reading-text whitespace-pre-line" />
            <ProblemImages images={problema.images} className="mt-4" />
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
    <LibraryCollection type="problems" title="Problemas" subtitle="Practica, escribe una solución y compara tus ideas. Un mismo problema conserva su identidad en listas, exámenes y Rutas." onOpen={setSelected} headerAction={<Link to={PROPOSE_PATH} className="tp-button bg-tp-mint px-5 font-bold text-tp-ink">Proponer un problema</Link>} />
    <AnimatePresence>{selected && <ProblemaModal key={selected._id} problema={selected} onClose={() => setSelected(null)} auth={auth} onAuthSuccess={login} onAuthExpired={logout} />}</AnimatePresence>
  </>
}
