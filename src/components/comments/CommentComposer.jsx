import { useId, useRef, useState } from 'react'
import MathText from '../math/MathText'
import { COMMENT_MAX } from '../../lib/moderation'

// Caja para escribir un comentario o una respuesta. «$ LaTeX» envuelve la
// selección (o inserta $ $) y, si hay matemáticas, se muestra una vista previa.
export default function CommentComposer({ label, onSubmit, onCancel, submitLabel = 'Publicar', autoFocus = false }) {
  const id = useId()
  const textareaRef = useRef(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const insertMath = () => {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end, value } = el
    const selected = value.slice(start, end)
    setText(`${value.slice(0, start)}$${selected}$${value.slice(end)}`)
    requestAnimationFrame(() => {
      el.focus()
      const caret = selected ? end + 2 : start + 1
      el.setSelectionRange(caret, caret)
    })
  }

  const submit = async (event) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    setSending(true)
    setError(null)
    try {
      await onSubmit(body)
      setText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-brand-900">{label}</label>
      <textarea
        id={id}
        ref={textareaRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Usa $...$ para escribir matemáticas"
        rows={3}
        maxLength={COMMENT_MAX}
        autoFocus={autoFocus}
        className="w-full rounded-[10px] border-2 border-black bg-white px-3.5 py-2.5 text-base text-brand-900 placeholder:text-brand-600"
      />
      {text.includes('$') && (
        <div className="rounded-[10px] border-2 border-dashed border-[#c4bcb2] bg-white px-3.5 py-2 text-sm text-brand-800">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-600">Vista previa</p>
          <MathText text={text} className="whitespace-pre-line break-words" />
        </div>
      )}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={insertMath}
          className="inline-flex min-h-11 items-center rounded-[10px] border-2 border-black bg-accent-purple-soft px-3 text-sm font-bold text-brand-900"
        >
          $ LaTeX
        </button>
        <span className="text-xs text-brand-600">{text.length}/{COMMENT_MAX}</span>
        <div className="ml-auto flex items-center gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-brand-600 hover:text-brand-900">
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="tp-button min-h-11 bg-brand-900 px-4 text-sm font-black text-white disabled:opacity-50"
          >
            {sending ? 'Publicando…' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
