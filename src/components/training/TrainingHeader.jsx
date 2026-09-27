import { motion } from 'framer-motion'

export default function TrainingHeader({ eyebrow, title, subtitle }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">{eyebrow}</p>}
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-brand-900 sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-4 max-w-2xl leading-7 text-brand-600">{subtitle}</p>}
    </motion.div>
  )
}
