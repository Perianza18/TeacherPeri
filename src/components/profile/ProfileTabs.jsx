import { useRef } from 'react'
import { nextTabIndex } from '../../lib/profile'

// Tabs drawn as colored section-heading labels. Real tablist semantics:
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
    <div className="border-b-2 border-tp-rule pb-4">
      <div role="tablist" aria-label="Secciones del perfil" className="flex flex-wrap gap-3">
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
              className={`tp-tab ${tab.color}`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
