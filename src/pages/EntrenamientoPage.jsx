import { useState } from 'react'
import Navbar from '../components/Navbar'
import Problemas from './Problemas'
import BancoExamenes from '../components/training/BancoExamenes'
import ListasPractica from '../components/training/ListasPractica'

// Página 2/8: Entrenamiento — hub único que junta lo que antes eran dos
// conceptos separados ("Materiales" y "Banco de problemas") en 3
// pestañas dentro de una sola página. Cambiar de pestaña solo cambia
// qué componente se dibuja (useState local, sin sub-rutas) — es un
// selector, no una navegación nueva.
//
// "Banco de Problemas" sigue siendo <Problemas /> SIN TOCAR (mismo
// archivo de siempre, con su propio encabezado/sidebar/tarjetas) — se
// pidió explícitamente mantener su layout exacto. Las otras 2 pestañas
// (Exámenes, Listas) son vistas nuevas con datos de ejemplo (ver sus
// archivos en /src/components/training) que copian el mismo estilo
// visual de carpetas para que las 3 pestañas se sientan un solo
// sistema, aunque solo una tenga contenido real por ahora.
const TABS = [
  { id: 'problemas', label: 'Banco de Problemas' },
  { id: 'examenes', label: 'Banco de Exámenes' },
  { id: 'listas', label: 'Listas de Práctica' },
]

function TabSelector({ activo, onChange }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-4 pb-6 pt-20 sm:px-6">
      {TABS.map((tab) => {
        const esActivo = tab.id === activo
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
              esActivo
                ? 'border-transparent text-white shadow-md'
                : 'border-brand-300 bg-white text-brand-600 hover:border-[#E57505] hover:text-[#E57505]'
            }`}
            style={
              esActivo
                ? { backgroundImage: 'linear-gradient(135deg, #FFB401 0%, #E57505 45%, #B70B0D 100%)' }
                : undefined
            }
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default function EntrenamientoPage() {
  const [tab, setTab] = useState('problemas')

  return (
    <>
      <Navbar />
      <main>
        <TabSelector activo={tab} onChange={setTab} />
        {tab === 'problemas' && <Problemas />}
        {tab === 'examenes' && <BancoExamenes />}
        {tab === 'listas' && <ListasPractica />}
      </main>
    </>
  )
}
