import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import MathText from '../components/math/MathText'
import TheoryView from '../components/theory/TheoryView'
import PageHero from '../components/PageHero'
import { SkeletonCard } from '../components/Skeleton'
import FlagButton from '../components/FlagButton'
import { LIBRARY_BASE } from '../lib/libraryPaths'
import { collectionSlugs } from '../lib/theoryArticle'
import { hintLabel, splitHints } from '../lib/hints'
import { problemSourceLabel } from '../lib/inicio'
import { useAuth } from '../context/useAuth'
import { canEdit, editProblemPath } from '../lib/panel'
import ProblemImages from '../components/images/ProblemImages'
import { byPlacement } from '../lib/images'

const CONFIG = { teoria: { api: 'theory', label: 'Teoría' }, listas: { api: 'lists', label: 'Listas' }, examenes: { api: 'exams', label: 'Exámenes' }, problemas: { api: 'problems', label: 'Problemas' } }

// Header band color: a problem takes its area's color (the same family as
// the strips on the library cards); lists and exams have their own.
const AREA_TONES = { 'Geometría': 'sky', 'Álgebra': 'violet', 'Combinatoria': 'coral', 'Teoría de Números': 'mint' }
const TYPE_TONES = { listas: 'mint', examenes: 'coral' }
const LEVELS = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' }

// «+» that turns into «×» while its <details> is open.
function Toggle() {
  return <span aria-hidden="true" className="ml-auto grid size-8 shrink-0 place-items-center rounded-full border-2 border-tp-ink bg-tp-surface text-lg font-extrabold leading-none transition-transform group-open:rotate-45">+</span>
}

const SUMMARY = 'flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden'

function Hints({ hint }) {
  const hints = splitHints(hint)
  if (!hints.length) return null
  return (
    <section aria-labelledby="pistas-titulo" className="flex flex-col gap-3">
      <h2 id="pistas-titulo" className="tp-eyebrow">{hints.length === 1 ? 'Pista' : `${hints.length} pistas, de menos a más`}</h2>
      {hints.map((text, index) => (
        <details key={index} className="group rounded-[14px] border-2 border-tp-ink bg-tp-yellow-soft shadow-[3px_3px_0_var(--tp-ink)] open:bg-tp-surface">
          <summary className={`${SUMMARY} px-5 py-3.5 font-bold`}>
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-tp-ink bg-tp-yellow text-sm font-extrabold">{hints.length > 1 ? index + 1 : '?'}</span>
            <span>{hintLabel(index, hints.length)}</span>
            <Toggle />
          </summary>
          <MathText text={text} className="tp-reading-text border-t-2 border-dashed border-tp-rule px-5 pb-5 pt-4 leading-7" />
        </details>
      ))}
    </section>
  )
}

// Two steps: opening the card first asks «¿Ya lo intentaste?»; only «Sí, ver
// la solución» shows it. «Me doy 5 minutos más» closes the card again.
function Solution({ solution, images }) {
  const [stage, setStage] = useState('closed') // closed | asking | shown
  const toggle = (event) => {
    event.preventDefault()
    setStage((current) => (current === 'closed' ? 'asking' : 'closed'))
  }

  return (
    <details open={stage !== 'closed'} className="group rounded-[14px] border-2 border-tp-ink bg-tp-surface">
      <summary onClick={toggle} className={`${SUMMARY} px-5 py-3.5 font-bold`}>
        <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-tp-ink bg-tp-mint-soft text-sm font-extrabold">✓</span>
        <span className="min-w-0 flex-1">Ver solución razonada</span>
        <Toggle />
      </summary>
      {stage === 'asking' && (
        <div className="flex flex-col items-start gap-4 border-t-2 border-dashed border-tp-rule px-5 pb-5 pt-4">
          <p className="tp-hand -rotate-1 text-[26px] leading-tight">¿Ya lo intentaste? Date 5 minutos más.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" autoFocus onClick={() => setStage('shown')} className="tp-button bg-tp-surface px-5 font-bold">Sí, ver la solución</button>
            <button type="button" onClick={() => setStage('closed')} className="tp-button bg-tp-yellow px-5 font-bold">Me doy 5 minutos más</button>
          </div>
        </div>
      )}
      {stage === 'shown' && (
        <div className="border-t-2 border-dashed border-tp-rule px-5 pb-5 pt-4">
          {solution && <MathText text={solution} className="tp-reading-text whitespace-pre-wrap leading-8" />}
          <ProblemImages images={images} placement="solution" className="mt-5" />
        </div>
      )}
    </details>
  )
}

