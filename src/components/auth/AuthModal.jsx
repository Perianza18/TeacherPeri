import { useState } from 'react'
import useDialog from '../../hooks/useDialog'
import { apiFetch } from '../../lib/api'

const inputClass = 'tp-input'

// What an account gives, shown while creating one.
const BENEFITS = [
  'Guarda tu progreso en las Rutas',
  'Comenta y comparte tus ideas en cada problema',
  'Escríbenos desde Contacto',
]

export default function AuthModal({ onClose, onAuthSuccess, initialMode = 'login' }) {
  const dialogRef = useDialog(onClose)
  const [modo, setModo] = useState(initialMode === 'signup' ? 'signup' : 'login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const signup = modo === 'signup'

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
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-tp-ink/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Cuenta de TeacherPeri" className="tp-card w-full max-w-md overflow-hidden bg-tp-paper" onClick={(e) => e.stopPropagation()}>
        <div className={`relative overflow-hidden border-b-3 border-tp-ink px-6 pb-5 pt-5 ${signup ? 'bg-tp-yellow' : 'bg-tp-sky'}`}>
          <div aria-hidden="true" className="tp-graph absolute inset-0" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex flex-col items-start gap-3">
              <p className="tp-sticker -rotate-2 bg-tp-surface">Teacher<span className="text-tp-violet">Peri</span></p>
              <h2 className="font-display text-[34px] font-extrabold leading-none tracking-[-0.035em]">{signup ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
            </div>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-tp-ink bg-tp-surface text-xl font-bold leading-none shadow-[2px_2px_0_var(--tp-ink)] transition-transform hover:-translate-y-0.5">×</button>
          </div>
        </div>
        <div className="flex flex-col gap-5 p-6">
          {signup && (
            <ul className="flex flex-col gap-2">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5 text-[15px] font-semibold">
                  <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-tp-ink bg-tp-mint text-xs font-extrabold">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {signup && <input type="text" aria-label="Nombre de usuario" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputClass} />}
            <input type="email" aria-label="Correo" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            <input type="password" aria-label="Contraseña" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={inputClass} />
            {error && <p role="alert" className="tp-card-quiet bg-tp-orange-soft px-3 py-2 text-sm font-semibold">{error}</p>}
            <button type="submit" disabled={enviando} className="tp-button mt-2 bg-tp-violet px-4 text-[16px] font-bold text-white disabled:opacity-50">{enviando ? 'Un momento…' : signup ? 'Registrarme' : 'Iniciar sesión'}</button>
          </form>
          <p className="text-center text-sm text-tp-ink-muted">
            {signup ? '¿Ya tienes cuenta? ' : '¿Es tu primera vez? '}
            <button type="button" onClick={() => { setModo(signup ? 'login' : 'signup'); setError(null) }} className="font-bold text-tp-violet underline decoration-wavy decoration-2 underline-offset-4">
              {signup ? 'Inicia sesión' : 'Crea una cuenta'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
