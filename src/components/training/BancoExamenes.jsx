import { motion } from 'framer-motion'
import TrainingHeader from './TrainingHeader'
import TrainingFolderCard from './TrainingFolderCard'
import { staggerContainer } from '../motion/variants'

const ACCENTS = ['#B70B0D', '#E57505', '#FFB401']

// TODO: contenido de ejemplo, no hay modelo de datos de exámenes en el
// backend todavía (solo Problem/Category/Comment/User). Cuando exista,
// esta carpeta-lista sale de una llamada a la API, igual que las
// carpetas de Problemas.jsx.
const CARPETAS_EJEMPLO = [
  { nombre: 'Simulacros de Práctica', detalle: 'Próximamente' },
  { nombre: 'Exámenes Oficiales por Año', detalle: 'Próximamente' },
  { nombre: 'Exámenes por Tema', detalle: 'Próximamente' },
]

export default function BancoExamenes() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <TrainingHeader
        eyebrow="Entrenamiento"
        title="Banco de Exámenes"
        subtitle="Exámenes completos de competencias pasadas, organizados por carpetas — en construcción."
      />
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {CARPETAS_EJEMPLO.map((carpeta, i) => (
          <TrainingFolderCard
            key={carpeta.nombre}
            nombre={carpeta.nombre}
            detalle={carpeta.detalle}
            color={ACCENTS[i % ACCENTS.length]}
            tilt={i % 2 === 0 ? -1.2 : 1.2}
          />
        ))}
      </motion.div>
    </section>
  )
}
