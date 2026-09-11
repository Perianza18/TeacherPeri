import { motion } from 'framer-motion'
import { MeshGradient } from '@paper-design/shaders-react'
import { fadeUp, staggerContainer } from '../motion/variants'

// Encabezado reutilizado por las vistas de Entrenamiento que todavía no
// tienen datos reales (Banco de Exámenes, Listas de Práctica) — mismo
// tratamiento visual (MeshGradient oscuro) que ya usa Problemas.jsx en
// su propio encabezado ("Archivo de Problemas"), para que las 3 vistas
// del hub de Entrenamiento se sientan parte del mismo sistema aunque
// solo una de ellas (Banco de Problemas) tenga contenido real todavía.
export default function TrainingHeader({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="relative mb-10 overflow-hidden rounded-3xl px-6 py-10 text-center shadow-2xl shadow-black/20 sm:px-10"
      style={{ backgroundColor: '#120303' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <MeshGradient
          className="absolute inset-0 h-full w-full"
          colors={['#B70B0D', '#E57505', '#FFB401', '#120303']}
          speed={0.22}
          distortion={0.7}
          swirl={0.25}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120303]/70 via-[#120303]/40 to-[#120303]/85" />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.1)}
        className="relative flex flex-col items-center gap-2"
      >
        {eyebrow && (
          <motion.span
            variants={fadeUp}
            className="bg-clip-text text-xs font-semibold uppercase tracking-[0.35em] text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)' }}
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h2 variants={fadeUp} className="font-display text-3xl text-white sm:text-4xl">
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p variants={fadeUp} className="max-w-xl text-sm text-white/70">
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}
