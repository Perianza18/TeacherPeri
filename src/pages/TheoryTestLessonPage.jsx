import TheoryView from '../components/theory/TheoryView'
import ReviewProblemCollection from '../components/training/ReviewProblemCollection'
import { MVP_PROBLEMS } from '../../server/src/data/mvpProblems'
import { TEST_COLLECTIONS, TEST_LESSON, testFigureUrl } from '../dev/theoryTestLesson'

// Dev-only page (/dev/teoria-prueba, registered only when import.meta.env.DEV):
// the test lesson in the library context, with every block of the format.
const lessonProblems = TEST_COLLECTIONS.prueba.practice
  .map((code) => MVP_PROBLEMS.find((problem) => problem.codigo === code))
  .map((problem) => ({ ...problem, _id: problem.codigo, href: `/entrenamiento/problemas?q=${problem.codigo}` }))

export default function TheoryTestLessonPage() {
  return (
    <TheoryView
      item={TEST_LESSON}
      problems={lessonProblems}
      renderCollection={(slug, kind) => <ReviewProblemCollection collection={slug} kind={kind} codes={TEST_COLLECTIONS[slug]?.[kind]} />}
      resolveFigure={testFigureUrl}
    />
  )
}
