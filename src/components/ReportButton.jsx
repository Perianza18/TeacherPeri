import { useId, useState } from 'react'
import { apiFetch } from '../lib/api'
import { MODERATION_REASONS, REASON_NOTE_MAX } from '../lib/moderation'

// «Reportar»: a problem or a lesson with inappropriate content (spam,
// offensive language, personal data…). Same reasons as reporting a comment.
// Editors and admins see it in Moderación. Shown inside PageFeedback.
export default function ReportForm({ targetType, targetId, token, onSent, onCancel }) {
  const id = useId()
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [state, setState] = useState({ sending: false, error: null })

  const submit = async (event) => {
    event.preventDefault()
    if (!reason) return setState({ sending: false, error: 'Elige un motivo.' })
    if (reason === 'otro' && !note.trim()) return setState({ sending: false, error: 'Escribe el motivo.' })
    setState({ sending: true, error: null })
    try {
      await apiFetch('/api/reports/content', { method: 'POST', token, body: { targetType, targetId, reason, note: note.trim() || undefined } })
      onSent()
    } catch (error) {
      setState({ sending: false, error: error.message })
    }
  }

  return (
    <form onSubmit={submit} className="tp-card-quiet mt-2 flex flex-col gap-2 bg-tp-surface p-4">
      <p className="text-sm text-tp-ink-muted">Para contenido inapropiado. Si ves un error en el contenido, usa «Sugerir un cambio».</p>
      <label htmlFor={`${id}-motivo`} className="text-sm font-bold text-tp-ink">Motivo</label>
      <select id={`${id}-motivo`} value={reason} onChange={(event) => setReason(event.target.value)} required className="tp-input">
        <option value="">Elige un motivo…</option>
        {MODERATION_REASONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <label htmlFor={`${id}-nota`} className="text-sm font-bold text-tp-ink">{reason === 'otro' ? '¿Cuál es el motivo?' : 'Detalle (opcional)'}</label>
      <input id={`${id}-nota`} value={note} onChange={(event) => setNote(event.target.value)} maxLength={REASON_NOTE_MAX} className="tp-input" />
      {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state.sending} className="tp-button bg-tp-ink px-4 font-bold text-white disabled:opacity-60">{state.sending ? 'Enviando…' : 'Enviar reporte'}</button>
        <button type="button" onClick={onCancel} className="min-h-11 px-1 font-semibold text-tp-ink-muted underline underline-offset-2">Cancelar</button>
      </div>
    </form>
  )
}
