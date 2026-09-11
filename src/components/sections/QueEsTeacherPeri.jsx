import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MeshGradient } from '@paper-design/shaders-react'
import FloatingSymbol from '../motion/FloatingSymbol'
import { fadeUp, popIn, revealProps, staggerContainer } from '../motion/variants'

// Sección "Bienvenida + Misión/Visión" (id="mision") de Inicio. Contenido
// EXACTO pedido para esta página — no es un placeholder ni un borrador.
// Mismo fondo MeshGradient oscuro que Hero.jsx, a propósito: la idea es
// que el home NO alterne entre "hero oscuro y colorido" -> "sección
// blanca plana", sino que se sienta como un solo lienzo continuo.

// Las 4 tarjetas de acceso rápido — cada una es un <Link> real a la
// página que describe, no solo texto. El copy de cada una es el mismo
// que se pidió para "¿Qué encontrarás aquí?".
const SECCIONES = [
  {
    to: '/entrenamiento',
    titulo: 'Entrenamiento',
    descripcion:
      'Nuestro banco de problemas estilo foro, exámenes oficiales y listas de práctica guiadas.',
  },
  {
    to: '/recursos',
    titulo: 'Más Recursos',
    descripcion:
      'Las mejores recomendaciones de sitios, libros y canales para seguir aprendiendo.',
  },
  {
    to: '/experiencias',
    titulo: 'Experiencias',
    descripcion: 'Historias de exolímpicos para inspirarte a dar el siguiente paso.',
  },
  {
    to: '/estudia-en-el-extranjero',
    titulo: 'Estudia en el Extranjero',
    descripcion: 'La guía definitiva para aplicar a universidades top en EE. UU. y Canadá.',
  },
]

function SeccionCard({ seccion }) {
  return (
    <motion.div variants={popIn(0)}>
      <Link
        to={seccion.to}
        className="group flex h-full flex-col gap-2 rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur transition-colors hover:border-[#FFB401]/50 hover:bg-white/10"
      >
        <h3 className="font-display text-lg text-white transition-colors group-hover:text-[#FFB401]">
          {seccion.titulo}
        </h3>
        <p className="text-sm text-white/70">{seccion.descripcion}</p>
      </Link>
    </motion.div>
  )
}

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
        className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 text-center"
        variants={staggerContainer(0.15)}
        {...revealProps}
      >
        <motion.p variants={fadeUp} className="max-w-2xl text-lg text-white/90">
          ¡Holaaa! Qué bueno que busques más material para entrenarte. Bienvenido a TeacherPeri.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col items-center gap-6">
          <h2 className="font-display text-2xl text-white sm:text-3xl">
            ¿Qué encontrarás aquí?
          </h2>
          <motion.div
            variants={staggerContainer(0.1)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {SECCIONES.map((seccion) => (
              <SeccionCard key={seccion.to} seccion={seccion} />
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex max-w-2xl flex-col gap-4 text-left">
          <p className="text-white/80">
            <strong className="text-white">Misión:</strong> Hacer que el entrenamiento para
            olimpiadas de matemáticas sea accesible para todos. Inspirados por la experiencia
            de dar talleres gratuitos a estudiantes y profesores, buscamos que cualquier
            persona, sin importar su nivel, tenga los recursos estructurados para alcanzar
            competencias internacionales.
          </p>
          <p className="text-white/80">
            <strong className="text-white">Visión:</strong> Convertirnos en el punto de
            encuentro y la herramienta principal de la comunidad olímpica hispanohablante.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
