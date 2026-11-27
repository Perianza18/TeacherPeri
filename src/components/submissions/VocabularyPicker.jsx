import { useId, useState } from 'react'
import { RESERVED_TAG_SLUGS } from '../../lib/submissions'
import { orderTopics, searchTopics, topicTree, withTopic, withoutArea } from '../../lib/topics'

const VISIBLE_CHILDREN = 12

// «Área y temas» of a problem, in three short steps:
//   1. ¿De qué área es? — the four áreas as big buttons (one or more).
//   2. Temas (opcional) — the subtemas of the chosen áreas, a search that also
//      knows other names («palomar» → Principio de casillas), and «Crear tema».
//   3. Técnica de demostración (opcional).
// `value` is { topics, tags } (ids). `onCreateTopic(name, areaId)` proposes a
// tema (it stays in review) and resolves with it; without it there is no
// «Crear tema» (the editor screens). Staff pass `allowReserved` to offer the
// tags only the team applies («Original TeacherPeri»).
export default function VocabularyPicker({ topics, tags, value, onChange, onCreateTopic = null, allowReserved = false, help = 'Marca uno o más.' }) {
  const id = useId()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState({})
  const [creating, setCreating] = useState(null) // { name, area, busy, error, existing }
  const { areas, technique, byId } = topicTree(topics)
  const chosen = value.topics.map(String)
  const isChosen = (topicId) => chosen.includes(String(topicId))
  const chosenAreas = areas.filter((area) => isChosen(area.topic._id))
  const setTopics = (next, map = byId) => onChange({ ...value, topics: orderTopics(next, map) })

  const toggleArea = (area) => setTopics(isChosen(area.topic._id) ? withoutArea(chosen, area.topic._id, byId) : [...chosen, String(area.topic._id)])
  // Picking a subtema also marks its área; a técnica de demostración goes alone.
  const add = (topic, map = byId) => (technique && String(topic.parent) === String(technique.topic._id) ? [...chosen, String(topic._id)] : withTopic(chosen, topic._id, map))
  const toggleTopic = (topic) => setTopics(isChosen(topic._id) ? chosen.filter((item) => item !== String(topic._id)) : add(topic))
  const pick = (topic, map = byId) => { if (!isChosen(topic._id)) setTopics(add(topic, map), map); setQuery('') }

  const results = searchTopics(query, topics, { preferRoots: chosenAreas.map((area) => area.topic._id), exclude: chosen })
  const typed = query.trim()

  // Chosen temas outside the áreas and techniques shown here (an older problem
  // filed under «Cómo entrenar», say) still show so they can be removed.
  const shownRoots = new Set([...areas.map((area) => String(area.topic._id)), ...(technique ? [String(technique.topic._id)] : [])])
  const others = chosen.map((topicId) => byId.get(topicId)).filter((topic) => topic && !shownRoots.has(String(topic._id)) && !shownRoots.has(String(topic.parent)))
  const chosenSubtopics = chosen.map((topicId) => byId.get(topicId)).filter((topic) => topic?.parent && shownRoots.has(String(topic.parent)))

  const areaOptions = [...areas, ...(technique ? [{ slug: TECHNIQUE, name: 'Técnica de demostración', topic: technique.topic, color: 'bg-tp-coral-soft' }] : [])]
  const openCreate = () => setCreating({ name: typed, area: chosenAreas.length === 1 ? String(chosenAreas[0].topic._id) : '', busy: false, error: null, existing: null })
  const edit = (changes) => setCreating((current) => ({ ...current, error: null, existing: null, ...changes }))
  const create = async () => {
    if (!creating?.name.trim() || !creating.area || creating.busy) return
    edit({ busy: true })
    try {
      const topic = await onCreateTopic(creating.name, creating.area)
      pick(topic, new Map([...byId, [String(topic._id), topic]]))
      setCreating(null)
    } catch (error) {
      edit({ busy: false, error: error.message, existing: error.data?.existing || null })
    }
  }

  const visibleTags = tags.filter((tag) => allowReserved || !RESERVED_TAG_SLUGS.includes(tag.slug))
  const chosenTags = value.tags.map(String)

  return (
    <fieldset className="flex flex-col gap-6">
      <legend className="font-display text-lg font-extrabold text-tp-ink">Tema</legend>

      {/* 1. Tema (las cuatro grandes) */}
      <div>
        <p className="flex items-center gap-2 text-sm font-bold text-tp-ink"><Step n={1} />¿De qué tema es?</p>
        <p className="mt-1 text-sm text-tp-ink-muted">{help}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {areas.map((area) => {
            const on = isChosen(area.topic._id)
            return (
              <button key={area.slug} type="button" aria-pressed={on} onClick={() => toggleArea(area)}
                className={`relative flex min-h-[84px] flex-col items-start justify-between gap-2 rounded-[14px] border-2 border-tp-ink p-3 text-left transition-[transform,box-shadow] duration-150 ${on ? `${area.color} -translate-x-0.5 -translate-y-0.5 shadow-[4px_4px_0_var(--tp-ink)]` : 'bg-tp-surface hover:bg-tp-yellow-soft'}`}>
                <span aria-hidden="true" className="font-display text-2xl font-black leading-none">{area.glyph}</span>
                <span className="pr-6 text-[15px] font-extrabold leading-tight">{area.name}</span>
                <span aria-hidden="true" className={`absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border-2 border-tp-ink text-xs font-black ${on ? 'bg-tp-ink text-white' : 'bg-tp-surface text-transparent'}`}>✓</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Temas */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor={id} className="flex items-center gap-2 text-sm font-bold text-tp-ink"><Step n={2} />¿Algo más específico? <span className="font-semibold text-tp-ink-muted">(opcional)</span></label>
          {onCreateTopic && !creating && (
            <button type="button" onClick={openCreate} className="tp-button gap-1.5 bg-tp-yellow px-3 text-sm font-extrabold">
              <span aria-hidden="true" className="text-lg leading-none">+</span>Crear tema
            </button>
          )}
        </div>
        <p id={`${id}-ayuda`} className="mt-1 text-sm text-tp-ink-muted">Búscalo con el nombre que conozcas: «palomar», «módulo», «Pitágoras»…</p>

        {chosenSubtopics.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Temas elegidos">
            {chosenSubtopics.map((topic) => (
              <li key={topic._id} className="tp-pill bg-tp-violet-soft pr-1">
                <span><span className="font-semibold text-tp-ink-soft">{byId.get(String(topic.parent))?.name} › </span>{topic.name}</span>
                {topic.reviewStatus === 'pending' && <span className="rounded-full border border-tp-ink bg-tp-yellow px-1.5 text-[11px] font-extrabold">en revisión</span>}
                <button type="button" onClick={() => toggleTopic(topic)} aria-label={`Quitar ${topic.name}`} className="grid h-8 w-8 place-items-center rounded-full text-base hover:bg-tp-surface">×</button>
              </li>
            ))}
          </ul>
        )}

        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); if (results[0]) pick(results[0].topic) } }}
          placeholder="Busca: casillas, primos, ángulos…"
          aria-describedby={`${id}-ayuda`}
          autoComplete="off"
          className="tp-input mt-3"
        />

        {typed.length >= 2 && (
          results.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1.5" aria-label="Temas que coinciden">
              {results.map(({ topic, root, alias }) => (
                <li key={topic._id}>
                  <button type="button" onClick={() => pick(topic)} className="flex min-h-11 w-full flex-wrap items-center gap-x-2 rounded-[10px] border-2 border-tp-ink bg-tp-surface px-3 py-2 text-left text-sm hover:bg-tp-yellow-soft">
                    <span className="font-bold">{topic.name}</span>
                    <span className="text-tp-ink-muted">en {root?.name}</span>
                    {alias && <span className="text-xs text-tp-ink-muted">· también «{alias}»</span>}
                    {topic.reviewStatus === 'pending' && <span className="text-xs font-bold text-tp-ink-muted">· en revisión</span>}
                    <span aria-hidden="true" className="ml-auto text-lg font-black leading-none">+</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 rounded-[10px] border-2 border-dashed border-tp-rule px-3 py-1 text-sm">
              <span className="py-2 text-tp-ink-muted">No encontramos «{typed}».</span>
              {onCreateTopic && !creating && <button type="button" onClick={openCreate} className="min-h-11 font-bold text-tp-violet underline underline-offset-2">Crear el tema «{typed}»</button>}
            </div>
          )
        )}

        {creating && (
          <div className="tp-card-soft mt-3 bg-tp-yellow-soft p-4 sm:p-5">
            <p className="font-display text-base font-extrabold">Crear un tema nuevo</p>
            <p className="mt-1 text-sm text-tp-ink-soft">Lo revisamos antes de que lo vean los demás. Mientras tanto, solo tú lo ves.</p>
            <label className="mt-3 block text-sm font-semibold text-tp-ink">
              Nombre del tema
              <input value={creating.name} autoFocus maxLength={60} onChange={(event) => edit({ name: event.target.value })}
                onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); create() } }}
                placeholder="Por ejemplo: Palomar" className="tp-input mt-1 font-normal" />
            </label>
            <p className="mt-3 text-sm font-semibold text-tp-ink">¿Dentro de cuál va?</p>
            <div className="mt-1 flex flex-wrap gap-2" role="radiogroup" aria-label="Dónde va el tema nuevo">
              {areaOptions.map((area) => {
                const on = creating.area === String(area.topic._id)
                return (
                  <button key={area.slug} type="button" role="radio" aria-checked={on} onClick={() => edit({ area: String(area.topic._id) })}
                    className={`min-h-11 rounded-full border-2 border-tp-ink px-3 text-sm font-bold ${on ? `${area.color} shadow-[2px_2px_0_var(--tp-ink)]` : 'bg-tp-surface hover:bg-tp-paper'}`}>
                    {on && <span aria-hidden="true">✓ </span>}{area.name}
                  </button>
                )
              })}
            </div>
            {creating.error && (
              <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
                {creating.error}{' '}
                {creating.existing && <button type="button" onClick={() => { pick(creating.existing); setCreating(null) }} className="min-h-11 font-bold text-tp-violet underline underline-offset-2">Usar «{creating.existing.name}»</button>}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" onClick={create} disabled={creating.busy || !creating.name.trim() || !creating.area} className="tp-button bg-tp-ink px-4 text-sm font-extrabold text-white disabled:opacity-50">{creating.busy ? 'Creando…' : 'Crear tema'}</button>
              <button type="button" onClick={() => setCreating(null)} className="min-h-11 px-1 text-sm font-semibold text-tp-ink-muted underline underline-offset-2">Cancelar</button>
            </div>
          </div>
        )}

        {chosenAreas.length === 0 && !typed && <p className="mt-3 text-sm text-tp-ink-muted">Elige un tema arriba para ver opciones más específicas.</p>}
        {!typed && chosenAreas.map((area) => {
          const open = expanded[area.slug]
          const list = open ? area.children : area.children.slice(0, VISIBLE_CHILDREN)
          return area.children.length > 0 && (
            <div key={area.slug} className="mt-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-tp-ink-muted">Dentro de {area.name}</p>
              <TopicChips topics={list} isChosen={isChosen} onToggle={toggleTopic} tone={area.color} />
              {area.children.length > VISIBLE_CHILDREN && (
                <button type="button" onClick={() => setExpanded((current) => ({ ...current, [area.slug]: !open }))} className="mt-1 min-h-11 text-sm font-bold text-tp-violet underline underline-offset-2">
                  {open ? 'Ver menos' : `Ver los ${area.children.length} temas`}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* 3. Técnica */}
      {technique && technique.children.length > 0 && (
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-tp-ink"><Step n={3} />Técnica de demostración <span className="font-semibold text-tp-ink-muted">(opcional)</span></p>
          <TopicChips topics={technique.children} isChosen={isChosen} onToggle={toggleTopic} tone="bg-tp-coral-soft" />
        </div>
      )}

      {others.length > 0 && (
        <div>
          <p className="text-sm font-bold text-tp-ink">Otros temas</p>
          <TopicChips topics={others} isChosen={isChosen} onToggle={toggleTopic} tone="bg-tp-violet-soft" />
        </div>
      )}

      {allowReserved && visibleTags.length > 0 && (
        <div>
          <p className="text-sm font-bold text-tp-ink">Etiquetas <span className="font-semibold text-tp-ink-muted">(opcional)</span></p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {visibleTags.map((tag) => {
              const on = chosenTags.includes(String(tag._id))
              return (
                <li key={tag._id}>
                  <button type="button" aria-pressed={on} onClick={() => onChange({ ...value, tags: on ? chosenTags.filter((item) => item !== String(tag._id)) : [...chosenTags, String(tag._id)] })}
                    className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-tp-ink px-3 text-sm font-bold ${on ? 'bg-tp-violet-soft' : 'bg-tp-surface hover:bg-tp-yellow-soft'}`}>
                    {on && <span aria-hidden="true">✓</span>}{tag.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </fieldset>
  )
}

const TECHNIQUE = 'technique'

function Step({ n }) {
  return <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-tp-ink bg-tp-yellow text-xs font-black">{n}</span>
}

function TopicChips({ topics, isChosen, onToggle, tone }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {topics.map((topic) => {
        const on = isChosen(topic._id)
        return (
          <li key={topic._id}>
            <button type="button" aria-pressed={on} onClick={() => onToggle(topic)}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-tp-ink px-3 text-sm ${on ? `${tone} font-bold` : 'bg-tp-surface font-semibold hover:bg-tp-yellow-soft'}`}>
              {on && <span aria-hidden="true">✓</span>}{topic.name}
              {topic.reviewStatus === 'pending' && <span className="text-xs font-bold text-tp-ink-muted">· en revisión</span>}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
