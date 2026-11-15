import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import MathText from '../components/math/MathText'
import TheoryView from '../components/theory/TheoryView'
import { LIBRARY_BASE } from '../lib/libraryPaths'
import { collectionSlugs } from '../lib/theoryArticle'
import { hintLabel, splitHints } from '../lib/hints'

const CONFIG = { teoria: { api: 'theory', label: 'Teoría' }, listas: { api: 'lists', label: 'Listas' }, examenes: { api: 'exams', label: 'Exámenes' }, problemas: { api: 'problems', label: 'Problemas' } }

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

  return <section className="tp-reading min-h-[70vh] px-4 pb-24 pt-12 sm:px-6"><div className="mx-auto max-w-4xl">
    {!route && (!traversal || item || error) && <Link to={LIBRARY_BASE[config.api]} className="text-sm font-semibold text-violet-700">← Volver a {config.label}</Link>}
    {result.key === key && result.route && <nav aria-label="Recorrido de aprendizaje" className="mt-6 flex flex-wrap gap-2 text-sm font-bold">{result.route.breadcrumbs.map((crumb, index, crumbs) => <span key={crumb.slug}>{index > 0 && ' › '}<Link className="underline underline-offset-4" to={`/rutas/${crumbs.slice(0, index + 1).map((entry) => encodeURIComponent(entry.slug)).join('/')}`}>{crumb.title}</Link></span>)}</nav>}
    {error && <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
    {!item && !error && <p className="mt-8 text-brand-500">Cargando contenido…</p>}
    {item && <article className="mt-8 min-w-0">
      <header className="tp-card bg-accent-sky p-6 sm:p-9"><p className="text-xs font-black uppercase tracking-widest text-accent-violet">{config.label} {item.codigo && `· ${item.codigo}`}</p><h1 className="mt-3 break-words text-3xl font-black tracking-tight text-brand-900 sm:text-5xl">{title}</h1>{item.summary && <p className="mt-5 text-lg leading-8 text-brand-600">{item.summary}</p>}
        {item.sourceAttribution && <p className="mt-4 text-sm leading-6 text-brand-500">{item.sourceAttribution}</p>}
        {item.authors?.length > 0 && <p className="mt-4 text-sm text-brand-600">Autoría: {item.authors.join(', ')}</p>}
        {item.organization && <p className="mt-4 text-sm text-brand-600">{item.organization}{item.country && ` · ${item.country}`}{item.durationMinutes && ` · ${item.durationMinutes} minutos`}</p>}
      </header>
      <div className="mx-auto max-w-[760px] py-8">
        {item.enunciado && <MathText text={item.enunciado} className="whitespace-pre-wrap text-lg leading-8 text-brand-900" />}
        {splitHints(item.hint).map((hint, index, hints) => <details key={index} className={`${index === 0 ? 'mt-8' : 'mt-3'} rounded-xl border border-brand-300 bg-brand-50 p-4`}><summary className="cursor-pointer font-bold">{hintLabel(index, hints.length)}</summary><MathText text={hint} className="mt-4 leading-7" /></details>)}
        {item.solution && <details className="mt-4 rounded-xl border border-brand-300 bg-white p-4"><summary className="cursor-pointer font-bold">Ver solución razonada</summary><MathText text={item.solution} className="mt-4 whitespace-pre-wrap leading-8" /></details>}
        {item.instructions && <p className="mb-6 whitespace-pre-wrap rounded-xl bg-accent-yellow/30 p-5 leading-7">{item.instructions}</p>}
        {['listas', 'examenes'].includes(type) && <>
          {safeUrl(item.sourceUrl) && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="tp-button inline-block bg-brand-900 px-4 py-2 text-sm font-bold text-white">Consultar fuente original ↗</a>}
          {safeUrl(item.pdfUrl) && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="ml-3 text-sm font-bold underline">PDF en la fuente ↗</a>}
          <ol className="mt-8 space-y-4">{item.problems?.map(({ position, problem }) => <li key={position} className="rounded-xl border-2 border-brand-300 bg-white p-5"><p className="text-xs font-bold text-violet-600">Problema {position}</p>{problem ? <><Link className="mt-2 block font-bold text-brand-900 hover:text-violet-700" to={`/entrenamiento/problemas/${problem._id}`}>{problem.titulo || problem.codigo} →</Link><MathText text={problem.enunciado} className="mt-3 leading-7 text-brand-700" /></> : <p className="mt-2 text-brand-500">Problema no disponible públicamente.</p>}</li>)}</ol>
        </>}
      </div>
      {relatedRoutes.length > 0 && <aside className="border-t-2 border-brand-300 pt-6"><h2 className="font-black text-brand-900">Continúa en una Ruta</h2><div className="mt-3 flex flex-wrap gap-3">{relatedRoutes.map((p) => <Link key={p._id} className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-bold text-violet-700" to={`/rutas/${p.slug}`}>{p.title} →</Link>)}</div></aside>}
    </article>}
  </div></section>
}
