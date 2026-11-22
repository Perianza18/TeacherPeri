import { Link, useLocation } from 'react-router-dom'

// Development only (`npm run dev`): switch the library filters between the
// current design and the two proposals, to compare them on real data.
const VIEWS = [['', 'Actual'], ['a', 'Opción A · Árbol lateral'], ['b', 'Opción B · Pasos arriba']]

export default function DevViewSwitcher({ current }) {
  const { pathname } = useLocation()
  return (
    <nav aria-label="Comparar diseños de filtros" className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-32px)] flex-wrap items-center gap-1.5 rounded-[14px] border-2 border-tp-ink bg-tp-surface p-2 shadow-[4px_4px_0_var(--tp-ink)]">
      <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-tp-ink-muted">Filtros</span>
      {VIEWS.map(([id, label]) => (
        <Link key={id || 'actual'} to={id ? `${pathname}?vista=${id}` : pathname} aria-current={(current || '') === id ? 'true' : undefined} className={`rounded-lg border-2 px-2.5 py-1 text-xs font-bold ${(current || '') === id ? 'border-tp-ink bg-tp-yellow' : 'border-transparent hover:border-tp-ink'}`}>{label}</Link>
      ))}
    </nav>
  )
}
