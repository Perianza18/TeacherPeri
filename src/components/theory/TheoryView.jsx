import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import ArticleText from '../training/ArticleText'
import PracticeBox from '../content/PracticeBox'
import RichText from '../content/RichText'
import { Celebration } from '../decor/Decor'
import { useAuth } from '../../context/useAuth'
import { apiFetch } from '../../lib/api'
import { LIBRARY_BASE } from '../../lib/libraryPaths'
import { collectionSlugs, levelLabel, parseArticle, readingMinutes } from '../../lib/theoryArticle'
import { buildRutaContext } from '../../lib/rutaContext'

// Theory detail page (spec «Página de teoría»). One page, two contexts:
// opened from a Ruta step (`route` is the validated `?ruta=` traversal) or
// from the Teoría library (`route` is null).

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`

function Arrow({ left = false }) {
  return <span aria-hidden="true">{left ? '← ' : ' →'}</span>
}

function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Migas" className="mb-1.5 text-[13px] font-semibold">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => (
          <li key={`${index}-${item.label}`} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href
              ? <Link to={item.href} className="underline underline-offset-2 hover:text-tp-violet">{item.label}</Link>
              : <span aria-current={item.current ? 'page' : undefined}>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function HeaderBand({ crumbs, topic, title, summary, meta }) {
  return (
    <section aria-labelledby="teoria-titulo" className="relative overflow-hidden border-b-3 border-tp-ink bg-tp-sky">
      <div aria-hidden="true" className="tp-graph absolute inset-0" />
      <div aria-hidden="true" className="tp-halftone absolute -right-24 -top-28 size-[440px] opacity-[.15] [mask-image:radial-gradient(circle,black_20%,transparent_68%)]" />
      <div className="tp-container relative flex flex-col gap-4 pb-12 pt-8 lg:pb-14">
        <Breadcrumbs items={crumbs} />
        <span className="tp-sticker -rotate-2 self-start bg-tp-yellow">{topic ? `Teoría · ${topic}` : 'Teoría'}</span>
        <h1 id="teoria-titulo" className="tp-page-title max-w-[900px]">{title}</h1>
        {summary && <p className="tp-lead max-w-[680px] text-[18px] text-tp-ink-soft">{summary}</p>}
        {meta.length > 0 && (
          <p className="flex flex-wrap gap-2 pt-1 text-xs font-extrabold uppercase tracking-[0.1em]">
            {meta.map((entry) => <span key={entry} className="rounded-full border-2 border-tp-ink bg-tp-surface px-3 py-1">{entry}</span>)}
          </p>
        )}
      </div>
    </section>
  )
}

// White «En la Ruta» strip. The bar shows completion only when the reader is
// signed in and the API returned progress; the text beside it says the same.
function RutaStrip({ strip, progress }) {
  return (
    <div className="border-b-2 border-tp-ink bg-tp-surface">
      <div className="tp-container flex flex-wrap items-center gap-x-5 gap-y-2.5 py-2.5">
        <span className="tp-eyebrow tracking-[0.12em]">En la Ruta</span>
        <Link to={strip.href} className="font-bold underline underline-offset-2 hover:text-tp-violet">{strip.label}</Link>
        {progress?.totalLeaves > 0 && (
          <>
            <div aria-hidden="true" className="h-3 min-w-16 flex-[0_1_200px] overflow-hidden rounded-full border-2 border-tp-ink bg-tp-surface">
              <div className="h-full bg-tp-violet" style={{ width: `${progress.percentage}%` }} />
            </div>
            <span className="text-[13px] font-semibold">{progress.completedLeaves} de {progress.totalLeaves} completados</span>
          </>
        )}
        {strip.position && <span className="text-[13px] font-semibold">Paso {strip.position} de {strip.total}</span>}
        {strip.next && <Link to={strip.next.href} className="ml-auto py-2.5 font-bold hover:text-tp-violet">Siguiente paso<Arrow /></Link>}
      </div>
    </div>
  )
}

// «En esta lección»: one pill per section. The pill looks ~34px tall; the
// invisible ::before extends its tap area to 44px.
function LessonNav({ sections }) {
  return (
    <nav aria-label="En esta lección" className="flex flex-wrap items-center gap-2 font-sans">
      <span className="tp-eyebrow mr-1 tracking-[0.12em]">En esta lección</span>
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`} className="relative rounded-full border-2 border-tp-ink bg-tp-surface px-[13px] py-[5px] text-sm font-semibold leading-normal hover:text-tp-violet before:absolute before:inset-x-0 before:-inset-y-[5px]">
          {section.number}. <RichText as="span" text={section.title} />
        </a>
      ))}
    </nav>
  )
}

