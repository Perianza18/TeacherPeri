import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { LIBRARY_BASE } from '../../lib/libraryPaths'
import MathText from '../math/MathText'
import PageHero from '../PageHero'
import { GlyphTile } from '../decor/Decor'
import PeriPenguin from '../decor/PeriPenguin'
import { SkeletonGrid } from '../Skeleton'
import FolderFilter from './FolderFilter'

const LEVELS = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' }
// Header tone and symbol sticker per library, and a strip color per problem area.
const LOOK = {
  problems: { tone: 'violet', strip: 'bg-tp-yellow', glyph: '?', tile: 'bg-tp-yellow', small: 'x²' },
  theory: { tone: 'sky', strip: 'bg-tp-tint-sky', glyph: 'π', tile: 'bg-tp-surface', small: '∞' },
  exams: { tone: 'coral', strip: 'bg-tp-coral-soft', glyph: '≥', tile: 'bg-tp-yellow', small: '✓' },
  lists: { tone: 'mint', strip: 'bg-tp-mint-soft', glyph: '√', tile: 'bg-tp-surface', small: 'n!' },
}
const AREA_STRIPS = { 'Geometría': 'bg-tp-sky', 'Álgebra': 'bg-tp-tint-violet', 'Combinatoria': 'bg-tp-coral', 'Teoría de Números': 'bg-tp-mint' }
const CHIP = 'cursor-pointer rounded-full border-2 border-tp-ink bg-tp-surface px-3 py-1 text-xs font-semibold transition-colors hover:bg-tp-yellow-soft has-[:checked]:bg-tp-yellow'
const titleOf = (type, item) => type === 'exams' ? `${item.competition} ${item.year} · ${item.round}` : item.title || item.titulo

