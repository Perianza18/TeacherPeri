import { useParams } from 'react-router-dom'
import TheoryView from '../components/theory/TheoryView'
import PracticeBox from '../components/content/PracticeBox'
import { MVP_LESSONS } from '../../server/src/data/mvpLessons'
import { MVP_PROBLEMS } from '../../server/src/data/mvpProblems'
import { THEORY_REWRITES } from '../../server/src/data/theory/index'
import { OMM_CURRICULUM } from '../../server/src/data/ommCurriculum'

export default function TheoryDraftPage() {
  const { slug } = useParams()
  const draft = THEORY_REWRITES[slug]
  const lesson = MVP_LESSONS.find((entry) => entry.pathSlug === slug)
  if (!draft || !lesson) return <p>Lección no encontrada.</p>
  const byCode = new Map([...MVP_PROBLEMS, ...draft.problems].map((problem) => [problem.codigo, problem]))
  const collection = (name, kind) => {
    const entries = (draft.collections[name]?.[kind] || []).map((code) => byCode.get(code)).filter(Boolean)
      .map((problem) => ({ ...problem, _id: problem.codigo, href: null }))
    return entries.length ? <PracticeBox kind={kind} problems={entries} fullStatements /> : null
  }
  const containsLesson = (path) => path.slug === slug || path.children.some(containsLesson)
  const rootEntry = OMM_CURRICULUM.rootEntries.find(({ child }) => containsLesson(child))
  const section = OMM_CURRICULUM.sections.find(({ key }) => key === rootEntry?.sectionKey)
  const topic = section ? section.title.split(' — ')[0] : rootEntry?.child.title
  const item = { ...lesson.theory, _id: slug, topics: topic ? [{ name: topic }] : [] }
  return <TheoryView item={item} problems={[]} renderCollection={collection} />
}
