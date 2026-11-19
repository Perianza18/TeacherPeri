// Sección Contacto (id="contacto"): correo y redes, como tarjetas cómic.
//
// TODO: href de mailto y de cada red son placeholders — no son datos
// inventados sobre vos, son literalmente marcadores de posición que hay
// que reemplazar con tu correo/redes reales antes de publicar el sitio.
const CORREO_CONTACTO = 'tu-correo@ejemplo.com'

const REDES = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/tu-usuario',
    icon: '/icons8-instagram-logo-48.png',
    color: 'bg-tp-coral-soft',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/tu-usuario',
    icon: '/icons8-linkedin-50.png',
    color: 'bg-tp-sky-soft',
  },
]

const TILE = 'tp-card-soft tp-lift flex items-center gap-4 bg-tp-surface px-5 py-4'

export default function Contacto() {
  return (
    <section id="contacto" aria-labelledby="contacto-directo" className="relative overflow-hidden border-t-3 border-tp-ink bg-tp-yellow">
      <div aria-hidden="true" className="tp-halftone absolute -right-20 -top-20 size-[420px] opacity-[.14] [mask-image:radial-gradient(circle,black_20%,transparent_68%)]" />
      <div className="tp-container relative flex flex-col items-start gap-8 py-16 lg:py-20">
        <div className="flex flex-col items-start gap-4">
          <span className="tp-sticker -rotate-2 bg-tp-surface">Directo</span>
          <h2 id="contacto-directo" className="tp-section-title">¿Prefieres escribir directo?</h2>
        </div>
        <ul className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <a href={`mailto:${CORREO_CONTACTO}`} className={TILE}>
              <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-tp-ink bg-tp-mint-soft">
                <img src="/icons8-email-48.png" alt="" className="size-7 object-contain brightness-0" />
              </span>
              <span className="flex flex-col">
                <span className="font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em]">Correo</span>
                <span className="text-sm text-tp-ink-muted">Te respondo por mail</span>
              </span>
            </a>
          </li>
          {REDES.map((red) => (
            <li key={red.label}>
              <a href={red.href} target="_blank" rel="noreferrer" className={TILE}>
                <span aria-hidden="true" className={`grid size-12 shrink-0 place-items-center rounded-xl border-2 border-tp-ink ${red.color}`}>
                  <img src={red.icon} alt="" className="size-7 object-contain brightness-0" />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em]">{red.label}</span>
                  <span className="text-sm text-tp-ink-muted">Abre en otra pestaña ↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
