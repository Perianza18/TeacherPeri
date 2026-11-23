import { Link } from 'react-router-dom'
import LibraryCard from '../components/training/LibraryCard'
import PageHero from '../components/PageHero'
import { problemas } from '../../server/src/data/problemasReales'
import { MVP_PROBLEMS } from '../../server/src/data/mvpProblems'

// Existing exam statements; topics below illustrate how the strip will look
// if those topics are attached to the actual problem records.
const examples = [
  { code: 'TP-C06', topic: 'Principio de casillas' },
  { code: 'OMMU-PR-2025-1', topic: 'Conteo de subconjuntos' },
  { code: 'OMMU-NAC-2025-2', topic: 'Invariantes' },
  { code: 'PUTNAM-2025-A3', topic: 'Juegos y estrategias' },
]

export default function ProblemCardPreviewPage() {
  const cards = examples.map(({ code, topic }) => ({ ...[...problemas, ...MVP_PROBLEMS].find((problem) => problem.codigo === code), _id: code, ...(code === 'TP-C06' ? { tema: 'Combinatoria' } : {}), topics: [{ name: topic }] }))
  return <main className="min-h-screen bg-tp-paper">
    <PageHero tone="violet" kicker="Vista previa local" title="Tarjetas de problemas" lead="Ejemplos de problemas y exámenes con enunciados existentes y subtemas ilustrativos. Los botones son solo una muestra." before={<Link to="/entrenamiento/problemas" className="text-sm font-bold underline">← Volver a Problemas</Link>} />
    <section className="tp-container pb-24 pt-10"><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{cards.map((item) => <LibraryCard key={item._id} item={item} type="problems" title="Problemas" strip="bg-tp-yellow" base="/entrenamiento/problemas" preview />)}</div></section>
  </main>
}