export default function LibraryCollection({ type, title, subtitle, onOpen, eyebrow = 'Zona de Entrenamiento', headerAction = null }) {
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
      // Exam folders only hold Problems, so the other libraries leave them out.
      .then(([categories, topics, tags, facets]) => { if (!cancelled) setMetadata({ categories: type === 'problems' ? categories : categories.filter((c) => c.kind !== 'exam'), topics, tags, facets }) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [type])

  const children = metadata.categories.filter((c) => (c.parent || null) === folder)
  const crumbs = []
  const seen = new Set()
  let ancestor = metadata.categories.find((c) => c._id === folder)
  while (ancestor && !seen.has(ancestor._id)) { seen.add(ancestor._id); crumbs.unshift(ancestor); ancestor = metadata.categories.find((c) => c._id === ancestor.parent) }
  const select = (field, label, choices) => <label className="text-sm font-bold text-tp-ink">{label}<select value={filters[field]} onChange={(e) => change(field, e.target.value)} className="tp-input mt-1.5 font-normal"><option value="">Todos</option>{choices.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
  const look = LOOK[type] || LOOK.problems

  return <>
    <PageHero id="biblioteca-titulo" tone={look.tone} kicker={eyebrow} title={title} art={<GlyphTile glyph={look.glyph} color={look.tile} small={look.small} />} lead={subtitle} className="lg:pb-14">
      {headerAction && <div className="pt-1">{headerAction}</div>}
    </PageHero>
    <section className="tp-container pb-24 pt-10">
    <div className="tp-card-soft bg-tp-surface p-5 sm:p-6">
      <label className="text-sm font-bold text-tp-ink">Buscar en {title.toLowerCase()}<input type="search" value={filters.q} onChange={(e) => change('q', e.target.value)} placeholder="Título, tema o palabra clave" className="tp-input mt-2 bg-tp-paper" /></label>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {type !== 'exams' && select('topics', 'Tema curricular', metadata.topics.map((t) => [t._id, t.name]))}
        {select('tags', 'Etiqueta', metadata.tags.map((t) => [t._id, t.label]))}
        {type !== 'exams' && select('level', 'Nivel', Object.entries(LEVELS))}
      </div>
      {type === 'problems' && <div className="mt-5 grid gap-4 sm:grid-cols-3">{[['year', 'Año', 'years'], ['subject', 'Área', 'subjects'], ['type', 'Colección', 'types']].map(([field, label, facet]) => <fieldset key={field}><legend className="text-sm font-bold text-tp-ink">{label}</legend><div className="mt-2 flex flex-wrap gap-2">{(metadata.facets[facet] || []).map((value) => <label key={value} className={CHIP}><input type="checkbox" checked={filters[field].includes(value)} onChange={(e) => change(field, e.target.checked ? [...filters[field], value] : filters[field].filter((v) => v !== value))} className="mr-1.5 accent-tp-violet" />{value}</label>)}</div></fieldset>)}</div>}
      {type === 'problems' && <FolderFilter categories={metadata.categories} value={filters.categories} onChange={(ids) => change('categories', ids)} />}
      <button onClick={() => { setFilters({ q: '', topics: '', tags: '', level: '', categories: [], year: [], subject: [], type: [] }); navigateFolder(null) }} className="mt-4 text-sm font-bold text-tp-violet underline underline-offset-2">Limpiar filtros</button>
    </div>
    <nav aria-label="Carpetas de la biblioteca" className="mt-6 rounded-[14px] border-2 border-dashed border-tp-ink bg-tp-paper p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm"><button onClick={() => navigateFolder(null)} className="font-bold text-tp-violet underline-offset-2 hover:underline">Todas las carpetas</button>{crumbs.map((c) => <span key={c._id}> › <button onClick={() => navigateFolder(c._id)} className="font-bold hover:underline">{c.name}</button></span>)}</div>
      {children.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{children.map((c) => <button key={c._id} onClick={() => navigateFolder(c._id)} className="tp-pill bg-tp-surface transition-colors hover:bg-tp-yellow">{c.name}<span aria-hidden="true">→</span></button>)}</div>}
    </nav>
    <div aria-live="polite" className="mt-10 font-display text-[22px] font-extrabold tracking-[-0.02em]">{loading ? 'Cargando biblioteca…' : results.error ? `No fue posible cargar la biblioteca: ${results.error}` : `${results.total} resultados`}</div>
    {loading && <SkeletonGrid count={6} className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" />}
    {!loading && !results.error && !results.total && <div className="tp-card-quiet mt-4 flex items-center gap-5 bg-tp-surface p-6"><PeriPenguin question className="h-24 w-auto shrink-0" /><p className="text-[17px]">No hay contenido que coincida. Prueba otra búsqueda o limpia los filtros.</p></div>}
    {!loading && <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{results.items.map((item) => <article key={item._id} className="tp-card-soft tp-lift flex min-w-0 flex-col overflow-hidden bg-tp-surface">
      <div className={`flex items-center justify-between gap-2 border-b-2 border-tp-ink px-5 py-2.5 ${AREA_STRIPS[item.tema] || look.strip}`}>
        <p className="truncate text-xs font-extrabold uppercase tracking-[0.12em]">{item.codigo || title}{item.level || item.difficulty ? ` · ${LEVELS[item.level || item.difficulty]}` : ''}</p>
        {item.tema && <span className="tp-pill shrink-0 bg-tp-surface px-2 py-0 text-[11px]">{item.tema}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
      <h3 className="font-display text-[21px] font-extrabold leading-tight tracking-[-0.02em]"><Link to={`${LIBRARY_BASE[type]}/${item._id}`} className="hover:text-tp-violet">{titleOf(type, item)}</Link></h3>
      {item.enunciado ? <MathText text={item.enunciado} className="mt-3 line-clamp-4 text-sm leading-6 text-tp-ink-muted" /> : item.summary && <p className="mt-3 line-clamp-4 text-sm leading-6 text-tp-ink-muted">{item.summary}</p>}
      {item.sourceOrganization && <p className="mt-4 text-xs text-tp-ink-muted">Fuente: {item.sourceOrganization}</p>}
      {type === 'exams' && <p className="mt-4 text-xs text-tp-ink-muted">{item.problems?.length || 0} problemas · {item.durationMinutes || 'Sin límite de'} minutos</p>}
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-6 text-sm font-bold"><Link to={`${LIBRARY_BASE[type]}/${item._id}`} className="rounded-lg border-2 border-tp-ink bg-tp-mint px-3 py-1.5 transition-colors hover:bg-tp-yellow">Abrir →</Link>{onOpen && <button onClick={() => onOpen(item)} className="text-tp-violet underline-offset-2 hover:underline">Comentarios</button>}</div>
      </div>
    </article>)}</div>}
    {!loading && results.totalPages > 1 && <nav aria-label="Paginación" className="mt-10 flex items-center justify-center gap-4"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="tp-button bg-tp-surface px-4 py-2 font-bold disabled:opacity-40">Anterior</button><span className="text-sm font-bold">{page} / {results.totalPages}</span><button disabled={page >= results.totalPages} onClick={() => setPage(page + 1)} className="tp-button bg-tp-surface px-4 py-2 font-bold disabled:opacity-40">Siguiente</button></nav>}
    </section>
  </>
}
