import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import MathText from '../math/MathText'
import { Ejemplo, ErrorComun, RespuestasDeControl } from '../content/Bloques'
import { useAuth } from '../../context/useAuth'
import { apiFetch } from '../../lib/api'
import { LIBRARY_BASE } from '../../lib/libraryPaths'
import { levelLabel, parseTheoryContent, readingMinutes } from '../../lib/theoryArticle'
import { buildRutaContext } from '../../lib/rutaContext'

// Theory detail page (spec «Página de teoría»). One page, two contexts:
// opened from a Ruta step (`route` is the validated `?ruta=` traversal) or
// from the Teoría library (`route` is null).

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`

function commentLabel(count) {
  if (count == null) return ''
  return count === 0 ? 'Sin comentarios' : plural(count, 'comentario', 'comentarios')
}

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
    <section aria-labelledby="teoria-titulo" className="border-b-3 border-tp-ink bg-tp-sky">
      <div className="tp-container flex flex-col gap-3 pb-9 pt-7">
        <Breadcrumbs items={crumbs} />
        <span className="tp-kicker self-start">{topic ? `Teoría · ${topic}` : 'Teoría'}</span>
        <h1 id="teoria-titulo" className="tp-h1 max-w-[860px]">{title}</h1>
        {summary && <p className="tp-lead max-w-[680px]">{summary}</p>}
        {meta.length > 0 && (
          <p className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1 text-xs font-extrabold uppercase tracking-[0.1em]">
            {meta.map((entry) => <span key={entry}>{entry}</span>)}
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
          {section.number}. {section.title}
        </a>
      ))}
    </nav>
  )
}

function ContentBlock({ block }) {
  switch (block.type) {
    case 'h2':
      return <h2 id={block.id} className={`tp-lesson-heading tp-lesson-heading-${(block.number - 1) % 4} mt-4 scroll-mt-24`}>{block.number}. {block.title}</h2>
    case 'h3':
      return <MathText as="h3" text={block.title} className="mt-1.5 font-display text-xl font-extrabold leading-[1.3]" />
    case 'list':
      return (
        <ol start={block.start} className="flex list-decimal flex-col gap-1.5 pl-[22px]">
          {block.items.map((text, index) => <li key={index}><MathText text={text} className="whitespace-pre-line" /></li>)}
        </ol>
      )
    case 'answers':
      return <RespuestasDeControl text={block.text} />
    case 'example':
      return <Ejemplo number={block.number} title={block.title}>{block.children.map((child, index) => <ContentBlock key={index} block={child} />)}</Ejemplo>
    case 'mistakes':
      return block.children.length > 0 && <ErrorComun>{block.children.map((child, index) => <ContentBlock key={index} block={child} />)}</ErrorComun>
    default:
      return <MathText text={block.text} className="whitespace-pre-line" />
  }
}

// One yellow box with compact rows. Problems have no titles: only the
// meta line, the statement and «Resolver →».
function PracticeBox({ problems, context }) {
  return (
    <section aria-labelledby="practica-titulo" className="tp-box-strong flex flex-col gap-3 bg-tp-yellow px-5 py-[18px]">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="tp-kicker tp-kicker-ink font-sans tracking-[0.12em]">Practica</span>
        <h3 id="practica-titulo" className="font-sans text-[15px] font-bold">{plural(problems.length, 'problema', 'problemas')} para esta lección</h3>
      </div>
      <ol className="flex flex-col gap-2.5">
        {problems.map((problem, index) => {
          const meta = [levelLabel(problem.difficulty), commentLabel(problem.commentCount)].filter(Boolean).join(' · ')
          return (
            <li key={problem._id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-xl border-2 border-tp-ink bg-tp-surface px-4 py-3.5">
              <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-0.5">
                {meta && <span className="font-sans text-[13px] font-semibold text-tp-ink-muted">{meta}</span>}
                <MathText text={problem.enunciado} className="line-clamp-3" />
              </div>
              <Link to={`${LIBRARY_BASE.problems}/${problem._id}${context}`} aria-label={`Resolver problema ${index + 1}`} className="tp-button whitespace-nowrap bg-tp-mint px-4 font-sans text-[15px] font-bold text-tp-ink">Resolver<Arrow /></Link>
            </li>
          )
        })}
      </ol>
    </section>
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
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return { completed, parentProgress: current.parent, busy, error, toggle }
}

function TheoryPage({ item, route, ancestors, problems, relatedRoutes, context }) {
  const article = useMemo(() => parseTheoryContent(item.content), [item.content])
  const ruta = useMemo(() => (route ? buildRutaContext(route, ancestors) : null), [route, ancestors])
  const strip = ruta?.strip || null
  const completion = useStepCompletion(strip)
  const [notice, setNotice] = useState('')

  const crumbs = ruta?.crumbs || [
    { label: 'Entrenamiento', href: '/entrenamiento' },
    { label: 'Teoría', href: LIBRARY_BASE.theory },
    { label: item.title, current: true },
  ]
  const meta = [
    `Lectura · ${readingMinutes(item.content)} min`,
    levelLabel(item.level),
    problems.length > 0 && plural(problems.length, 'problema de práctica', 'problemas de práctica'),
  ].filter(Boolean)
  const sections = article.items.filter((block) => block.type === 'h2')
  // The practice box sits right before «En resumen», or at the end.
  const summaryIndex = article.items.findIndex((block) => block.type === 'h2' && block.key === 'EN RESUMEN')
  const practiceAt = summaryIndex >= 0 ? summaryIndex : article.items.length
  const practice = problems.length > 0 && <PracticeBox key="practica" problems={problems} context={context} />

  return (
    <>
      <HeaderBand crumbs={crumbs} topic={item.topics?.[0]?.name} title={item.title} summary={item.summary} meta={meta} />
      {strip && <RutaStrip strip={strip} progress={completion.parentProgress} />}
      <div className="tp-container pb-16 pt-7">
        <article aria-labelledby="teoria-titulo" className="tp-reading-text mx-auto flex max-w-[840px] flex-col gap-[22px]">
          {sections.length > 0 && <LessonNav sections={sections} />}
          {article.lead && <MathText text={article.lead} className="whitespace-pre-line text-[19px]" />}
          {article.items.flatMap((block, index) => [index === practiceAt && practice, <ContentBlock key={index} block={block} />])}
          {practiceAt === article.items.length && practice}

          <div className="flex flex-col gap-2 pt-2 font-sans text-[15px]">
            <div className="flex flex-wrap items-center gap-3">
              {strip && (
                <button type="button" onClick={completion.toggle} disabled={completion.busy} aria-pressed={completion.completed} className="tp-button bg-tp-mint px-4 font-bold text-tp-ink disabled:opacity-60">
                  {completion.completed && <span aria-hidden="true">✓&nbsp;</span>}Marcar paso como completado
                </button>
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

export default function TheoryView({ item, error, route, ancestors = [], problems = [], relatedRoutes = [], context = '', rutaRequested = false }) {
  // «Rutas» is active in Ruta context; while loading, trust the query.
  const inRuta = item ? Boolean(route) : rutaRequested
  return (
    <>
      <Navbar activePath={inRuta ? '/rutas' : '/entrenamiento'} />
      <main className="min-h-screen bg-tp-paper pt-[72px] text-tp-ink">
        {item
          ? <TheoryPage item={item} route={route} ancestors={ancestors} problems={problems} relatedRoutes={relatedRoutes} context={context} />
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
