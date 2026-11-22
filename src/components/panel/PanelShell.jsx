import { Link } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import PageHero from '../PageHero'
import { useAuth } from '../../context/useAuth'
import { isAtLeast } from '../../lib/roles'
import { PANEL_PATH } from '../../lib/panel'

// Frame for every team page: header band, then the page — or a sign-in card,
// or a «sin acceso» card when the role is too low. `children(auth)` renders
// only for people with at least `minimum`.
export default function PanelShell({ title, lead, minimum = 'editor', back = { to: PANEL_PATH, label: 'Panel del equipo' }, wide = false, children }) {
  const { auth, abrirModal } = useAuth()
  const allowed = auth && isAtLeast(auth.user?.role, minimum)
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-tp-paper pt-[72px] text-tp-ink">
        <PageHero
          id="panel-titulo"
          tone="violet"
          kicker="Equipo TeacherPeri"
          title={title}
          lead={lead}
          before={back && <Link to={back.to} className="text-sm font-bold underline underline-offset-2 hover:text-tp-violet">← {back.label}</Link>}
          className="lg:pb-12"
        />
        <div className={`tp-container pb-24 pt-10 ${wide ? '' : 'max-w-[1120px]'}`}>
          {!auth && (
            <PanelNotice kicker="Inicia sesión" text="Entra con tu cuenta del equipo para ver esta página.">
              <button type="button" onClick={abrirModal} className="tp-button mt-5 bg-tp-mint px-5 font-bold text-tp-ink">Entrar</button>
            </PanelNotice>
          )}
          {auth && !allowed && <PanelNotice kicker="Sin acceso" text={minimum === 'admin' ? 'Esta página es solo para admins.' : 'Esta página es para editores y admins.'} />}
          {allowed && children(auth)}
        </div>
      </main>
      <Footer />
    </>
  )
}

export function PanelNotice({ kicker, text, children }) {
  return (
    <section className="tp-card-soft max-w-[840px] bg-tp-surface p-6">
      <span className="tp-kicker">{kicker}</span>
      <p className="mt-4 text-lg leading-8 text-tp-ink-soft">{text}</p>
      {children}
    </section>
  )
}

export function LoadState({ loading, error, empty, emptyText }) {
  if (error) return <p role="alert" className="tp-card-quiet max-w-[840px] bg-tp-orange-soft p-4">No fue posible cargar: {error}</p>
  if (loading) return <p className="text-tp-ink-muted" aria-live="polite">Cargando…</p>
  if (empty) return <PanelNotice kicker="Al día" text={emptyText} />
  return null
}

// Row of filter buttons («Abiertos», «Resueltos»…). Real buttons with aria-pressed.
export function Segmented({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`min-h-11 rounded-full border-2 border-tp-ink px-4 text-sm font-bold ${value === option.value ? 'bg-tp-ink text-white' : 'bg-tp-surface text-tp-ink hover:bg-tp-yellow-soft'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
