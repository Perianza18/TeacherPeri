import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { fadeUp, revealProps } from '../components/motion/variants'

// Página 4/8: Experiencias. Layout de feed/blog (pedido explícitamente en
// la lógica de esta página) — todavía sin posts reales, así que se
// dibuja el ESQUELETO del feed con un estado vacío en vez del
// PagePlaceholder genérico. Cuando lleguen historias reales, reemplaza
// HISTORIAS (ahora []) con los posts de verdad y el feed ya tiene dónde
// dibujarlos (ver PostCard más abajo).
const HISTORIAS = []

function PostCard({ historia }) {
  return (
    <article className="rounded-2xl border border-brand-200 bg-brand-50 p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-brand-500">{historia.autor}</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-900">{historia.titulo}</h2>
      <p className="mt-2 text-sm text-brand-700">{historia.resumen}</p>
    </article>
  )
}

export default function ExperienciasPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-28 sm:px-6">
        <motion.h1
          variants={fadeUp}
          {...revealProps}
          className="font-display mb-3 text-center text-3xl text-brand-900 sm:text-4xl"
        >
          Experiencias
        </motion.h1>
        <motion.p
          variants={fadeUp}
          {...revealProps}
          className="mx-auto mb-12 max-w-xl text-center text-brand-600"
        >
          Historias de exolímpicos para inspirarte a dar el siguiente paso.
        </motion.p>

        {HISTORIAS.length === 0 ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-white/60 py-16 text-brand-400">
            Aún no hay historias publicadas — ¡vuelve pronto!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {HISTORIAS.map((historia) => (
              <PostCard key={historia.titulo} historia={historia} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
