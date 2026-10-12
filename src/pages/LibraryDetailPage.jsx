import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import MathText from '../components/math/MathText'

const CONFIG = { teoria: { api: 'theory', label: 'Teoría' }, listas: { api: 'lists', label: 'Listas' }, examenes: { api: 'exams', label: 'Exámenes' }, problemas: { api: 'problems', label: 'Problemas' } }

function ArticleText({ text, problems = [], context = '' }) {
  const major = new Set(['IDEAS CLAVE', 'EJEMPLO TRABAJADO', 'ERRORES FRECUENTES', 'PRACTICA', 'EN RESUMEN', 'AMPLIACIÓN Y COMPROBACIONES'])
  const blocks = String(text).split(/\n\n/)
  return blocks.flatMap((block, i) => {
    const lines = block.split('\n')
    const headings = []
    while (lines.length && /^[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ0-9 —:–,¿?()./-]+$/.test(lines[0]) && lines[0].length < 110) {
      const title = lines.shift()
      headings.push(major.has(title)
        ? <h2 key={`${i}-h${headings.length}`} className="mt-10 mb-4 border-l-4 border-violet-500 pl-4 text-lg font-black text-brand-900">{title === 'PRACTICA' ? 'PRÁCTICA' : title}</h2>
        : <h3 key={`${i}-h${headings.length}`} className="mt-6 text-sm font-black text-brand-900">{title}</h3>)
    }
    const practice = problems.filter((_, index) => Math.min(blocks.length - 1, Math.floor((index + 1) * blocks.length / (problems.length + 1))) === i)
    return [...headings, ...(lines.length ? [<MathText key={i} text={lines.join('\n')} className="my-5 whitespace-pre-wrap text-base leading-8 text-brand-900" />] : []), ...practice.map((problem) => <ProblemPreview key={`practice-${problem._id}`} problem={problem} context={context} />)]
  })
}
function ProblemPreview({ problem, context }) {
  return <aside className="tp-card-soft my-10 bg-accent-yellow p-5 sm:p-7">
    <p className="text-xs font-black uppercase tracking-widest">Tu turno · Del banco de problemas</p>
    <h3 className="mt-3 text-xl font-black">{problem.titulo || problem.codigo}</h3>
    <MathText text={problem.enunciado} className="mt-4 whitespace-pre-wrap leading-8" />
    <Link className="tp-button mt-5 bg-white px-4 py-2 font-bold" to={`/entrenamiento/problemas/${problem._id}${context}`}>Resolver problema →</Link>
  </aside>
}

const safeUrl = (url) => /^https?:\/\//i.test(url || '')

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
        const problems = type === 'teoria' ? (await Promise.all(problemIds.map((id) => apiFetch(`/api/problems/${id}`).catch(() => null)))).filter(Boolean) : []
        if (!cancelled) setResult({ key, item, error: null, paths: paths.items || [], route: belongs ? route : null, problems })
      })
      .catch((error) => { if (!cancelled) setResult({ key, item: null, error: error.status === 404 ? 'Este contenido no está disponible públicamente.' : error.message, paths: [] }) })
    return () => { cancelled = true }
  }, [config.api, id, type, key, traversal])
  const title = type === 'examenes' && item ? `${item.competition} ${item.year} · ${item.round}` : item?.title || item?.titulo || item?.codigo
  const fromPath = location.state?.fromPath
  return <section className="tp-reading min-h-[70vh] px-4 pb-24 pt-12 sm:px-6"><div className="mx-auto max-w-4xl">
    <div className="flex flex-wrap gap-4 text-sm font-semibold"><Link to={`/entrenamiento/${type}`} className="text-violet-700">← Volver a {config.label}</Link>{fromPath && <Link to={fromPath} className="text-brand-700">← Volver a la Ruta</Link>}</div>
    {result.key === key && result.route && <nav aria-label="Recorrido de aprendizaje" className="mt-6 flex flex-wrap gap-2 text-sm font-bold">{result.route.breadcrumbs.map((crumb, index, crumbs) => <span key={crumb.slug}>{index > 0 && ' › '}{index === crumbs.length - 1 && type === 'teoria' ? <span aria-current="page">{crumb.title}</span> : <Link className="underline underline-offset-4" to={`/rutas/${crumbs.slice(0, index + 1).map((entry) => encodeURIComponent(entry.slug)).join('/')}`}>{crumb.title}</Link>}</span>)}</nav>}
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
        {item.hint && <details className="mt-8 rounded-xl border border-brand-300 bg-brand-50 p-4"><summary className="cursor-pointer font-bold">Ver pista</summary><MathText text={item.hint} className="mt-4 leading-7" /></details>}
        {item.solution && <details className="mt-4 rounded-xl border border-brand-300 bg-white p-4"><summary className="cursor-pointer font-bold">Ver solución razonada</summary><MathText text={item.solution} className="mt-4 whitespace-pre-wrap leading-8" /></details>}
        {item.content && <ArticleText text={item.content} problems={result.problems} context={context} />}
        {item.instructions && <p className="mb-6 whitespace-pre-wrap rounded-xl bg-accent-yellow/30 p-5 leading-7">{item.instructions}</p>}
        {['listas', 'examenes'].includes(type) && <>
          {safeUrl(item.sourceUrl) && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="tp-button inline-block bg-brand-900 px-4 py-2 text-sm font-bold text-white">Consultar fuente original ↗</a>}
          {safeUrl(item.pdfUrl) && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="ml-3 text-sm font-bold underline">PDF en la fuente ↗</a>}
          <ol className="mt-8 space-y-4">{item.problems?.map(({ position, problem }) => <li key={position} className="rounded-xl border-2 border-brand-300 bg-white p-5"><p className="text-xs font-bold text-violet-600">Problema {position}</p>{problem ? <><Link className="mt-2 block font-bold text-brand-900 hover:text-violet-700" to={`/entrenamiento/problemas/${problem._id}`}>{problem.titulo || problem.codigo} →</Link><MathText text={problem.enunciado} className="mt-3 leading-7 text-brand-700" /></> : <p className="mt-2 text-brand-500">Problema no disponible públicamente.</p>}</li>)}</ol>
        </>}
      </div>
      {result.route && type === 'teoria' && <div className="mb-8"><Link className="text-sm font-bold underline" to={`/rutas/${traversal}?pasos=1`}>Ver recursos y registrar mi progreso →</Link></div>}
      {type === 'teoria' && <aside className="tp-card mb-10 bg-accent-mint p-6 sm:p-8"><p className="text-xs font-black uppercase tracking-widest">De la idea a la práctica</p><h2 className="mt-3 text-2xl font-black">Ahora te toca explorar.</h2><p className="mt-3 leading-7">Prueba lo que aprendiste con los problemas de este tema en la Zona de Entrenamiento.</p><Link className="tp-button mt-5 bg-white px-5 py-3 font-bold" to={`/entrenamiento/problemas?topics=${encodeURIComponent((item.topics || []).map((topic) => topic._id || topic).join(','))}`}>Explorar problemas del tema →</Link></aside>}
      {result.paths.length > 0 && <aside className="border-t-2 border-brand-300 pt-6"><h2 className="font-black text-brand-900">Continúa en una Ruta</h2><div className="mt-3 flex flex-wrap gap-3">{result.paths.map((p) => <Link key={p._id} className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-bold text-violet-700" to={`/rutas/${p.slug}`}>{p.title} →</Link>)}</div></aside>}
    </article>}
  </div></section>
}
