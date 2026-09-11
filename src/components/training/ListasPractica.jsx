import { motion } from 'framer-motion'
import TrainingHeader from './TrainingHeader'
import TrainingFolderCard from './TrainingFolderCard'
import { staggerContainer } from '../motion/variants'

const ACCENTS = ['#B70B0D', '#E57505', '#FFB401']

// TODO: contenido de ejemplo — igual que BancoExamenes.jsx, no hay
// modelo de datos de "listas de práctica" en el backend todavía.
const LISTAS_EJEMPLO = [
  { nombre: 'Fundamentos de Álgebra', detalle: 'Próximamente' },
  { nombre: 'Introducción a Combinatoria', detalle: 'Próximamente' },
  { nombre: 'Geometría — Nivel 1', detalle: 'Próximamente' },
]

export default function ListasPractica() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <TrainingHeader
        eyebrow="Entrenamiento"
        title="Listas de Práctica"
        subtitle="Colecciones curadas de problemas para practicar un tema a la vez, de fácil a difícil — en construcción."
      />
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {LISTAS_EJEMPLO.map((lista, i) => (
          <TrainingFolderCard
            key={lista.nombre}
            nombre={lista.nombre}
            detalle={lista.detalle}
            color={ACCENTS[i % ACCENTS.length]}
            tilt={i % 2 === 0 ? -1.2 : 1.2}
          />
        ))}
      </motion.div>
    </section>
  )
}
