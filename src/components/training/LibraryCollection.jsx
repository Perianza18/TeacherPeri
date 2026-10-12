import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import MathText from '../math/MathText'
import TrainingHeader from './TrainingHeader'

const PATHS = { theory: 'teoria', lists: 'listas', exams: 'examenes', problems: 'problemas' }
const LEVELS = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' }
const titleOf = (type, item) => type === 'exams' ? `${item.competition} ${item.year} · ${item.round}` : item.title || item.titulo

export default function LibraryCollection({ type, title, subtitle, onOpen }) {
  const location = useLocation()
  const [filters, setFilters] = useState({ q: '', topics: new URLSearchParams(location.search).get('topics') || '', tags: '', level: '', categories: [], year: [], subject: [], type: [] })
  const [page, setPage] = useState(1)
  const [folder, setFolder] = useState(null)
  const [metadata, setMetadata] = useState({ categories: [], topics: [], tags: [], facets: {} })
  const [results, setResults] = useState({ key: null, items: [], total: 0, totalPages: 0, error: null })
  const key = JSON.stringify({ type, filters, folder, page })
  const loading = results.key !== key
  const change = (field, value) => { setFilters((current) => ({ ...current, [field]: value })); setPage(1) }
  const navigateFolder = (id) => { setFolder(id); setPage(1) }

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ page, limit: 12 })
      for (const [field, value] of Object.entries(filters)) {
        const text = Array.isArray(value) ? value.join(',') : value.trim()
        if (text && !(type === 'exams' && ['topics', 'level'].includes(field))) params.set(type === 'problems' && field === 'level' ? 'difficulty' : field, text)
      }
      const active = Object.values(filters).some((value) => Array.isArray(value) ? value.length > 0 : value.trim().length > 0)
      if (folder && !(type === 'problems' && active)) params.set('categories', folder)
      apiFetch(`/api/${type}?${params}`)
        .then((data) => { if (!cancelled) setResults({ ...data, key, error: null }) })
        .catch((error) => { if (!cancelled) setResults({ key, items: [], total: 0, totalPages: 0, error: error.message }) })
    }, 160)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [key, filters, page, folder, type])

  useEffect(() => {
    let cancelled = false
    Promise.all([apiFetch('/api/categories'), apiFetch('/api/topics'), apiFetch('/api/tags'), type === 'problems' ? apiFetch('/api/problems/facets') : Promise.resolve({})])
      .then(([categories, topics, tags, facets]) => { if (!cancelled) setMetadata({ categories, topics, tags, facets }) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [type])

  const children = metadata.categories.filter((c) => (c.parent || null) === folder)
  const crumbs = []
  const seen = new Set()
  let ancestor = metadata.categories.find((c) => c._id === folder)
  while (ancestor && !seen.has(ancestor._id)) { seen.add(ancestor._id); crumbs.unshift(ancestor); ancestor = metadata.categories.find((c) => c._id === ancestor.parent) }
  const select = (field, label, choices) => <label className="text-sm font-semibold text-brand-700">{label}<select value={filters[field]} onChange={(e) => change(field, e.target.value)} className="mt-1 w-full rounded-xl border border-brand-300 bg-white p-3 font-normal"><option value="">Todos</option>{choices.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>

  return <section className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
    <TrainingHeader eyebrow="Zona de Entrenamiento" title={title} subtitle={subtitle} />
    <div className="tp-card-soft bg-white p-5">
      <label className="text-sm font-bold text-brand-900">Buscar en {title.toLowerCase()}<input type="search" value={filters.q} onChange={(e) => change('q', e.target.value)} placeholder="Título, tema o palabra clave" className="mt-2 w-full rounded-xl border-2 border-black bg-brand-50 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" /></label>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {type !== 'exams' && select('topics', 'Tema curricular', metadata.topics.map((t) => [t._id, t.name]))}
        {select('tags', 'Etiqueta', metadata.tags.map((t) => [t._id, t.label]))}
        {type !== 'exams' && select('level', 'Nivel', Object.entries(LEVELS))}
      </div>
      {type === 'problems' && <div className="mt-4 grid gap-4 sm:grid-cols-3">{[['year', 'Año', 'years'], ['subject', 'Área', 'subjects'], ['type', 'Colección', 'types']].map(([field, label, facet]) => <fieldset key={field}><legend className="text-sm font-bold text-brand-700">{label}</legend><div className="mt-2 flex flex-wrap gap-2">{(metadata.facets[facet] || []).map((value) => <label key={value} className="cursor-pointer rounded-lg border border-brand-300 px-2 py-1 text-xs"><input type="checkbox" checked={filters[field].includes(value)} onChange={(e) => change(field, e.target.checked ? [...filters[field], value] : filters[field].filter((v) => v !== value))} className="mr-1 accent-violet-600" />{value}</label>)}</div></fieldset>)}</div>}
      {type === 'problems' && <details className="mt-4"><summary className="cursor-pointer text-sm font-bold text-brand-700">Filtrar varias carpetas</summary><div className="mt-2 grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">{metadata.categories.map((category) => <label key={category._id} className="text-sm"><input type="checkbox" className="mr-2 accent-violet-600" checked={filters.categories.includes(category._id)} onChange={(e) => change('categories', e.target.checked ? [...filters.categories, category._id] : filters.categories.filter((id) => id !== category._id))} />{metadata.categories.find((c) => c._id === category.parent)?.name ? `${metadata.categories.find((c) => c._id === category.parent).name} / ` : ''}{category.name}</label>)}</div></details>}
      <button onClick={() => { setFilters({ q: '', topics: '', tags: '', level: '', categories: [], year: [], subject: [], type: [] }); navigateFolder(null) }} className="mt-4 text-sm font-semibold text-violet-700 underline">Limpiar filtros</button>
    </div>
    <nav aria-label="Carpetas de la biblioteca" className="mt-6 rounded-xl border-2 border-brand-300 bg-white p-4">
      <div className="flex flex-wrap gap-2 text-sm"><button onClick={() => navigateFolder(null)} className="font-semibold text-violet-700">Todas las carpetas</button>{crumbs.map((c) => <span key={c._id}> › <button onClick={() => navigateFolder(c._id)} className="font-semibold text-brand-800">{c.name}</button></span>)}</div>
      {children.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{children.map((c) => <button key={c._id} onClick={() => navigateFolder(c._id)} className="rounded-xl border border-brand-300 bg-brand-50 px-3 py-2 text-sm font-medium hover:bg-accent-yellow">{c.name} →</button>)}</div>}
    </nav>
    <div aria-live="polite" className="mt-8 text-sm text-brand-600">{loading ? 'Cargando biblioteca…' : results.error ? `No fue posible cargar la biblioteca: ${results.error}` : `${results.total} resultados`}</div>
    {!loading && !results.error && !results.total && <p className="mt-4 rounded-xl border border-brand-300 bg-white p-6">No hay contenido que coincida. Prueba otra búsqueda o limpia los filtros.</p>}
    {!loading && <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{results.items.map((item) => <article key={item._id} className="tp-card-soft flex min-w-0 flex-col bg-white p-5">
      <p className="text-xs font-black uppercase tracking-wider text-accent-violet">{item.codigo || title}{item.level || item.difficulty ? ` · ${LEVELS[item.level || item.difficulty]}` : ''}</p>
      <h3 className="mt-3 text-lg font-black text-brand-900"><Link to={`/entrenamiento/${PATHS[type]}/${item._id}`} className="hover:text-violet-700">{titleOf(type, item)}</Link></h3>
      {item.enunciado ? <MathText text={item.enunciado} className="mt-3 line-clamp-4 text-sm leading-6 text-brand-600" /> : item.summary && <p className="mt-3 line-clamp-4 text-sm leading-6 text-brand-600">{item.summary}</p>}
      {item.sourceOrganization && <p className="mt-4 text-xs text-brand-500">Fuente: {item.sourceOrganization}</p>}
      {type === 'exams' && <p className="mt-4 text-xs text-brand-500">{item.problems?.length || 0} problemas · {item.durationMinutes || 'Sin límite de'} minutos</p>}
      <div className="mt-auto flex flex-wrap gap-4 pt-6 text-sm font-bold"><Link to={`/entrenamiento/${PATHS[type]}/${item._id}`} className="text-brand-900 hover:text-violet-700">Abrir →</Link>{onOpen && <button onClick={() => onOpen(item)} className="text-violet-700">Comentarios</button>}</div>
    </article>)}</div>}
    {!loading && results.totalPages > 1 && <nav aria-label="Paginación" className="mt-8 flex items-center justify-center gap-4"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="tp-button bg-white px-4 py-2 disabled:opacity-40">Anterior</button><span className="text-sm">{page} / {results.totalPages}</span><button disabled={page >= results.totalPages} onClick={() => setPage(page + 1)} className="tp-button bg-white px-4 py-2 disabled:opacity-40">Siguiente</button></nav>}
  </section>
}