function StepCard({ step, label, alignRight = false }) {
  return (
    <Link to={step.href} className={`tp-card-quiet flex flex-[1_1_240px] flex-col gap-0.5 bg-tp-surface px-4 py-3.5 hover:text-tp-violet ${alignRight ? 'text-right' : ''}`}>
      <span className="text-[13px] font-bold text-tp-ink-muted">{label}</span>
      <span className="font-extrabold">{step.title}</span>
    </Link>
  )
}

const DIVIDER = 'border-t-2 border-dashed border-tp-rule pt-[18px] font-sans'

// Signed-in progress of this step and of its parent Ruta, plus the toggle.
function useStepCompletion(strip) {
  const { auth, abrirModal } = useAuth()
  const leafSlug = strip?.leafSlug
  const parentSlug = strip?.parentSlug
  const token = auth?.token
  const key = auth && leafSlug ? `${auth.user.id}\u0000${leafSlug}` : null
  const [state, setState] = useState({ key: null, leaf: null, parent: null })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!key) return undefined
    let cancelled = false
    Promise.all([
      apiFetch(`/api/paths/${encodeURIComponent(leafSlug)}/progress`, { token }).catch(() => null),
      apiFetch(`/api/paths/${encodeURIComponent(parentSlug)}/progress`, { token }).catch(() => null),
    ]).then(([leaf, parent]) => { if (!cancelled) setState({ key, leaf, parent }) })
    return () => { cancelled = true }
  }, [key, token, leafSlug, parentSlug])

  const current = state.key === key ? state : { leaf: null, parent: null }
  const completed = current.leaf?.percentage === 100

  async function toggle() {
    if (!auth) { abrirModal(); return }
    setBusy(true)
    setError('')
    try {
      const result = await apiFetch(`/api/paths/${encodeURIComponent(leafSlug)}/completion`, { method: 'PUT', body: { completed: !completed }, token })
      const parent = await apiFetch(`/api/paths/${encodeURIComponent(parentSlug)}/progress`, { token }).catch(() => null)
      setState({ key, leaf: result.progress, parent })
      return result.progress?.percentage === 100
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return { completed, parentProgress: current.parent, busy, error, toggle }
}

function TheoryPage({ item, route, ancestors, problems, collections, relatedRoutes, context, renderCollection: renderCollectionProp, resolveFigure }) {
  const article = useMemo(() => parseArticle(item.content), [item.content])
  const ruta = useMemo(() => (route ? buildRutaContext(route, ancestors) : null), [route, ancestors])
  const strip = ruta?.strip || null
  const completion = useStepCompletion(strip)
  const [notice, setNotice] = useState('')
  // Bumped each time the reader marks the step complete, to replay «¡Listo!».
  const [celebration, setCelebration] = useState(0)
  const markStep = async () => { if (await completion.toggle()) setCelebration((count) => count + 1) }

  const crumbs = ruta?.crumbs || [
    { label: 'Entrenamiento', href: '/entrenamiento' },
    { label: 'Teoría', href: LIBRARY_BASE.theory },
    { label: item.title, current: true },
  ]
  // A `[[collection:<slug>:<kind>]]` box shows that collection's problems.
  // Without a collection, a practice box falls back to the lesson's problems
  // (from its Ruta steps); the other kinds stay hidden.
  const practice = problems.length > 0 ? <PracticeBox problems={problems} context={context} /> : null
  const collectionBox = (slug, kind) => {
    const list = collections[`${slug}:${kind}`]
    if (list?.length) return <PracticeBox kind={kind} problems={list} context={context} />
    return kind === 'practice' ? practice : null
  }
  const renderCollection = renderCollectionProp || collectionBox
  const practiceCount = collectionSlugs(item.content).reduce((count, slug) => count + (collections[`${slug}:practice`]?.length || 0), 0) || problems.length
  const meta = [
    `Lectura · ${readingMinutes(item.content)} min`,
    levelLabel(item.level),
    practiceCount > 0 && plural(practiceCount, 'problema de práctica', 'problemas de práctica'),
  ].filter(Boolean)
  const sections = article.sections

  return (
    <>
      <HeaderBand crumbs={crumbs} topic={item.topics?.[0]?.name} title={item.title} summary={item.description || item.summary} meta={meta} />
      {strip && <RutaStrip strip={strip} progress={completion.parentProgress} />}
      <div className="tp-container pb-16 pt-7">
        <article aria-labelledby="teoria-titulo" className="tp-reading-text mx-auto flex max-w-[840px] flex-col gap-[22px]">
          {sections.length > 0 && <LessonNav sections={sections} />}
          <ArticleText article={article} practice={practice} renderCollection={renderCollection} resolveFigure={resolveFigure} />

          <div className="flex flex-col gap-2 pt-2 font-sans text-[15px]">
            <div className="flex flex-wrap items-center gap-3">
              {strip && (
                <span className="relative inline-flex">
                  {celebration > 0 && <Celebration key={celebration} />}
                  <button type="button" onClick={markStep} disabled={completion.busy} aria-pressed={completion.completed} className="tp-button bg-tp-mint px-4 font-bold text-tp-ink disabled:opacity-60">
                    {completion.completed && <span aria-hidden="true">✓&nbsp;</span>}Marcar paso como completado
                  </button>
                </span>
              )}
              <button type="button" onClick={() => setNotice('Próximamente podrás guardar lecciones en tus listas.')} className="inline-flex min-h-11 items-center rounded-xl border-2 border-tp-ink bg-tp-surface px-4 font-bold">Guardar en lista</button>
              <Link to="/contacto" className="inline-flex min-h-11 items-center px-1 font-semibold text-tp-ink-muted underline underline-offset-2 hover:text-tp-ink">Sugerir cambio</Link>
            </div>
            <p aria-live="polite" className="text-sm text-tp-ink-muted">{completion.error || notice}</p>
          </div>

          {strip && (strip.prev || strip.next) && (
            <nav aria-label="Pasos de la Ruta" className={`flex flex-wrap gap-3.5 ${DIVIDER}`}>
              {strip.prev ? <StepCard step={strip.prev} label={<><Arrow left />Paso anterior</>} /> : <span aria-hidden="true" className="hidden flex-[1_1_240px] sm:block" />}
              {strip.next && <StepCard step={strip.next} label={<>Siguiente paso<Arrow /></>} alignRight />}
            </nav>
          )}
          {!strip && relatedRoutes.length > 0 && (
            <nav aria-labelledby="continua-titulo" className={`flex flex-col gap-3 ${DIVIDER}`}>
              <h2 id="continua-titulo" className="font-sans text-[13px] font-bold text-tp-ink-muted">Continúa en una Ruta</h2>
              <div className="flex flex-wrap gap-3.5">
                {relatedRoutes.map((path) => <StepCard key={path._id} step={{ title: path.title, href: `/rutas/${path.slug}` }} label={<>Abrir Ruta<Arrow /></>} />)}
              </div>
            </nav>
          )}
        </article>
      </div>
    </>
  )
}

// `collections` holds the loaded boxes, keyed `slug:kind` (from
// /api/collections). `renderCollection(slug, kind)` replaces that lookup
// (the dev test lesson uses it). `resolveFigure(src)` maps figure paths to
// URLs (default: public/figuras).
export default function TheoryView({ item, error, route, ancestors = [], problems = [], collections = {}, relatedRoutes = [], context = '', rutaRequested = false, renderCollection, resolveFigure }) {
  // «Rutas» is active in Ruta context; while loading, trust the query.
  const inRuta = item ? Boolean(route) : rutaRequested
  return (
    <>
      <Navbar activePath={inRuta ? '/rutas' : '/entrenamiento'} />
      <main className="min-h-screen bg-tp-paper pt-[72px] text-tp-ink">
        {item
          ? <TheoryPage item={item} route={route} ancestors={ancestors} problems={problems} collections={collections} relatedRoutes={relatedRoutes} context={context} renderCollection={renderCollection} resolveFigure={resolveFigure} />
          : (
            <div className="tp-container py-12">
              {error
                ? <p role="alert" className="tp-card-quiet bg-tp-coral-soft p-4">{error}</p>
                : <p className="text-tp-ink-muted">Cargando contenido…</p>}
            </div>
          )}
      </main>
      <Footer />
    </>
  )
}
