import { useRef } from 'react'
import { nextTabIndex } from '../../lib/profile'

// White tabs with a colored dot; the selected one fills with its color and lifts. Real tablist semantics:
// roving tabindex, ←/→ move and select (wrapping), Home and End jump.
// `activeId` is null while a followers list is shown: no tab is selected and
// the first one takes the Tab key.
export default function ProfileTabs({ tabs, activeId, onSelect, idPrefix = 'perfil' }) {
  const refs = useRef([])
  const focusIndex = Math.max(0, tabs.findIndex((tab) => tab.id === activeId))

  const onKeyDown = (event, index) => {
    const next = nextTabIndex(event.key, index, tabs.length)
    if (next == null) return
    event.preventDefault()
    refs.current[next]?.focus()
    onSelect(tabs[next].id)
  }

  return (
    <div>
      <div role="tablist" aria-label="Secciones del perfil" className="flex flex-wrap gap-2.5">
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId
          return (
            <button
              key={tab.id}
              ref={(node) => { refs.current[index] = node }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel-${tab.id}`}
              tabIndex={index === focusIndex ? 0 : -1}
              onClick={() => onSelect(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`tp-tab ${selected ? tab.color : 'bg-tp-surface'}`}
            >
              <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-tp-ink ${selected ? 'bg-tp-ink' : (tab.dot ?? tab.color)}`} />
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
