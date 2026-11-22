import { useEffect, useId, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PanelShell, { LoadState } from '../../components/panel/PanelShell'
import MathText from '../../components/math/MathText'
import VocabularyPicker from '../../components/submissions/VocabularyPicker'
import ExamFolderPicker from '../../components/submissions/ExamFolderPicker'
import ImagesField from '../../components/images/ImagesField'
import { apiFetch } from '../../lib/api'
import { splitHints } from '../../lib/hints'
import { useApiData } from '../../lib/panel'

const LIMITS = { titulo: 200, enunciado: 5000, hint: 5000, solution: 20000 }

// Textarea with its live KaTeX preview underneath.
function MathField({ label, help, value, onChange, max, rows = 6, preview }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold">{label}</label>
      {help && <p id={`${id}-ayuda`} className="text-sm text-tp-ink-muted">{help}</p>}
      <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} rows={rows} maxLength={max} aria-describedby={help ? `${id}-ayuda` : undefined} className="tp-input leading-7" />
      <p className="text-xs text-tp-ink-muted">{value.length}/{max}</p>
      {value.trim() && (
        <div className="rounded-[10px] border-2 border-dashed border-tp-rule bg-tp-surface px-4 py-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-tp-ink-muted">Vista previa</p>
          {preview || <MathText text={value} className="tp-reading-text whitespace-pre-wrap break-words leading-7" />}
        </div>
      )}
    </div>
  )
}

function toForm(item) {
  return {
    titulo: item.titulo || '',
    enunciado: item.enunciado || '',
    hint: item.hint || '',
    solution: item.solution || '',
    topics: item.topics || [],
    tags: item.tags || [],
    isExam: Boolean(item.examFolder),
    examFolder: item.examFolder || null,
    problemNumber: item.problemNumber ?? '',
    images: item.images || [],
  }
}

// /panel/problemas/:id/editar — an editor changes any problem; it applies at once.
export default function EditarProblemaPage() {
  const { id } = useParams()
  return (
    <PanelShell title="Editar problema" lead="Los cambios se publican al guardar. Queda registro de quién cambió qué, y los admins reciben un aviso.">
      {(auth) => <Editor key={id} id={id} token={auth.token} />}
    </PanelShell>
  )
}

function Editor({ id, token }) {
  const item = useApiData(`/api/editor/problems/${id}`, token)
  const [vocab, setVocab] = useState({ topics: [], tags: [], folders: [], error: null })
  useEffect(() => {
    let cancelled = false
    Promise.all([apiFetch('/api/topics'), apiFetch('/api/tags'), apiFetch('/api/submissions/folders', { token })])
      .then(([topics, tags, folders]) => { if (!cancelled) setVocab({ topics, tags, folders: folders.filter((folder) => folder.reviewStatus === 'approved'), error: null }) })
      .catch((error) => { if (!cancelled) setVocab((current) => ({ ...current, error: error.message })) })
    return () => { cancelled = true }
  }, [token])

  if (!item.data) return <LoadState loading={item.loading} error={item.error || vocab.error} />
  return <ProblemForm initial={item.data} vocab={vocab} token={token} />
}

