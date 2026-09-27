import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import TrainingHeader from './TrainingHeader'

const PATHS = { theory: 'teoria', lists: 'listas', exams: 'examenes' }

function itemTitle(type, item) {
  if (type === 'exams') return `${item.competition} ${item.year} · ${item.round}`
  return item.title
}

export default function LibraryCollection({ type, title, subtitle }) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [topics, setTopics] = useState([])
  const [tags, setTags] = useState([])
  const [folder, setFolder] = useState(null)
  const [topic, setTopic] = useState('')
  const [tag, setTag] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = new URLSearchParams({ page: '1', limit: '20' })
    if (query.trim()) params.set('q', query.trim())
    if (folder) params.set('categories', folder)
    if (topic) params.set('topics', topic)
    if (tag) params.set('tags', tag)
    apiFetch(`/api/${type}?${params}`)
      .then((result) => { if (!cancelled) { setItems(result.items); setError(null); setLoading(false) } })
      .catch((requestError) => { if (!cancelled) { setError(requestError.message); setLoading(false) } })
    return () => { cancelled = true }
  }, [type, query, folder, topic, tag])

  useEffect(() => {
    Promise.all([apiFetch('/api/categories'), apiFetch('/api/topics'), apiFetch('/api/tags')])
      .then(([nextCategories, nextTopics, nextTags]) => { setCategories(nextCategories); setTopics(nextTopics); setTags(nextTags) })
      .catch(() => { setCategories([]); setTopics([]); setTags([]) })
  }, [])

  const children = categories.filter((category) => (category.parent || null) === folder)
  const current = folder ? categories.find((category) => category._id === folder) : null

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
      <TrainingHeader eyebrow="Zona de Entrenamiento" title={title} subtitle={subtitle} />

      <div className="rounded-3xl border border-brand-200 bg-white p-5 shadow-[0_8px_30px_rgba(17,17,19,.035)]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Buscar en ${title.toLowerCase()}`} className="w-full rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3.5 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <select value={topic} onChange={(event) => setTopic(event.target.value)} className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-700"><option value="">Todos los temas</option>{topics.map((entry) => <option key={entry._id} value={entry._id}>{entry.name}</option>)}</select>
          <select value={tag} onChange={(event) => setTag(event.target.value)} className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-700"><option value="">Todas las etiquetas</option>{tags.map((entry) => <option key={entry._id} value={entry._id}>{entry.label}</option>)}</select>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-sm text-brand-500">
          <button type="button" onClick={() => setFolder(null)} className="font-medium hover:text-brand-900">Inicio</button>
          {current && <><span>›</span><span className="text-brand-800">{current.name}</span></>}
        </div>
        {children.length > 0 && <div className="flex flex-wrap gap-2">{children.map((category) => <button key={category._id} type="button" onClick={() => setFolder(category._id)} className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-700 transition hover:border-violet-300 hover:text-violet-700">{category.name}</button>)}</div>}
        {!children.length && current && <button type="button" onClick={() => setFolder(current.parent || null)} className="text-sm font-medium text-violet-700">← Subir una carpeta</button>}
      </div>

      {loading && <p className="mt-8 text-brand-500">Cargando biblioteca…</p>}
      {error && <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">No fue posible cargar la biblioteca: {error}</p>}
      {!loading && !error && items.length === 0 && <p className="mt-8 rounded-2xl border border-brand-200 bg-white p-6 text-brand-600">Todavía no hay contenido publicado en esta biblioteca.</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link key={item._id} to={`/entrenamiento/${PATHS[type]}/${item._id}`} className="group rounded-3xl border border-brand-200 bg-white p-5 transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">{title}</p>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-brand-900">{itemTitle(type, item)}</h3>
            {item.summary && <p className="mt-3 text-sm leading-6 text-brand-600">{item.summary}</p>}
            {type === 'lists' && item.sourceOrganization && <p className="mt-5 text-xs text-brand-500">Fuente: {item.sourceOrganization}</p>}
            {type === 'exams' && <p className="mt-5 text-xs text-brand-500">{item.problems?.length || 0} problemas</p>}
            <span className="mt-6 inline-block text-sm font-semibold text-brand-800 transition group-hover:translate-x-1">Abrir →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
