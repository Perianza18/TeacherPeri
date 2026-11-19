// Header for pages inside a narrow column (Proponer un problema, Mis
// envíos): the sticker kicker and poster title of the full-width PageHero,
// without the colored band.
export default function TrainingHeader({ eyebrow, title, subtitle, action = null }) {
  return (
    <header className="mb-10 flex flex-col items-start gap-4">
      {eyebrow && <span className="tp-sticker -rotate-2 bg-tp-yellow">{eyebrow}</span>}
      <h1 className="tp-page-title">{title}</h1>
      {subtitle && <p className="tp-lead max-w-2xl text-[18px] text-tp-ink-soft">{subtitle}</p>}
      {action && <div className="pt-2">{action}</div>}
    </header>
  )
}