function ProblemForm({ initial, vocab, token }) {
  const [base, setBase] = useState(initial)
  const [form, setForm] = useState(() => toForm(initial))
  const [state, setState] = useState({ busy: false, error: null, checks: [], saved: null })
  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const hints = splitHints(form.hint)

  const save = async (event) => {
    event.preventDefault()
    setState({ busy: true, error: null, checks: [], saved: null })
    try {
      const result = await apiFetch(`/api/editor/problems/${base._id}`, {
        method: 'PUT',
        token,
        body: {
          titulo: form.titulo,
          enunciado: form.enunciado,
          hint: form.hint,
          solution: form.solution,
          topics: form.topics,
          tags: form.tags,
          examFolder: form.isExam ? form.examFolder : null,
          problemNumber: form.isExam && form.problemNumber !== '' ? Number(form.problemNumber) : null,
          images: form.images,
          baseUpdatedAt: base.updatedAt,
        },
      })
      setBase(result.item)
      setForm(toForm(result.item))
      setState({ busy: false, error: null, checks: [], saved: result.changed.length })
    } catch (error) {
      setState({ busy: false, error: error.message, checks: error.data?.checks || [], saved: null })
    }
  }

  return (
    <form onSubmit={save} className="flex max-w-[840px] flex-col gap-6" noValidate>
      <div className="flex flex-wrap items-center gap-2">
        <span className="tp-pill bg-tp-surface text-xs">{base.codigo}</span>
        {base.publicationStatus !== 'published' && <span className="tp-pill bg-tp-yellow-soft text-xs">No publicado</span>}
        {base.author && <span className="tp-pill bg-tp-violet-soft text-xs">Propuesto por la comunidad</span>}
        {base.publicationStatus === 'published' && <Link to={`/entrenamiento/problemas/${base._id}`} className="min-h-11 content-center px-1 text-sm font-bold text-tp-violet underline underline-offset-2">Ver problema</Link>}
      </div>

      <section className="tp-card-soft flex flex-col gap-6 bg-tp-surface p-5 sm:p-7">
        <label className="flex flex-col gap-2 text-sm font-bold">
          Título
          <input value={form.titulo} onChange={(event) => set('titulo', event.target.value)} maxLength={LIMITS.titulo} required className="tp-input font-normal" />
        </label>
        <MathField label="Enunciado" value={form.enunciado} onChange={(value) => set('enunciado', value)} max={LIMITS.enunciado} rows={8} />
        <MathField
          label="Pistas"
          help="Una pista por párrafo: deja una línea en blanco entre pistas. Van de menos a más."
          value={form.hint}
          onChange={(value) => set('hint', value)}
          max={LIMITS.hint}
          preview={<ol className="flex flex-col gap-3">{hints.map((hint, index) => <li key={index}><span className="text-xs font-bold uppercase tracking-[0.12em] text-tp-ink-muted">Pista {index + 1}</span><MathText text={hint} className="tp-reading-text mt-1 leading-7" /></li>)}</ol>}
        />
        <MathField label="Solución" value={form.solution} onChange={(value) => set('solution', value)} max={LIMITS.solution} rows={10} />
        <ImagesField value={form.images} onChange={(images) => set('images', images)} token={token} allowSolution />
      </section>

      <section className="tp-card-soft flex flex-col gap-6 bg-tp-surface p-5 sm:p-7">
        <VocabularyPicker topics={vocab.topics} tags={vocab.tags} value={{ topics: form.topics, tags: form.tags }} onChange={(next) => setForm((current) => ({ ...current, ...next }))} allowReserved help="Elige de la lista existente." />
        <div className="flex flex-col gap-3">
          <label className="inline-flex min-h-11 items-center gap-3 text-sm font-bold">
            <input type="checkbox" checked={form.isExam} onChange={(event) => set('isExam', event.target.checked)} className="h-5 w-5 accent-tp-violet" />
            Está en una carpeta de examen
          </label>
          {form.isExam && (
            <>
              {base.examFolder && !vocab.folders.some((folder) => String(folder._id) === String(base.examFolder)) && <p className="text-sm text-tp-ink-muted">Carpeta actual: {base.examFolderPath.join(' › ')}</p>}
              <ExamFolderPicker token={token} folders={vocab.folders} value={form.examFolder} onChange={(folderId) => set('examFolder', folderId)} onFolderCreated={() => {}} allowCreate={false} />
              <label className="max-w-xs text-sm font-semibold">
                Número de problema (opcional)
                <input type="number" min={1} max={999} inputMode="numeric" value={form.problemNumber} onChange={(event) => set('problemNumber', event.target.value)} className="tp-input mt-1 font-normal" />
              </label>
            </>
          )}
        </div>
      </section>

      {state.error && (
        <div role="alert" className="tp-card-quiet bg-tp-orange-soft p-4 text-sm leading-6">
          <p className="font-bold">{state.error}</p>
          {state.checks.length > 1 && <ul className="mt-2 list-disc pl-5">{state.checks.map((check) => <li key={`${check.code}-${check.message}`}>{check.message}</li>)}</ul>}
        </div>
      )}
      {state.saved !== null && <p role="status" className="tp-card-quiet bg-tp-mint-soft p-4 text-sm font-semibold">Guardado: {state.saved} {state.saved === 1 ? 'campo cambió' : 'campos cambiaron'}. Ya está en el sitio y los admins recibieron un aviso.</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state.busy} className="tp-button bg-tp-ink px-5 font-black text-white disabled:opacity-60">{state.busy ? 'Guardando…' : 'Guardar cambios'}</button>
        <button type="button" onClick={() => { setForm(toForm(base)); setState({ busy: false, error: null, checks: [], saved: null }) }} className="min-h-11 px-2 font-semibold text-tp-ink-muted underline underline-offset-2">Deshacer lo que no guardé</button>
      </div>
    </form>
  )
}
