import { motion, useReducedMotion } from 'framer-motion'

export default function TrainingHeader({ eyebrow, title, subtitle }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
      {eyebrow && <span className="tp-kicker">{eyebrow}</span>}
      <h1 className="mt-5 text-4xl font-black uppercase tracking-[-0.05em] text-brand-900 sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-4 max-w-2xl leading-7 text-brand-600">{subtitle}</p>}
    </motion.div>
  )
}
