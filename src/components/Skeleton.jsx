// Loading placeholders in the comic card shape, so a page keeps its layout
// while the API answers. Purely visual: pair them with a text status
// (visible or sr-only) for screen readers.

function Bar({ className }) {
  return <span className={`tp-skeleton ${className}`} />
}

export function SkeletonCard({ strip = true, strong = false }) {
  return (
    <div aria-hidden="true" className={`${strong ? 'tp-card' : 'tp-card-soft'} flex flex-col overflow-hidden bg-tp-surface`}>
      {strip && <div className="h-10 border-b-2 border-tp-ink bg-tp-paper" />}
      <div className="flex flex-col gap-3 p-5">
        <Bar className="h-6 w-3/4" />
        <Bar className="h-3 w-full" />
        <Bar className="h-3 w-5/6" />
        <Bar className="h-3 w-2/3" />
        <Bar className="mt-4 h-9 w-24" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6, className = '', ...card }) {
  return (
    <div aria-hidden="true" className={className}>
      {Array.from({ length: count }, (_, index) => <SkeletonCard key={index} {...card} />)}
    </div>
  )
}
