import { useId, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { apiFetch } from '../lib/api'

const MESSAGE_MIN = 10
const MESSAGE_MAX = 1000

// «Reportar un error» on a problem or a theory page. Signed-out visitors get
// the sign-in modal; editors and admins see the reports later.
export default function FlagButton({ targetType, targetId }) {
  const id = useId()
  const { auth, abrirModal } = useAuth()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [state, setState] = useState({ sending: false, error: null, done: false })

  const start = () => {
    if (!auth) { abrirModal(); return }
    setOpen(true)
  }

  const submit = async (event) => {
    event.preventDefault()
    setState({ sending: true, error: null, done: false })
    try {
      await apiFetch('/api/flags', { method: 'POST', token: auth.token, body: { targetType, targetId, message } })
      setState({ sending: false, error: null, done: true })
      setMessage('')
      setOpen(false)
    } catch (error) {
      setState({ sending: false, error: error.message, done: false })
    }
  }

  return (
    <div className="font-sans text-[15px]">
      {!open && (
        <button type="button" onClick={start} aria-expanded="false" className="inline-flex min-h-11 items-center px-1 font-semibold text-tp-ink-muted underline underline-offset-2 hover:text-tp-ink">
          Reportar un error
        </button>
      )}
      {state.done && !open && <p role="status" className="text-sm text-tp-ink-muted">Gracias. Revisaremos tu reporte.</p>}
      {open && (
        <form onSubmit={submit} className="tp-card-quiet mt-2 flex flex-col gap-2 bg-tp-surface p-4">
          <label htmlFor={id} className="text-sm font-bold text-tp-ink">Describe el error</label>
          <textarea
            id={id}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            maxLength={MESSAGE_MAX}
            minLength={MESSAGE_MIN}
            required
            placeholder="Por ejemplo: en el segundo párrafo dice 3, pero debería ser 5."
            className="tp-input"
          />
          {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={state.sending || message.trim().length < MESSAGE_MIN} className="tp-button bg-tp-ink px-4 font-bold text-white disabled:opacity-60">{state.sending ? 'Enviando…' : 'Enviar reporte'}</button>
            <button type="button" onClick={() => { setOpen(false); setState({ sending: false, error: null, done: false }) }} className="min-h-11 px-1 font-semibold text-tp-ink-muted underline underline-offset-2">Cancelar</button>
          </div>
        </form>
      )}
    </div>
  )
}
