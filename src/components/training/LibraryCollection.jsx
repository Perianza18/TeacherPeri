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
    const params = new URLSearchParams({ page: '1', limit: '20' })
    if (query.trim()) params.set('q', query.trim())
    if (folder) params.set('categories', folder)
    if (topic) params.set('topics', topic)
    if (tag) params.set('tags', tag)
    apiFetch(`/api/${type}?${params}`)
      .then((result) => {
        if (cancelled) return
        setItems(result.items)
        setLoading(false)
      })
      .catch((requestError) => !cancelled && setError(requestError.message))
    return () => { cancelled = true }
  }, [type, query, folder, topic, tag])

  useEffect(() => {
    Promise.all([
      apiFetch('/api/categories'),
      apiFetch('/api/topics'),
      apiFetch('/api/tags'),
    ]).then(([nextCategories, nextTopics, nextTags]) => {
      setCategories(nextCategories)
      setTopics(nextTopics)
      setTags(nextTags)
    }).catch(() => {
      setCategories([])
      setTopics([])
      setTags([])
    })
  }, [])

  const children = categories.filter((category) => (category.parent || null) === folder)
  const current = folder ? categories.find((category) => category._id === folder) : null

  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6">
      <TrainingHeader eyebrow="Zona de Entrenamiento" title={title} subtitle={subtitle} />
      <label className="mb-6 block">
        <span className="sr-only">Buscar en {title}</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Buscar en ${title.toLowerCase()}`} className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-brand-900 shadow-sm outline-none focus:border-[#E57505]" />
      </label>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-brand-700">Tema<select value={topic} onChange={(event) => setTopic(event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 bg-white p-2"><option value="">Todos los temas</option>{topics.map((entry) => <option key={entry._id} value={entry._id}>{entry.name}</option>)}</select></label>
        <label className="text-sm text-brand-700">Etiqueta<select value={tag} onChange={(event) => setTag(event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 bg-white p-2"><option value="">Todas las etiquetas</option>{tags.map((entry) => <option key={entry._id} value={entry._id}>{entry.label}</option>)}</select></label>
      </div>
      <div className="mb-6 rounded-xl border border-brand-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-sm text-brand-600"><button type="button" onClick={() => setFolder(null)} className="underline">Inicio</button>{current && <><span>›</span><span>{current.name}</span></>}</div>
        {children.length > 0 && <div className="flex flex-wrap gap-2">{children.map((category) => <button key={category._id} type="button" onClick={() => setFolder(category._id)} className="rounded-full border border-brand-300 px-3 py-1 text-sm text-brand-700 hover:border-[#E57505]">{category.name}</button>)}</div>}
        {!children.length && current && <button type="button" onClick={() => setFolder(current.parent || null)} className="text-sm text-brand-600 underline">Subir una carpeta</button>}
      </div>
      {loading && <p className="text-brand-600">Cargando biblioteca…</p>}
      {error && <p className="rounded-xl bg-red-50 p-4 text-red-700">No fue posible cargar la biblioteca: {error}</p>}
      {!loading && !error && items.length === 0 && <p className="rounded-xl border border-brand-200 bg-white p-6 text-brand-600">Todavía no hay contenido publicado en esta biblioteca.</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link key={item._id} to={`/entrenamiento/${PATHS[type]}/${item._id}`} className="rounded-2xl border border-brand-200 bg-[#FFFBF5] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-brand-900">{itemTitle(type, item)}</h3>
            {item.summary && <p className="mt-2 text-sm text-brand-600">{item.summary}</p>}
            {type === 'lists' && item.sourceOrganization && <p className="mt-3 text-xs text-brand-500">Fuente: {item.sourceOrganization}</p>}
            {type === 'exams' && <p className="mt-3 text-xs text-brand-500">{item.problems?.length || 0} problemas</p>}
          </Link>
        ))}
      </div>
    </section>
  )
}