const safeUrl = (url) => /^https?:\/\//i.test(url || '')

// Practice problem for the theory page, with its count of visible comments
// (null when the comments cannot be loaded).
function loadPracticeProblem(id) {
  return Promise.all([
    apiFetch(`/api/problems/${id}`),
    apiFetch(`/api/problems/${id}/comments`).then((list) => (Array.isArray(list) ? list.filter((comment) => !comment.deleted).length : null)).catch(() => null),
  ]).then(([problem, commentCount]) => ({ ...problem, commentCount })).catch(() => null)
}

// The problems of every `[[collection:<slug>:<kind>]]` in the lesson, keyed
// `slug:kind`. A slug that can't be loaded just leaves its boxes out.
function loadCollections(content) {
  return Promise.all(collectionSlugs(content).map((slug) => apiFetch(`/api/collections/${encodeURIComponent(slug)}`).catch(() => null)))
    .then((results) => Object.fromEntries(results.filter(Boolean).flatMap(({ slug, collections }) => Object.entries(collections).map(([kind, problems]) => [`${slug}:${kind}`, problems]))))
}

// The Path of every breadcrumb above the leaf, root first (null if missing).
function loadAncestors(crumbs) {
  return Promise.all(crumbs.slice(0, -1).map((crumb, index) => {
    const request = index === 0
      ? apiFetch(`/api/paths/${encodeURIComponent(crumb.slug)}`)
      : apiFetch(`/api/paths?traversal=${encodeURIComponent(crumbs.slice(0, index + 1).map((entry) => entry.slug).join('/'))}`)
    return request.then((detail) => detail.path).catch(() => null)
  }))
}

