import {
  OMM_CURRICULUM,
  ommCurriculumTable,
  ommCurriculumTree,
  validateOmmCurriculumDefinition,
} from '../data/ommCurriculum.js'

validateOmmCurriculumDefinition()

console.log(ommCurriculumTree())
console.log('\nResumen')
console.log(`- Path raíz: ${OMM_CURRICULUM.root.title} (${OMM_CURRICULUM.root.publicationStatus})`)
console.log(`- PathSections: ${OMM_CURRICULUM.sections.length}`)
console.log(`- PathReferences: ${OMM_CURRICULUM.entries.length}`)
const emptyMixedPaths = OMM_CURRICULUM.entries.filter(({ path }) =>
  path.slug.startsWith('entrenamiento-mixto-ciclo-') && path.steps.length === 0)
console.log(`- Entrenamientos mixtos sin Steps redactados: ${emptyMixedPaths.length}`)
console.log('- Referencias a contenido educativo: 0 (pendientes de revisión editorial)')
console.log('\nInventario')
console.log(ommCurriculumTable())
