import { useId, useState } from 'react'
import { MODERATION_REASONS, REASON_NOTE_MAX } from '../../lib/moderation'

// Formulario corto para elegir un motivo (reportar, o eliminar como editor o admin).
// «Otro» pide escribir el motivo.
export default function ReasonForm({ title, confirmLabel, onSubmit, onCancel }) {
  const id = useId()
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    if (!reason) return setError('Elige un motivo.')
    if (reason === 'otro' && !note.trim()) return setError('Escribe el motivo.')
    setSending(true)
    setError(null)
    try {
      await onSubmit({ reason, note: note.trim() || undefined })
    } catch (err) {
      setError(err.message)
      setSending(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-2 flex flex-col gap-2 rounded-[10px] border-2 border-black bg-[#fff4cc] p-3">
      <p className="text-sm font-bold text-brand-900">{title}</p>
      <label htmlFor={`${id}-reason`} className="sr-only">Motivo</label>
      <select
        id={`${id}-reason`}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        className="min-h-11 w-full rounded-[10px] border-2 border-black bg-white px-3 text-base text-brand-900"
      >
        <option value="">Elige un motivo…</option>
        {MODERATION_REASONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {reason === 'otro' && (
        <>
          <label htmlFor={`${id}-note`} className="text-sm font-semibold text-brand-900">¿Cuál es el motivo?</label>
          <input
            id={`${id}-note`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={REASON_NOTE_MAX}
            className="min-h-11 w-full rounded-[10px] border-2 border-black bg-white px-3 text-base text-brand-900"
          />
        </>
      )}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-brand-600 hover:text-brand-900">Cancelar</button>
        <button type="submit" disabled={sending} className="tp-button min-h-11 bg-brand-900 px-4 text-sm font-black text-white disabled:opacity-50">
          {sending ? 'Enviando…' : confirmLabel}
        </button>
      </div>
    </form>
  )
}
