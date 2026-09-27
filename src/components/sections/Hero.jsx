import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

const nodes = [
  { label: 'OMM', x: 50, y: 14, active: true },
  { label: 'Álgebra', x: 25, y: 40 },
  { label: 'Geometría', x: 72, y: 42, active: true },
  { label: 'Problemas', x: 18, y: 72 },
  { label: 'Teoría', x: 76, y: 72 },
]

export default function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-[#0B0B0F] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-[6%] top-[28%] h-96 w-96 rounded-full bg-blue-600/18 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_34%)]" />
      </div>

      <div className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">TeacherPeri</p>
          <h1 className="text-5xl font-extrabold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            Tu camino para <span className="tp-gradient-text">llegar más lejos.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
            Preparación para Olimpiadas de Matemáticas y orientación para universidades competitivas, en un solo lugar.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/rutas" className="tp-gradient rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-950/30 transition hover:-translate-y-0.5">
              Explorar Rutas
            </Link>
            <Link to="/entrenamiento" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10">
              Zona de Entrenamiento
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-[520px]"
        >
          <div className="absolute inset-[7%] rounded-[2.5rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/25 backdrop-blur-sm" />
          <svg className="absolute inset-[11%] h-[78%] w-[78%]" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="pathGradient" x1="0" x2="1">
                <stop offset="0" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            <path d="M50 14 C42 25 31 30 25 40 C21 50 19 60 18 72" fill="none" stroke="url(#pathGradient)" strokeWidth="1.2" strokeOpacity=".75" />
            <path d="M50 14 C58 24 68 31 72 42 C74 52 75 61 76 72" fill="none" stroke="url(#pathGradient)" strokeWidth="1.2" strokeOpacity=".9" />
            <path d="M25 40 C39 43 57 43 72 42" fill="none" stroke="white" strokeWidth=".65" strokeOpacity=".16" />
          </svg>
          {nodes.map((node, index) => (
            <motion.div
              key={node.label}
              className="absolute"
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
              animate={reduceMotion ? undefined : { y: [0, index % 2 ? -4 : 4, 0] }}
              transition={{ duration: 5 + index * 0.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className={`grid h-12 w-12 place-items-center rounded-full border text-xs font-bold shadow-xl ${node.active ? 'border-violet-300/45 bg-violet-500/20 text-white shadow-violet-500/20' : 'border-white/15 bg-[#15151B] text-white/75 shadow-black/20'}`}>
                <span className="h-2.5 w-2.5 rounded-full bg-current" />
              </div>
              <span className="absolute left-1/2 top-14 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-white/55">{node.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