export default function LibraryDetailPage({ type }) {
  const { id } = useParams()
  const location = useLocation()
  const config = CONFIG[type]
  const { auth } = useAuth()
  const traversal = new URLSearchParams(location.search).get('ruta') || ''
  const context = traversal ? `?ruta=${encodeURIComponent(traversal)}` : ''
  const key = `${type}:${id}:${traversal}`
  const [result, setResult] = useState({ key: null, item: null, error: null, paths: [] })
  const item = result.key === key ? result.item : null
  const error = result.key === key ? result.error : null
  useEffect(() => {
    let cancelled = false
    apiFetch(`/api/${config.api}/${id}`)
      .then(async (item) => {
        const paths = await apiFetch(`/api/paths?contentType=${{ problemas: 'Problem', teoria: 'Theory', listas: 'List', examenes: 'Exam' }[type]}&contentId=${id}`).catch(() => [])
        const route = traversal ? await apiFetch(`/api/paths?traversal=${encodeURIComponent(traversal)}`).catch(() => null) : null
        const refs = route?.path?.steps?.flatMap((step) => step.teacherperiReferences) || []
        const belongs = refs.some((ref) => ref.available && String(ref.targetId) === id)
        const sourcePaths = type === 'teoria' && !belongs ? await Promise.all((paths.items || []).slice(0, 8).map((path) => apiFetch(`/api/paths/${encodeURIComponent(path.slug)}`).catch(() => null))) : []
        const problemRefs = belongs ? refs : sourcePaths.flatMap((path) => path?.path?.steps?.flatMap((step) => step.teacherperiReferences) || [])
        const problemIds = [...new Set(problemRefs.filter((ref) => ref.available && ref.contentType === 'Problem').map((ref) => ref.targetId))]
        const [problems, ancestors, collections] = type === 'teoria'
          ? await Promise.all([
            Promise.all(problemIds.map(loadPracticeProblem)).then((list) => list.filter(Boolean)),
            belongs ? loadAncestors(route.breadcrumbs) : [],
            loadCollections(item.content),
          ])
          : [[], [], {}]
        if (!cancelled) setResult({ key, item, error: null, paths: paths.items || [], route: belongs ? route : null, problems, ancestors, collections })
      })
      .catch((error) => { if (!cancelled) setResult({ key, item: null, error: error.status === 404 ? 'Este contenido no está disponible públicamente.' : error.message, paths: [] }) })
    return () => { cancelled = true }
  }, [config.api, id, type, key, traversal])
  const title = type === 'examenes' && item ? `${item.competition} ${item.year} · ${item.round}` : item?.title || item?.titulo || item?.codigo
  const route = result.key === key ? result.route : null
  const relatedRoutes = result.paths.filter((path) => !path.lessonOnly)

  // Theory has its own page (two contexts, see TheoryView). An invalid
  // `?ruta=` leaves `route` null, which falls back to the library version.
  if (type === 'teoria') {
    return <TheoryView item={item} error={error} route={route} ancestors={result.ancestors} problems={result.problems} collections={result.collections} relatedRoutes={relatedRoutes} context={route ? context : ''} rutaRequested={Boolean(traversal)} />
  }

  const isProblem = type === 'problemas'
  const tone = (isProblem && AREA_TONES[item?.tema]) || TYPE_TONES[type] || 'sky'
  const level = item && (item.dificultad || LEVELS[item.level || item.difficulty])
  const meta = item ? [
    isProblem && problemSourceLabel(item),
    item.tema,
    level,
    item.organization && [item.organization, item.country].filter(Boolean).join(' · '),
    item.durationMinutes && `${item.durationMinutes} minutos`,
    item.authors?.length > 0 && `Autoría: ${item.authors.join(', ')}`,
  ].filter(Boolean) : []

  const backLink = !route && (!traversal || item || error) && <Link to={LIBRARY_BASE[config.api]} className="text-sm font-bold underline underline-offset-2 hover:text-tp-violet">← Volver a {config.label}</Link>
  const routeNav = result.key === key && result.route && <nav aria-label="Recorrido de aprendizaje" className="flex flex-wrap gap-2 text-sm font-bold">{result.route.breadcrumbs.map((crumb, index, crumbs) => <span key={crumb.slug}>{index > 0 && ' › '}<Link className="underline underline-offset-4 hover:text-tp-violet" to={`/rutas/${crumbs.slice(0, index + 1).map((entry) => encodeURIComponent(entry.slug)).join('/')}`}>{crumb.title}</Link></span>)}</nav>

  if (!item) {
    return <section className="min-h-[70vh] bg-tp-paper"><div className="tp-container flex flex-col gap-6 py-12">
      {backLink}
      {routeNav}
      {error
        ? <p role="alert" className="tp-card-quiet max-w-[760px] bg-tp-coral-soft p-4">{error}</p>
        : <><p className="text-tp-ink-muted">Cargando contenido…</p><div className="max-w-[800px]"><SkeletonCard strip={false} strong /></div></>}
    </div></section>
  }

  return <article className="min-h-[70vh] min-w-0 bg-tp-paper text-tp-ink">
    <PageHero
      id="contenido-titulo"
      tone={tone}
      kicker={`${isProblem ? 'Problema' : config.label}${item.codigo ? ` · ${item.codigo}` : ''}`}
      title={<span className="break-words">{title}</span>}
      lead={item.summary}
      before={<>{backLink}{routeNav}</>}
      className="lg:pb-14"
    >
      {meta.length > 0 && <p className="flex flex-wrap gap-2">{meta.map((entry) => <span key={entry} className="rounded-full border-2 border-tp-ink bg-tp-surface px-3 py-1 text-xs font-extrabold uppercase tracking-[0.08em]">{entry}</span>)}</p>}
    </PageHero>

    <div className="tp-container pb-24 pt-12">
      <div className="mx-auto flex max-w-[800px] flex-col gap-8">
        {item.enunciado && <>
          <section aria-labelledby="enunciado-titulo" className="tp-box-strong bg-tp-surface p-6 sm:p-8">
            <h2 id="enunciado-titulo" className="tp-kicker tp-kicker-ink font-sans">Enunciado</h2>
            <MathText text={item.enunciado} className="tp-reading-text mt-5 whitespace-pre-wrap text-[20px] leading-[1.75]" />
            <ProblemImages images={item.images} className="mt-6" />
          </section>
          {(item.hint || item.solution) && <p className="tp-hand -mt-2 -rotate-1 pl-2 text-[26px] text-tp-violet">Toma papel y lápiz: inténtalo antes de abrir las pistas.</p>}
        </>}
        <Hints hint={item.hint} />
        {(item.solution || byPlacement(item.images, 'solution').length > 0) && <Solution solution={item.solution} images={item.images} />}
        {type === 'problemas' && <div className="flex flex-wrap items-center gap-3">
          <FlagButton targetType="problem" targetId={item._id} />
          {canEdit(auth) && <Link to={editProblemPath(item._id)} className="tp-button bg-tp-surface px-4 text-sm font-bold">Editar problema</Link>}
        </div>}

        {item.instructions && <p className="tp-card-quiet whitespace-pre-wrap bg-tp-yellow-soft p-5 leading-7">{item.instructions}</p>}
        {['listas', 'examenes'].includes(type) && <>
          {(safeUrl(item.sourceUrl) || safeUrl(item.pdfUrl)) && <div className="flex flex-wrap items-center gap-4">
            {safeUrl(item.sourceUrl) && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="tp-button bg-tp-ink px-5 text-sm font-bold text-white">Consultar fuente original ↗</a>}
            {safeUrl(item.pdfUrl) && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-sm font-bold underline underline-offset-2 hover:text-tp-violet">PDF en la fuente ↗</a>}
          </div>}
          <ol className="flex flex-col gap-5">{item.problems?.map(({ position, problem }) => <li key={position} className="tp-card-soft bg-tp-surface p-5 sm:p-6">
            <p className="tp-sticker -rotate-2 bg-tp-yellow text-[11px]">Problema {position}</p>
            {problem ? <><Link className="mt-4 block font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em] hover:text-tp-violet" to={`/entrenamiento/problemas/${problem._id}`}>{problem.titulo || problem.codigo} →</Link><MathText text={problem.enunciado} className="tp-reading-text mt-3 leading-7 text-tp-ink-soft" /></> : <p className="mt-3 text-tp-ink-muted">Problema no disponible públicamente.</p>}
          </li>)}</ol>
        </>}

        {item.sourceAttribution && <p className="rounded-[14px] border-2 border-dashed border-tp-rule p-4 text-sm leading-6 text-tp-ink-muted"><span className="font-bold text-tp-ink">Fuente: </span>{item.sourceAttribution}</p>}

        {relatedRoutes.length > 0 && <aside aria-labelledby="continua-titulo" className="flex flex-col gap-4 border-t-2 border-dashed border-tp-rule pt-8">
          <h2 id="continua-titulo" className="font-display text-[28px] font-extrabold tracking-[-0.03em]">Continúa en una Ruta</h2>
          <div className="flex flex-wrap gap-3">{relatedRoutes.map((p) => <Link key={p._id} className="tp-pill bg-tp-surface px-4 py-2 text-sm transition-colors hover:bg-tp-yellow" to={`/rutas/${p.slug}`}>{p.title}<span aria-hidden="true">→</span></Link>)}</div>
        </aside>}
      </div>
    </div>
  </article>
}
