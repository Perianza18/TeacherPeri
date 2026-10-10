import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

const panels = [
  { className: 'left-2 top-2 -rotate-2 bg-accent-yellow', label: '01 · APRENDE', value: 'Ideas claras' },
  { className: 'right-0 top-[34%] rotate-2 bg-accent-sky', label: '02 · PRACTICA', value: 'Problemas reales' },
  { className: 'bottom-2 left-[14%] rotate-1 bg-accent-mint', label: '03 · AVANZA', value: 'Tu propia ruta' },
]

export default function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden border-b-4 border-black bg-[#111111] px-4 pb-20 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
      <div className="tp-dot-grid pointer-events-none absolute inset-0 -z-10 opacity-[.08]" />
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <span className="tp-kicker -rotate-1">Matemáticas · Universidad · Comunidad</span>
          <h1 className="mt-7 text-5xl font-black uppercase leading-[.9] tracking-[-0.065em] text-white sm:text-7xl lg:text-[5.8rem]">
            Tu camino para <span className="text-accent-sky">llegar</span> <span className="text-accent-coral">más lejos.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/72 sm:text-xl">
            Preparación para Olimpiadas de Matemáticas y orientación para universidades competitivas, organizada para que sepas qué hacer después.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/rutas" className="tp-button bg-accent-purple px-6 py-3.5 text-sm font-black text-white">Explorar Rutas →</Link>
            <Link to="/entrenamiento" className="tp-button bg-white px-6 py-3.5 text-sm font-black text-brand-900">Zona de Entrenamiento</Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="relative mx-auto h-[350px] w-full max-w-[470px] sm:h-[400px]"
          aria-label="Aprende, practica y avanza"
        >
          <div className="absolute left-[8%] top-[10%] h-[76%] w-[78%] rotate-3 border-4 border-black bg-accent-purple shadow-[10px_10px_0_#377CF6]" />
          {panels.map((panel, index) => (
            <div key={panel.label} className={`tp-card absolute w-[78%] p-5 text-brand-900 sm:p-6 ${panel.className}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black tracking-[.14em]">{panel.label}</p>
                <span className="grid h-8 w-8 place-items-center border-2 border-black bg-white text-sm font-black">{index + 1}</span>
              </div>
              <p className="mt-5 text-2xl font-black uppercase tracking-[-.04em] sm:text-3xl">{panel.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
