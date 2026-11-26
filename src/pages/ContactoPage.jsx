import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import Contacto from '../components/sections/Contacto'
import ContactForm from '../components/contact/ContactForm'
import Mascot from '../components/decor/Mascot'
import { BubbleTail, Mark } from '../components/decor/Decor'
import { usePageMeta } from '../hooks/usePageMeta'

// Página Contacto: la bienvenida y una cita en un globo de diálogo junto
// al formulario, y al final las formas de contacto directo
// (Contacto.jsx).
export default function ContactoPage() {
  usePageMeta({ title: 'Contacto', description: 'Ponte en contacto con TeacherPeri: escríbenos con tus dudas, ideas o ganas de colaborar.' })
  return (
    <>
      <Navbar />
      <main className="bg-tp-paper pt-[72px] text-tp-ink">
        <PageHero
          id="contacto-titulo"
          tone="mint"
          kicker="Contacto"
          title={<Mark variant="lines" color="var(--tp-orange)" width={6} delay={300}>Contáctanos</Mark>}
          art={<Mascot pose="peri-saludando" className="h-[210px]" />}
        />

        <section aria-label="Escríbeme" className="tp-container grid items-start gap-12 pb-20 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-14">
          <div className="tp-bubble bg-tp-surface px-6 py-6 sm:px-8 sm:py-7">
            <p className="text-[17px] leading-[1.7]">
              TeacherPeri es un proyecto hecho con mucho cariño para acompañarte en tu camino
              olímpico y en tu meta de estudiar en el extranjero. Ya seas un estudiante buscando
              orientación, un exolímpico con ganas de aportar, o un profesor o papá/mamá buscando
              material, ¡este espacio es para ti!
            </p>
            <figure className="mt-5 -rotate-1">
              <blockquote className="tp-hand text-[27px] leading-tight text-tp-violet">
                «Lo importante es no dejar de hacer preguntas.»
              </blockquote>
              <figcaption className="mt-1 text-sm font-bold text-tp-ink-muted">— Albert Einstein</figcaption>
            </figure>
            <BubbleTail className="left-10 top-[calc(100%-3px)]" />
          </div>
          <ContactForm />
        </section>

        <Contacto />
      </main>
      <Footer />
    </>
  )
}
