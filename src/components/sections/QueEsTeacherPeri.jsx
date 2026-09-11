import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MeshGradient } from '@paper-design/shaders-react'
import FloatingSymbol from '../motion/FloatingSymbol'
import { fadeUp, popIn, revealProps, staggerContainer } from '../motion/variants'

// Sección "¿Qué es TeacherPeri?" (id="mision") — reemplaza a QuienesSomos.jsx
// (que era "¿Qué es Axioma?", con stats de club: fundación, miembros,
// competencias/año — ninguno aplica aquí). Mismo fondo MeshGradient oscuro
// que Hero.jsx, a propósito: la idea es que el home NO alterne entre
// "hero oscuro y colorido" -> "sección blanca plana" -> "footer oscuro",
// sino que se sienta como un solo lienzo continuo (ver la explicación de
// hackthenorth.com que se dio en el chat).
//
// TODO: este texto es un primer borrador razonable a partir de la
// conversación sobre qué es TeacherPeri — no son datos inventados sobre
// vos, son una descripción del PROYECTO. Ajusta el copy libremente.

const PROPUESTAS = [
  { symbol: '∫', texto: 'Banco de problemas por carpetas, como AoPS' },
  { symbol: '★', texto: 'Puntos, rachas e insignias, como Khan Academy' },
  { symbol: '✎', texto: 'Acceso libre y gratuito para cualquier estudiante' },
]

export default function QueEsTeacherPeri() {
  return (
    <section
      id="mision"
      className="relative overflow-hidden bg-[#120303] px-4 py-24 scroll-mt-16 sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <MeshGradient
          className="absolute inset-0 h-full w-full"
          colors={['#B70B0D', '#E57505', '#FFB401', '#120303']}
          speed={0.22}
          distortion={0.7}
          swirl={0.25}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120303]/80 via-[#120303]/55 to-[#120303]/85" />
      </div>

      <FloatingSymbol symbol="∞" className="pointer-events-none absolute left-[8%] top-[14%] text-3xl text-[#FFB401]/30 sm:text-4xl" delay={0.2} duration={7.5} rotate={-6} />
      <FloatingSymbol symbol="√" className="pointer-events-none absolute right-[10%] bottom-[18%] text-3xl text-[#E57505]/30 sm:text-4xl" delay={0.8} duration={6.5} rotate={6} />

      <motion.div
        className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
        variants={staggerContainer(0.15)}
        {...revealProps}
      >
        <motion.h2 variants={fadeUp} className="font-display text-3xl text-white sm:text-4xl">
          ¿Qué es TeacherPeri?
        </motion.h2>

        <motion.p variants={fadeUp} className="text-white/80">
          TeacherPeri es una plataforma para el entrenamiento en matemáticas
          olímpicas de nivel preparatoria: un banco de problemas navegable
          por carpetas, con progreso, puntos e insignias, y un blog para
          compartir contenido nuevo. La misión es fomentar el crecimiento de
          las matemáticas olímpicas dando acceso libre y gratuito a recursos
          de calidad, sin importar en qué escuela estudies.
        </motion.p>

        <motion.div
          variants={staggerContainer(0.1)}
          className="mt-2 flex flex-wrap items-center justify-center gap-3"
        >
          {PROPUESTAS.map((item) => (
            <motion.span
              key={item.texto}
              variants={popIn(0)}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
            >
              <span aria-hidden="true" className="text-[#FFB401]">{item.symbol}</span>
              {item.texto}
            </motion.span>
          ))}
        </motion.div>

        <motion.p variants={fadeUp} className="mt-4 text-sm text-white/60">
          ¿Quién está detrás de este proyecto?{' '}
          <Link to="/sobre-mi" className="font-medium text-white underline underline-offset-4 hover:text-[#FFB401]">
            Conóceme en Sobre mí
          </Link>
          .
        </motion.p>
      </motion.div>
    </section>
  )
}
