import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Burst } from '../components/decor/Decor'

// 404: a poster «4✸4» where the zero is a comic starburst, the page title
// for screen readers and search, and three ways back in.
export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="bg-tp-paper pt-[72px] text-tp-ink">
        <section aria-labelledby="no-encontrada" className="relative overflow-hidden border-b-3 border-tp-ink bg-tp-coral">
          <div aria-hidden="true" className="tp-graph absolute inset-0" />
          <div aria-hidden="true" className="tp-halftone absolute -right-24 -top-28 size-[440px] opacity-[.15] [mask-image:radial-gradient(circle,black_20%,transparent_68%)]" />
          <div className="tp-container relative flex flex-col items-start gap-6 pb-16 pt-12 lg:pb-20 lg:pt-16">
            <span className="tp-sticker -rotate-2 bg-tp-yellow">Error 404</span>
            <p aria-hidden="true" className="flex items-center font-display text-[clamp(110px,22vw,260px)] font-extrabold leading-[.8] tracking-[-0.06em]">
              4
              <Burst className="mx-[0.04em] size-[0.95em] -rotate-12" color="var(--tp-yellow)">
                <span className="text-[0.62em] leading-none">0</span>
              </Burst>
              4
            </p>
            <h1 id="no-encontrada" className="tp-page-title">Página no encontrada</h1>
            <p className="tp-hand -rotate-2 text-[32px] leading-tight">Este problema no tiene solución… todavía.</p>
          </div>
        </section>
        <div className="tp-container flex flex-col items-start gap-8 pb-24 pt-12">
          <p className="tp-lead max-w-[560px] text-[18px] text-tp-ink-soft">Regresa a Inicio o explora las Rutas y bibliotecas de entrenamiento.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/" className="tp-button min-h-[52px] bg-tp-violet px-6 font-bold text-white">Ir a Inicio</Link>
            <Link to="/rutas" className="tp-button min-h-[52px] bg-tp-surface px-6 font-bold">Explorar Rutas<span aria-hidden="true">{' →'}</span></Link>
            <Link to="/entrenamiento/problemas" className="tp-button min-h-[52px] bg-tp-surface px-6 font-bold">Practicar problemas<span aria-hidden="true">{' →'}</span></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
