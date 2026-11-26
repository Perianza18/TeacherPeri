import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import { usePageMeta } from '../../hooks/usePageMeta'

// Elías's own page (TeacherPeri), linked from Equipo. It is Elías's to
// decorate: everything on it lives in this file, so changes here don't touch
// anyone else's page. It opens in its own tab from Equipo, without the site
// menu.
export default function EliasPage() {
  usePageMeta({ title: 'Elías', description: 'Elías, parte del equipo de TeacherPeri.' })
  return (
    <>
      <main className="min-h-[70vh] bg-tp-paper text-tp-ink">
        <div className="tp-container pb-24 pt-12">
          <Link to="/equipo" className="font-semibold underline underline-offset-4">← Equipo</Link>
          <h1 className="tp-page-title mt-6">Elías</h1>
          <p className="mt-4 text-lg font-semibold">En construcción (ando sobreviviendo a finales).</p>
          <p className="mt-2 max-w-[560px] text-lg text-tp-ink-muted">Pronto estará lista mi página, pero mientras tanto pueden ir a conocer la de Catherine.</p>
          <Link to="/equipo/catherine" className="tp-button mt-6 bg-tp-yellow px-5 font-bold">Ir a la página de Catherine →</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
