import { useEffect, useId, useRef, useState } from 'react'
import { apiFetch } from '../../lib/api'
import MathText from '../math/MathText'
import VocabularyPicker from './VocabularyPicker'
import ExamFolderPicker from './ExamFolderPicker'

const STATEMENT_MAX = 5000

// The form to propose a problem or change one of yours. `initial` is a
// proposal ({ enunciado, topics, tags, isExam, examFolder, problemNumber });
// `problemId` switches it to editing. `onSaved` receives the server's view.
export default function ProblemSubmissionForm({ token, initial, problemId = null, isLive = false, onSaved, onCancel }) {
  const id = useId()
  const textareaRef = useRef(null)
  const [form, setForm] = useState(() => ({ ...initial, problemNumber: initial.problemNumber ?? '' }))
  const [data, setData] = useState({ topics: [], tags: [], folders: [], error: null, loaded: false })
  const [sending, setSending] = useState(false)
  const [problems, setProblems] = useState(null) // { error, checks }

  useEffect(() => {
    let cancelled = false
    Promise.all([apiFetch('/api/topics'), apiFetch('/api/tags'), apiFetch('/api/submissions/folders', { token })])
      .then(([topics, tags, folders]) => { if (!cancelled) setData({ topics, tags, folders, error: null, loaded: true }) })
      .catch((error) => { if (!cancelled) setData((current) => ({ ...current, error: error.message, loaded: true })) })
    return () => { cancelled = true }
  }, [token])

  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const insertMath = () => {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end, value } = el
    const selected = value.slice(start, end)
    set('enunciado', `${value.slice(0, start)}$${selected}$${value.slice(end)}`)
    requestAnimationFrame(() => {
      el.focus()
      const caret = selected ? end + 2 : start + 1
      el.setSelectionRange(caret, caret)
    })
  }

  const submit = async (event) => {
    event.preventDefault()
    setSending(true)
    setProblems(null)
    const body = {
      enunciado: form.enunciado,
      topics: form.topics,
      tags: form.tags,
      isExam: form.isExam,
      examFolder: form.isExam ? form.examFolder : null,
      problemNumber: form.isExam && form.problemNumber !== '' ? Number(form.problemNumber) : null,
    }
    try {
      const saved = await apiFetch(problemId ? `/api/submissions/mine/${problemId}` : '/api/submissions', { method: problemId ? 'PUT' : 'POST', token, body })
      onSaved(saved)
    } catch (error) {
      setProblems({ error: error.message, checks: error.data?.checks?.filter((check) => check.level === 'error') || [] })
    } finally {
      setSending(false)
    }
  }

  if (data.loaded && data.error) return <p role="alert" className="tp-card-soft bg-tp-surface p-5 text-red-700">No fue posible cargar el formulario: {data.error}</p>

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      {isLive && (
        <p className="tp-card-quiet bg-tp-sky-soft p-4 text-sm leading-6">
          Este problema ya está publicado. Tus cambios quedarán en revisión y, mientras tanto, se seguirá mostrando la versión aprobada.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <label htmlFor={`${id}-enunciado`} className="text-sm font-bold text-tp-ink">Enunciado</label>
          <button type="button" onClick={insertMath} className="min-h-11 rounded-[10px] border-2 border-tp-ink bg-tp-violet-soft px-3 text-sm font-bold">$ LaTeX</button>
        </div>
        <textarea
          id={`${id}-enunciado`}
          ref={textareaRef}
          value={form.enunciado}
          onChange={(event) => set('enunciado', event.target.value)}
          rows={8}
          maxLength={STATEMENT_MAX}
          required
          aria-describedby={`${id}-enunciado-ayuda`}
          placeholder="Escribe el enunciado completo. Usa $...$ para las matemáticas, por ejemplo $x^2+1$."
          className="tp-input min-h-48 leading-7"
        />
        <p id={`${id}-enunciado-ayuda`} className="text-sm text-tp-ink-muted">Solo el enunciado: sin pistas ni soluciones. {form.enunciado.length}/{STATEMENT_MAX}</p>
        {form.enunciado.trim() && (
          <div className="rounded-[10px] border-2 border-dashed border-tp-rule bg-tp-surface px-4 py-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-tp-ink-muted">Vista previa</p>
            <MathText text={form.enunciado} className="whitespace-pre-wrap break-words leading-7 text-tp-ink" />
          </div>
        )}
      </div>

      <VocabularyPicker topics={data.topics} tags={data.tags} value={{ topics: form.topics, tags: form.tags }} onChange={(next) => setForm((current) => ({ ...current, ...next }))} />

      <div className="flex flex-col gap-3">
        <label className="inline-flex min-h-11 items-center gap-3 text-sm font-bold text-tp-ink">
          <input type="checkbox" checked={form.isExam} onChange={(event) => set('isExam', event.target.checked)} className="h-5 w-5 accent-tp-violet" />
          Es un problema de examen
        </label>
        {form.isExam && (
          <>
            <ExamFolderPicker
              token={token}
              folders={data.folders}
              value={form.examFolder}
              onChange={(folderId) => set('examFolder', folderId)}
              onFolderCreated={(folder) => setData((current) => ({ ...current, folders: [...current.folders, folder] }))}
            />
            <label className="max-w-xs text-sm font-semibold text-tp-ink">
              Número de problema (opcional)
              <input type="number" min={1} max={999} inputMode="numeric" value={form.problemNumber} onChange={(event) => set('problemNumber', event.target.value)} className="tp-input mt-1 font-normal" />
            </label>
          </>
        )}
      </div>

      {problems && (
        <div role="alert" className="tp-card-quiet bg-tp-coral-soft p-4 text-sm leading-6">
          <p className="font-bold">{problems.checks.length > 1 ? 'Corrige estos puntos antes de enviar:' : problems.error}</p>
          {problems.checks.length > 1 && <ul className="mt-2 list-disc pl-5">{problems.checks.map((check) => <li key={`${check.code}-${check.message}`}>{check.message}</li>)}</ul>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={sending || !data.loaded} className="tp-button bg-tp-ink px-5 font-black text-white disabled:opacity-60">
          {sending ? 'Enviando…' : problemId ? (isLive ? 'Enviar cambios a revisión' : 'Guardar y enviar a revisión') : 'Enviar a revisión'}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="min-h-11 px-2 font-semibold text-tp-ink-muted underline underline-offset-2">Cancelar</button>}
      </div>
    </form>
  )
}
