import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MeshGradient } from '@paper-design/shaders-react'
import Navbar from '../components/Navbar'
import FloatingSymbol from '../components/motion/FloatingSymbol'
import { fadeUp, popIn, revealProps, staggerContainer } from '../components/motion/variants'

// Página independiente en /sobre-mi (ver App.jsx). Estilo "página de
// resumen/social media personal", pedida explícitamente por el usuario
// como una de las 3 páginas del sitio (junto con el home y /problemas).
//
// TODO IMPORTANTE: casi todo el contenido de este archivo es un
// PLACEHOLDER explícito (marcado entre corchetes o con comentarios) —
// no se inventaron datos biográficos. Las únicas excepciones son: tu
// nombre (viene de tu configuración de git) y "Python" como habilidad
// (lo mencionaste tú mismo en la conversación). Reemplaza el resto con
// tu información real antes de publicar.

const HABILIDADES = [
  'Python',
  '[JavaScript / React — en progreso]',
  '[Otra habilidad]',
  '[Otra habilidad]',
]

const EXPERIENCIA = [
  { rol: '[Tu puesto]', lugar: '[Organización]', fecha: '[Fechas]', detalle: '[Qué hiciste ahí — 1-2 líneas]' },
  { rol: '[Tu puesto]', lugar: '[Organización]', fecha: '[Fechas]', detalle: '[Qué hiciste ahí — 1-2 líneas]' },
]

const PROYECTOS = [
  {
    nombre: 'TeacherPeri',
    descripcion: 'Plataforma de matemáticas olímpicas con banco de problemas, gamificación y blog.',
    link: null,
    tilt: -1.5,
  },
  { nombre: '[Otro proyecto]', descripcion: '[Descripción corta]', link: null, tilt: 1.5 },
  { nombre: '[Otro proyecto]', descripcion: '[Descripción corta]', link: null, tilt: -1 },
]

function ExperienciaItem({ item }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-1 rounded-2xl border border-brand-200 bg-brand-50 p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold text-brand-900">{item.rol} · {item.lugar}</h3>
        <span className="text-xs uppercase tracking-wide text-brand-500">{item.fecha}</span>
      </div>
      <p className="text-sm text-brand-700">{item.detalle}</p>
    </motion.div>
  )
}

function ProyectoCard({ proyecto }) {
  return (
    <motion.div
      variants={popIn(proyecto.tilt)}
      whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
      className="flex flex-col gap-2 rounded-2xl border border-brand-200 bg-[#FFFBF5] p-5 shadow-md shadow-black/5 transition-shadow hover:shadow-xl"
    >
      <h3 className="font-semibold text-brand-900">{proyecto.nombre}</h3>
      <p className="text-sm text-brand-700">{proyecto.descripcion}</p>
      {proyecto.link && (
        <a href={proyecto.link} target="_blank" rel="noreferrer" className="mt-1 text-sm font-medium text-[#B70B0D] underline underline-offset-4">
          Ver más →
        </a>
      )}
    </motion.div>
  )
}

export default function SobreMiPage() {
  const navigate = useNavigate()

  const irAContacto = () => navigate('/', { state: { scrollTo: 'contacto' } })

  return (
    <>
      <Navbar />
      <main>
        {/* Encabezado: mismo tratamiento que el header de /problemas —
            fondo oscuro + MeshGradient animado, para que la página se
            sienta parte del mismo sitio. */}
        <section className="relative overflow-hidden bg-[#120303] px-4 py-28 text-center sm:px-6">
          <div className="pointer-events-none absolute inset-0">
            <MeshGradient
              className="absolute inset-0 h-full w-full"
              colors={['#B70B0D', '#E57505', '#FFB401', '#120303']}
              speed={0.25}
              distortion={0.7}
              swirl={0.25}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#120303]/75 via-[#120303]/40 to-[#120303]/85" />
          </div>
          <FloatingSymbol symbol="π" className="pointer-events-none absolute left-[10%] top-[20%] text-3xl text-[#FFB401]/30 sm:text-4xl" delay={0} duration={7} rotate={-6} />
          <FloatingSymbol symbol="∑" className="pointer-events-none absolute right-[12%] bottom-[22%] text-3xl text-[#E57505]/30 sm:text-4xl" delay={0.6} duration={6.5} rotate={6} />

          <motion.div initial="hidden" animate="show" variants={staggerContainer(0.15)} className="relative flex flex-col items-center gap-3">
            <motion.h1 variants={fadeUp} className="font-display text-4xl text-white sm:text-5xl">
              Elias Perianza Robles
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-xl text-white/75">
              [Escribe aquí tu tagline profesional — quién eres, qué haces,
              qué buscas.]
            </motion.p>
          </motion.div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <motion.div variants={staggerContainer(0.12)} {...revealProps} className="flex flex-col gap-4">
            <motion.h2 variants={fadeUp} className="font-display text-2xl text-brand-900">
              Sobre mí
            </motion.h2>
            <motion.p variants={fadeUp} className="text-brand-700">
              [Espacio para tu bio: de dónde vienes, qué estudias, por qué
              construiste TeacherPeri, qué te interesa profesionalmente.
              2-3 párrafos suelen ser suficiente para una página de este
              tipo.]
            </motion.p>
          </motion.div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
          <motion.div variants={staggerContainer(0.1)} {...revealProps}>
            <motion.h2 variants={fadeUp} className="font-display mb-6 text-2xl text-brand-900">
              Habilidades
            </motion.h2>
            <motion.div variants={staggerContainer(0.06)} className="flex flex-wrap gap-2">
              {HABILIDADES.map((h) => (
                <motion.span
                  key={h}
                  variants={popIn(0)}
                  className="rounded-full border border-brand-300 bg-white px-4 py-1.5 text-sm text-brand-700"
                >
                  {h}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
          <motion.div variants={staggerContainer(0.1)} {...revealProps}>
            <motion.h2 variants={fadeUp} className="font-display mb-6 text-2xl text-brand-900">
              Experiencia
            </motion.h2>
            <motion.div variants={staggerContainer(0.1)} className="flex flex-col gap-4">
              {EXPERIENCIA.map((item, i) => (
                <ExperienciaItem key={i} item={item} />
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
          <motion.div variants={staggerContainer(0.1)} {...revealProps}>
            <motion.h2 variants={fadeUp} className="font-display mb-6 text-2xl text-brand-900">
              Proyectos
            </motion.h2>
            <motion.div variants={staggerContainer(0.08)} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PROYECTOS.map((p) => (
                <ProyectoCard key={p.nombre} proyecto={p} />
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6">
          <motion.button
            type="button"
            onClick={irAContacto}
            {...revealProps}
            variants={fadeUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg"
            style={{ backgroundImage: 'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)' }}
          >
            Contáctame
          </motion.button>
        </section>
      </main>
    </>
  )
}
