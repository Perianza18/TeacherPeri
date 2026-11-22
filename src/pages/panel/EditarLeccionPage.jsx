import { useDeferredValue, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import PanelShell, { LoadState, Segmented } from '../../components/panel/PanelShell'
import ArticleText from '../../components/training/ArticleText'
import { apiFetch } from '../../lib/api'
import { codesOfKey, parseArticle } from '../../lib/theoryArticle'
import { insertSnippet } from '../../lib/lessonMarkup'
import ToolbarA from '../../components/lessonEditor/ToolbarA'
import ToolbarB from '../../components/lessonEditor/ToolbarB'
import { useApiData } from '../../lib/panel'

const LIMITS = { title: 200, summary: 600, content: 200000 }

// Problem boxes ([[collection:…]]) need data from the bank; the preview
// shows where they go instead.
const BOX_NAMES = { ejercicios: 'Ejercicios', practice: 'Práctica', dificiles: 'Reto' }
function CollectionPlaceholder(slug, kind) {
  const codes = codesOfKey(slug)
  return (
    <div className="tp-card-quiet bg-tp-yellow-soft p-4 font-sans text-sm">
      <strong>Caja de problemas · {BOX_NAMES[kind] ?? kind}</strong> {codes ? codes.join(', ') : `«${slug}»`}. En la lección publicada aquí aparecen sus problemas.
    </div>
  )
}

// /panel/teoria/:id/editar — an editor changes a lesson's text, with the
// lesson renderer as a live preview.
export default function EditarLeccionPage() {
  const { id } = useParams()
  return (
    <PanelShell title="Editar lección" lead="Escribe con el formato de lecciones (docs/CONTENT.md). La vista previa usa el mismo diseño que la lección publicada." wide>
      {(auth) => <Loader key={id} id={id} token={auth.token} />}
    </PanelShell>
  )
}

function Loader({ id, token }) {
  const item = useApiData(`/api/editor/theory/${id}`, token)
  if (!item.data) return <LoadState loading={item.loading} error={item.error} />
  return <LessonForm initial={item.data} token={token} />
}

function LessonForm({ initial, token }) {
  const id = useId()
  const [base, setBase] = useState(initial)
  const [form, setForm] = useState({ title: initial.title, summary: initial.summary, content: initial.content })
  const [view, setView] = useState('write')
  const textarea = useRef(null)
  const pendingSelection = useRef(null)
  // While the two toolbar designs are in review: ?variante=a (default) or b.
  const [params, setParams] = useSearchParams()
  const variante = params.get('variante') === 'b' ? 'b' : 'a'
  const [state, setState] = useState({ busy: false, error: null, saved: null })
  const deferred = useDeferredValue(form.content)
  const article = useMemo(() => parseArticle(deferred), [deferred])
  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  // Toolbar: build(selected) → snippet, written at the cursor (or around the
  // selection); then the new text stays selected so the author types over it.
  const insert = (build) => {
    const el = textarea.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const next = insertSnippet(form.content, start, end, build(form.content.slice(start, end)))
    pendingSelection.current = [next.start, next.end]
    set('content', next.value)
  }
  // After the new text is on screen, put the cursor on the inserted part.
  useLayoutEffect(() => {
    const el = textarea.current
    if (!el || !pendingSelection.current) return
    const [start, end] = pendingSelection.current
    pendingSelection.current = null
    el.focus()
    el.setSelectionRange(start, end)
  }, [form.content])

  const save = async (event) => {
    event.preventDefault()
    setState({ busy: true, error: null, saved: null })
    try {
      const result = await apiFetch(`/api/editor/theory/${base._id}`, { method: 'PUT', token, body: { ...form, baseUpdatedAt: base.updatedAt } })
      setBase(result.item)
      setState({ busy: false, error: null, saved: result.changed.length })
    } catch (error) {
      setState({ busy: false, error: error.message, saved: null })
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-wrap items-center gap-2">
        {base.publicationStatus !== 'published' && <span className="tp-pill bg-tp-yellow-soft text-xs">No publicada</span>}
        {base.publicationStatus === 'published' && <Link to={`/entrenamiento/teoria/${base._id}`} className="min-h-11 content-center px-1 text-sm font-bold text-tp-violet underline underline-offset-2">Ver lección</Link>}
      </div>
      <section className="tp-card-soft grid gap-5 bg-tp-surface p-5 sm:p-7 lg:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-bold">
          Título
          <input value={form.title} onChange={(event) => set('title', event.target.value)} maxLength={LIMITS.title} required className="tp-input font-normal" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-bold">
          Resumen
          <textarea value={form.summary} onChange={(event) => set('summary', event.target.value)} maxLength={LIMITS.summary} rows={2} required className="tp-input font-normal" />
        </label>
      </section>

      <div className="tp-card-quiet flex flex-col gap-2 bg-tp-yellow-soft p-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold">Diseño de la barra (en revisión)</p>
        <Segmented label="Diseño de la barra" value={variante} onChange={(value) => setParams((current) => { const next = new URLSearchParams(current); next.set('variante', value); return next }, { replace: true })} options={[{ value: 'a', label: 'Opción A' }, { value: 'b', label: 'Opción B' }]} />
      </div>
      <div className="xl:hidden">
        <Segmented label="Vista" value={view} onChange={setView} options={[{ value: 'write', label: 'Escribir' }, { value: 'preview', label: 'Vista previa' }]} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className={`flex min-w-0 flex-col gap-2 ${view === 'write' ? '' : 'hidden xl:flex'}`}>
          <label htmlFor={`${id}-texto`} className="text-sm font-bold">Texto de la lección</label>
          {variante === 'a' && <ToolbarA insert={insert} />}
          <div className={variante === 'b' ? 'flex min-w-0 flex-col gap-3 md:flex-row' : ''}>
            {variante === 'b' && <ToolbarB insert={insert} />}
            <textarea ref={textarea} id={`${id}-texto`} value={form.content} onChange={(event) => set('content', event.target.value)} maxLength={LIMITS.content} spellCheck className="tp-input min-h-[70vh] w-full min-w-0 font-mono text-sm leading-6" />
          </div>
          <p className="text-xs text-tp-ink-muted">{form.content.length.toLocaleString('es-MX')} caracteres</p>
        </div>
        <section aria-label="Vista previa" className={`tp-card-soft min-w-0 bg-tp-paper p-5 sm:p-7 ${view === 'preview' ? '' : 'hidden xl:block'} xl:max-h-[calc(70vh+44px)] xl:overflow-y-auto`}>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-tp-ink-muted">Vista previa</p>
          <h2 className="tp-page-title mb-2 text-[32px]">{form.title}</h2>
          <p className="tp-lead mb-6 text-tp-ink-soft">{form.summary}</p>
          <div className="tp-reading-text flex flex-col gap-[22px]">
            <ArticleText article={article} practice={null} renderCollection={CollectionPlaceholder} />
          </div>
        </section>
      </div>

      {state.error && <p role="alert" className="tp-card-quiet bg-tp-coral-soft p-4 text-sm font-bold">{state.error}</p>}
      {state.saved !== null && <p role="status" className="tp-card-quiet bg-tp-mint-soft p-4 text-sm font-semibold">Guardado: {state.saved} {state.saved === 1 ? 'campo cambió' : 'campos cambiaron'}. Ya está en el sitio y los admins recibieron un aviso.</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state.busy} className="tp-button bg-tp-ink px-5 font-black text-white disabled:opacity-60">{state.busy ? 'Guardando…' : 'Guardar cambios'}</button>
        <button type="button" onClick={() => { setForm({ title: base.title, summary: base.summary, content: base.content }); setState({ busy: false, error: null, saved: null }) }} className="min-h-11 px-2 font-semibold text-tp-ink-muted underline underline-offset-2">Deshacer lo que no guardé</button>
      </div>
    </form>
  )
}
