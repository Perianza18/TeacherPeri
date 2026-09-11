import { useState } from 'react'
import { apiFetch } from '../../lib/api'

const GRADIENT = 'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)'

const inputClass =
  'rounded-lg border border-brand-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#E57505] focus:ring-2 focus:ring-[#E57505]/30'

// Modal de login/registro global — mismo formulario que ya existía dentro
// del modal de un problema (AuthInlineForm, en Problemas.jsx), pero
// disponible desde CUALQUIER página vía el botón "Iniciar sesión" del
// Navbar (ver AuthContext.jsx), no solo al intentar comentar. Problemas.jsx
// no se tocó — sigue teniendo su propia versión embebida, esto es una
// segunda superficie para el mismo login, no un reemplazo.
export default function AuthModal({ onClose, onAuthSuccess }) {
  const [modo, setModo] = useState('login')
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
      const body = modo === 'login' ? { email, password } : { username, email, password }
      const data = await apiFetch(path, { method: 'POST', body })
      onAuthSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-[#FFFBF5] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-brand-900">
            {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-brand-400 transition-transform hover:scale-110 hover:text-brand-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
              style={{ backgroundImage: GRADIENT }}
            >
              {enviando ? 'Un momento...' : modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}
            </button>
            <button
              type="button"
              onClick={() => setModo(modo === 'login' ? 'signup' : 'login')}
              className="text-sm text-brand-600 underline hover:text-[#E57505]"
            >
              {modo === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
