import { motion } from 'framer-motion'
import { popIn } from '../motion/variants'

// Mismo ícono de carpeta dibujado a mano (SVG) que ya usa FolderCard
// dentro de Problemas.jsx — se repite aquí en vez de importarlo porque
// esa función vive dentro de Problemas.jsx sin exportarse, y no se
// debe tocar ese archivo (layout "exacto" pedido para Banco de
// Problemas).
function FolderIcon({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M3 6.5C3 5.67 3.67 5 4.5 5H9.5l2 2H19.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15C3.67 19 3 18.33 3 17.5v-11z" />
    </svg>
  )
}

// Tarjeta de "carpeta" para las vistas de Entrenamiento sin datos
// reales todavía (Exámenes, Listas de Práctica) — mismo tilt/hover que
// FolderCard de Problemas.jsx, para que las 3 pestañas se vean como un
// solo sistema visual.
export default function TrainingFolderCard({ nombre, detalle, color, tilt = 0 }) {
  return (
    <motion.div
      variants={popIn(tilt)}
      whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-brand-200 bg-[#FFFBF5] px-5 py-8 text-center shadow-md shadow-black/5 transition-shadow duration-200 hover:shadow-xl hover:shadow-brand-900/10"
    >
      <FolderIcon className="h-12 w-12 transition-transform group-hover:scale-110" style={{ color }} />
      <h3 className="text-lg font-semibold text-brand-900 transition-colors group-hover:text-[#B70B0D]">
        {nombre}
      </h3>
      <span className="text-xs text-brand-500">{detalle}</span>
    </motion.div>
  )
}
