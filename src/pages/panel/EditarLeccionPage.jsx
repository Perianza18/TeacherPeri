import { useDeferredValue, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PanelShell, { LoadState, Segmented } from '../../components/panel/PanelShell'
import ArticleText from '../../components/training/ArticleText'
import PracticeBox from '../../components/content/PracticeBox'
import LessonToolbar from '../../components/lessonEditor/LessonToolbar'
import LessonTextarea from '../../components/lessonEditor/LessonTextarea'
import { apiFetch } from '../../lib/api'
import { codesOfKey, parseArticle } from '../../lib/theoryArticle'
import { insertSnippet } from '../../lib/lessonMarkup'
import { boxesSignature, loadLessonBoxes } from '../../lib/lessonBoxes'
import { useApiData } from '../../lib/panel'

const LIMITS = { title: 200, summary: 600, content: 200000 }

const BOX_NAMES = { ejercicios: 'Ejercicios', practice: 'Práctica', dificiles: 'Reto' }

// A problem box the preview could not fill (unknown slug or codes, or
// problems that are not public): says so instead of hiding it.
function MissingBox({ slug, kind }) {
  const codes = codesOfKey(slug)
  return (
    <div className="tp-card-quiet bg-tp-coral-soft p-4 font-sans text-sm">
      <strong>Caja de problemas · {BOX_NAMES[kind] ?? kind}</strong>: {codes ? `no se encontraron problemas públicos con ${codes.join(', ')}` : `no hay una colección publicada «${slug}»`}. En la lección publicada esta caja no aparecería.
    </div>
  )
}

// `[[practice]]`: on the site it shows the problems of the lesson's step in
// the Ruta, which the editor does not know.
const RUTA_PRACTICE = (
  <div className="tp-card-quiet bg-tp-yellow-soft p-4 font-sans text-sm">
    <strong>Práctica de la Ruta</strong>: en la lección publicada aquí aparecen los problemas de su paso en la Ruta.
  </div>
)

// The real problem boxes of the text being written, like the lesson page.
// Reloaded only when the box references change.
function usePreviewBoxes(content) {
  const signature = boxesSignature(content)
  const [state, setState] = useState({ signature: null, boxes: {} })
  useEffect(() => {
    if (!signature) return undefined
    let cancelled = false
    const timer = setTimeout(() => {
      loadLessonBoxes(content).then((boxes) => { if (!cancelled) setState({ signature, boxes }) })
    }, 400)
    return () => { cancelled = true; clearTimeout(timer) }
    // `content` is read only when the boxes change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])
  return { boxes: state.boxes, ready: state.signature === signature }
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
  const [state, setState] = useState({ busy: false, error: null, saved: null })
  const deferred = useDeferredValue(form.content)
  const article = useMemo(() => parseArticle(deferred), [deferred])
  const preview = usePreviewBoxes(deferred)
  const renderBox = (slug, kind) => {
    const list = preview.boxes[`${slug}:${kind}`]
    if (list?.length) return <PracticeBox kind={kind} problems={list} />
    if (!preview.ready) return <p className="font-sans text-sm text-tp-ink-muted">Cargando caja de problemas…</p>
    // Like the lesson page: an empty practice collection falls back to the Ruta practice.
    if (kind === 'practice' && !slug.startsWith('problems:')) return RUTA_PRACTICE
    return <MissingBox slug={slug} kind={kind} />
  }
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

      <div className="xl:hidden">
        <Segmented label="Vista" value={view} onChange={setView} options={[{ value: 'write', label: 'Escribir' }, { value: 'preview', label: 'Vista previa' }]} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className={`flex min-w-0 flex-col gap-2 ${view === 'write' ? '' : 'hidden xl:flex'}`}>
          <label htmlFor={`${id}-texto`} className="text-sm font-bold">Texto de la lección</label>
          <LessonToolbar insert={insert} />
          <LessonTextarea ref={textarea} id={`${id}-texto`} value={form.content} onChange={(value) => set('content', value)} maxLength={LIMITS.content} />
          <p className="text-xs text-tp-ink-muted">{form.content.length.toLocaleString('es-MX')} caracteres</p>
        </div>
        <section aria-label="Vista previa" className={`tp-card-soft min-w-0 bg-tp-paper p-5 sm:p-7 ${view === 'preview' ? '' : 'hidden xl:block'} xl:max-h-[calc(70vh+44px)] xl:overflow-y-auto`}>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-tp-ink-muted">Vista previa</p>
          <h2 className="tp-page-title mb-2 text-[32px]">{form.title}</h2>
          <p className="tp-lead mb-6 text-tp-ink-soft">{form.summary}</p>
          <div className="tp-reading-text flex flex-col gap-[22px]">
            <ArticleText article={article} practice={article.hasPracticeMarker ? RUTA_PRACTICE : null} renderCollection={renderBox} />
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
