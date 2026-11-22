import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import PageHero from './PageHero'
import { Burst, Highlight } from './decor/Decor'
import { usePageMeta } from '../hooks/usePageMeta'

// Empty state / «Próximamente» page (DESIGN §6): the page title in a yellow
// band, then a white card with a kicker and one sentence. No placeholder
// people, posts or illustrations.
export default function PagePlaceholder({ title, description, kicker = 'Próximamente' }) {
  usePageMeta({ title, description })
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-tp-paper pt-[72px] text-tp-ink">
        <PageHero id="pagina-titulo" tone="yellow" title={<Highlight color="var(--tp-sky)" delay={250}>{title}</Highlight>} className="lg:pb-20 lg:pt-20" />
        <div className="tp-container pb-24 pt-14">
          <section className="tp-card relative max-w-[760px] bg-tp-surface p-7 sm:p-9">
            {kicker === 'Próximamente' && (
              <span aria-hidden="true" className="absolute -right-5 -top-12 rotate-12 sm:-right-8">
                <Burst className="size-[108px]" color="var(--tp-coral)">
                  <span className="font-display text-[15px] font-extrabold leading-none">¡Pronto!</span>
                </Burst>
              </span>
            )}
            <span className="tp-sticker -rotate-2 bg-tp-yellow">{kicker}</span>
            <p className="mt-5 max-w-[600px] text-lg leading-8 text-tp-ink-soft">
              {description || 'Este espacio está tomando forma y pronto tendrá contenido.'}
            </p>
          </section>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link className="tp-button min-h-[52px] bg-tp-violet px-6 font-bold text-white" to="/rutas">Explorar Rutas<span aria-hidden="true">{' →'}</span></Link>
            <Link className="tp-button min-h-[52px] bg-tp-surface px-6 font-bold text-tp-ink" to="/entrenamiento/problemas">Practicar problemas<span aria-hidden="true">{' →'}</span></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
