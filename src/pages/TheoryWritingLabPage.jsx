import { Link, useSearchParams } from 'react-router-dom'
import ArticleText from '../components/training/ArticleText'
import { THEORY_WRITING_LAB } from '../../server/src/data/theoryWritingLab'
import { MVP_LESSONS } from '../../server/src/data/mvpLessons'
import { MVP_PROBLEMS } from '../../server/src/data/mvpProblems'

// Loaded only by Vite's development route. Reviewing prose never writes to MongoDB.
export default function TheoryWritingLabPage() {
  const [params] = useSearchParams()
  const selected = params.get('lesson')
  const revision = THEORY_WRITING_LAB[selected]
  const lesson = MVP_LESSONS.find((entry) => entry.pathSlug === selected)
  const problems = MVP_PROBLEMS.filter((problem) => problem.pathSlug === selected).map((problem) => ({ ...problem, _id: problem.codigo, reviewHref: `/entrenamiento/problemas?q=${encodeURIComponent(problem.codigo)}` }))
  return <main className="tp-reading min-h-screen bg-brand-50 px-4 py-10 sm:px-6">
    <div className="mx-auto max-w-4xl">
      <Link to="/entrenamiento/teoria" className="text-sm font-bold underline">← Sitio de TeacherPeri</Link>
      <header className="tp-card mt-6 bg-accent-yellow p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-widest">Revisión editorial · Solo desarrollo</p>
        <h1 className="mt-3 text-3xl font-black">Seis lecciones, dos maneras de enseñar</h1>
        <p className="mt-4 leading-7">Estas propuestas se leen directamente desde esta rama. No necesitas conectar MongoDB ni importar contenido para compararlas.</p>
      </header>
      <nav aria-label="Propuestas de escritura" className="my-8 grid gap-4 sm:grid-cols-2">
        {['A', 'B'].map((model) => <section key={model} className="tp-card-soft bg-white p-5">
          <h2 className="text-lg font-black">{model === 'A' ? 'A · Descubrimiento guiado' : 'B · Secuencia OMMBC'}</h2>
          <p className="mt-2 text-sm leading-6">{model === 'A' ? 'Una pregunta central que evoluciona antes de introducir la notación.' : 'El orden de secciones de una referencia concreta; explicaciones y actividades originales.'}</p>
          <ul className="mt-4 space-y-3">{Object.entries(THEORY_WRITING_LAB).filter(([, value]) => value.model === model).map(([slug, value]) => <li key={slug}><Link aria-current={selected === slug ? 'page' : undefined} className={`block border-2 p-3 text-sm font-bold ${selected === slug ? 'border-black bg-accent-yellow' : 'border-brand-300 hover:bg-accent-sky'}`} to={`?lesson=${slug}`}>{value.label}</Link></li>)}</ul>
        </section>)}
      </nav>
      {revision && lesson ? <article key={selected}>
        <header className="tp-card bg-accent-sky p-6 sm:p-9">
          <p className="text-xs font-black uppercase tracking-widest">{revision.label}</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{lesson.theory.title}</h2>
          {revision.source && <p className="mt-4 text-sm leading-6">Referencia de estructura: <a className="font-bold underline" href={revision.source} target="_blank" rel="noreferrer">consultar el material de OMMBC ↗</a>. Esta es una lección original de TeacherPeri.</p>}
        </header>
        <div className="tp-lesson-body mx-auto max-w-[840px] py-8"><ArticleText text={revision.content} problems={problems} /></div>
        <aside className="tp-card bg-accent-mint p-6"><h2 className="text-2xl font-black">Sigue en la Zona de Entrenamiento</h2><p className="mt-3 leading-7">Las tarjetas amarillas muestran problemas existentes del banco. Sus enlaces abren la búsqueda por código en tu sitio.</p><Link className="tp-button mt-4 bg-white px-4 py-3 font-bold" to="/entrenamiento/problemas">Explorar problemas →</Link></aside>
      </article> : <p className="my-12 text-lg">Elige una propuesta para comenzar. Compara la explicación, las pausas y la progresión de los retos.</p>}
      <aside className="my-10 border-t-2 border-brand-300 pt-6"><h2 className="font-black">Para tu revisión</h2><p className="mt-3 leading-7">¿En qué momento comprendiste la idea? ¿Dónde faltó una conexión? ¿Los ejercicios preparan para el reto? Puedes preferir un modelo para temas iniciales y otro para temas posteriores.</p></aside>
    </div>
  </main>
}
