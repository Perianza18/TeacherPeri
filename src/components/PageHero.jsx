// Colored header band for inner pages: grid paper, a corner of comic dots,
// a sticker kicker and a poster title. `title` may hold a <Highlight> or a
// <Mark> (decor/Decor.jsx); `before` goes above the kicker (breadcrumbs),
// `children` below the lead (search, meta, actions); `art` is decoration
// pinned to the right side on wider screens (decor/GlyphTile).
const TONES = {
  sky: 'bg-tp-sky',
  yellow: 'bg-tp-yellow',
  mint: 'bg-tp-mint',
  coral: 'bg-tp-coral',
  violet: 'bg-tp-tint-violet',
}

export default function PageHero({ id, kicker, title, lead, tone = 'sky', before, art, children, className = '' }) {
  return (
    <section aria-labelledby={id} className={`relative overflow-hidden border-b-3 border-tp-ink ${TONES[tone] || TONES.sky}`}>
      <div aria-hidden="true" className="tp-graph absolute inset-0" />
      <div aria-hidden="true" className="tp-halftone absolute -right-24 -top-28 size-[440px] opacity-[.15] [mask-image:radial-gradient(circle,black_20%,transparent_68%)]" />
      <div className={`tp-container relative flex flex-col items-start gap-5 pb-14 pt-10 lg:pb-16 lg:pt-14 ${className}`}>
        {before}
        {kicker && <span className={`tp-sticker -rotate-2 ${tone === 'yellow' ? 'bg-tp-surface' : 'bg-tp-yellow'}`}>{kicker}</span>}
        <h1 id={id} className="tp-page-title max-w-[920px]">{title}</h1>
        {lead && <p className="tp-lead max-w-[640px] text-[18px] text-tp-ink-soft">{lead}</p>}
        {children}
        {art && <div className="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block xl:right-16">{art}</div>}
      </div>
    </section>
  )
}
