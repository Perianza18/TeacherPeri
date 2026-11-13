import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

// Empty state / «Próximamente» page (DESIGN §6): the page title, then a white
// soft card with a yellow kicker and one sentence. No placeholder people,
// posts or illustrations.
export default function PagePlaceholder({ title, description, kicker = 'Próximamente' }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-brand-50 px-4 pb-24 pt-32 sm:px-6">
        <div className="mx-auto max-w-[840px]">
          <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.02em] text-brand-900 sm:text-[52px]">{title}</h1>
          <section className="tp-card-soft mt-8 bg-white p-6 sm:p-7">
            <span className="tp-kicker">{kicker}</span>
            <p className="mt-4 text-lg leading-8 text-brand-700">
              {description || 'Este espacio está tomando forma y pronto tendrá contenido.'}
            </p>
          </section>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="tp-button min-h-11 bg-accent-violet px-5 py-3 font-black text-white" to="/rutas">Explorar Rutas →</Link>
            <Link className="tp-button min-h-11 bg-white px-5 py-3 font-black text-brand-900" to="/entrenamiento/problemas">Practicar problemas →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
