import { useState } from 'react'
import { apiFetch } from '../../lib/api'

const inputClass = 'rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100'

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
    } catch (err) { setError(err.message) } finally { setEnviando(false) }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#FAF8F5] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-600">TeacherPeri</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-brand-900">{modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-xl text-brand-500 hover:bg-white hover:text-brand-900">×</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {modo === 'signup' && <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputClass} />}
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={inputClass} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={enviando} className="tp-gradient mt-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-50">{enviando ? 'Un momento…' : modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}</button>
          <button type="button" onClick={() => setModo(modo === 'login' ? 'signup' : 'login')} className="mt-1 text-sm font-medium text-brand-500 hover:text-violet-700">{modo === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}</button>
        </form>
      </div>
    </div>
  )
}
