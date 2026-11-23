import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import PeriPenguin from '../components/decor/PeriPenguin'
import CathCat from '../components/decor/CathCat'
import { usePageMeta } from '../hooks/usePageMeta'

// The two people behind TeacherPeri, each with their mascot. Each card opens
// that person's own page (src/pages/equipo/), which each of them decorates.
const PEOPLE = [
  { name: 'Elías', mascot: 'TeacherPeri', to: '/equipo/elias', Art: PeriPenguin, card: 'bg-tp-tint-violet' },
  { name: 'Catherine', mascot: 'TeacherCath', to: '/equipo/catherine', Art: CathCat, card: 'bg-[#ffd3dd]' },
]

export default function EquipoPage() {
  usePageMeta({ title: 'Equipo', description: 'Conoce a Elías y Catherine, las personas detrás de TeacherPeri, y a sus mascotas Peri y Cath.' })
  return (
    <>
      <Navbar />
      <main className="bg-tp-paper pt-[72px] text-tp-ink">
        <PageHero id="equipo-titulo" tone="yellow" kicker="Equipo" title="Conócenos" lead="Somos dos: cada quien con su mascota y su propia página." />
        <section aria-labelledby="equipo-titulo" className="tp-container grid gap-8 pb-24 pt-14 sm:grid-cols-2">
          {PEOPLE.map(({ name, mascot, to, Art, card }) => (
            <Link key={to} to={to} className={`tp-card tp-lift group flex min-w-0 items-end justify-between gap-3 p-6 sm:gap-4 sm:p-7 ${card}`}>
              <div className="flex min-w-0 flex-col gap-2 self-center">
                <span className="tp-hand -rotate-2 text-[24px] leading-none">{mascot}</span>
                <h2 className="font-display text-[34px] font-extrabold leading-none tracking-[-0.035em] sm:text-[44px]">{name}</h2>
                <span className="mt-2 font-bold">Ver su página<span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">{' →'}</span></span>
              </div>
              <Art className="h-[120px] w-auto shrink-0 sm:h-[170px]" />
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}
