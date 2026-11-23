import { useEffect, useId, useRef, useState } from 'react'
import { SEARCH_MIN, userQuery } from '../../lib/profile'

// «Buscar usuarios» in the left column. Waits 300 ms after typing, then
// hands the query up (the page puts it in the URL as ?buscar=); results show
// in the right column (SearchPanel). The page remounts it (new `key`) after
// «Volver» or on another profile, which empties the box.
export default function UserSearch({ initial = '', onSearch }) {
  const id = useId()
  const [text, setText] = useState(initial)
  const sent = useRef(userQuery(initial))

  useEffect(() => {
    const query = userQuery(text)
    if (query === sent.current) return undefined
    const timer = setTimeout(() => { sent.current = query; onSearch(query) }, 300)
    return () => clearTimeout(timer)
  }, [text, onSearch])

  const tooShort = text.trim().replace(/^@/, '').length > 0 && !userQuery(text)
  return (
    <form role="search" onSubmit={(event) => { event.preventDefault(); sent.current = userQuery(text); onSearch(sent.current) }} className="tp-card-soft flex flex-col gap-2 bg-tp-surface p-5">
      <label htmlFor={`${id}-q`} className="font-display text-[17px] font-extrabold">Buscar usuarios</label>
      <input
        id={`${id}-q`}
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="@usuario"
        maxLength={31}
        autoComplete="off"
        spellCheck={false}
        aria-describedby={tooShort ? `${id}-hint` : undefined}
        className="tp-input"
      />
      {tooShort && <p id={`${id}-hint`} className="text-sm text-tp-ink-muted">Escribe al menos {SEARCH_MIN} caracteres.</p>}
    </form>
  )
}
