import { useId, useState } from 'react'
import { apiFetch } from '../lib/api'

export const SUGGESTION_MIN = 10
export const SUGGESTION_MAX = 1000

// «Sugerir un cambio»: a content correction (wrong answer, typo, missing
// case) on a problem or a lesson. Stored as a Flag; editors and admins see it
// in Revisión. Shown inside PageFeedback, which checks the session first.
export default function SuggestionForm({ targetType, targetId, token, onSent, onCancel }) {
  const id = useId()
  const [message, setMessage] = useState('')
  const [state, setState] = useState({ sending: false, error: null })

  const submit = async (event) => {
    event.preventDefault()
    setState({ sending: true, error: null })
    try {
      await apiFetch('/api/flags', { method: 'POST', token, body: { targetType, targetId, message } })
      onSent()
    } catch (error) {
      setState({ sending: false, error: error.message })
    }
  }

  return (
    <form onSubmit={submit} className="tp-card-quiet mt-2 flex flex-col gap-2 bg-tp-surface p-4">
      <label htmlFor={id} className="text-sm font-bold text-tp-ink">¿Qué se debería cambiar?</label>
      <textarea
        id={id}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={3}
        maxLength={SUGGESTION_MAX}
        minLength={SUGGESTION_MIN}
        required
        placeholder="Por ejemplo: en el segundo párrafo dice 3, pero debería ser 5; o falta el caso n = 0."
        className="tp-input"
      />
      {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state.sending || message.trim().length < SUGGESTION_MIN} className="tp-button bg-tp-ink px-4 font-bold text-white disabled:opacity-60">{state.sending ? 'Enviando…' : 'Enviar sugerencia'}</button>
        <button type="button" onClick={onCancel} className="min-h-11 px-1 font-semibold text-tp-ink-muted underline underline-offset-2">Cancelar</button>
      </div>
    </form>
  )
}
