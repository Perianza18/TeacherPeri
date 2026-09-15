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
console.log(`- Entrenamientos mixtos con Steps: ${OMM_CURRICULUM.entries.filter(({ path }) => path.steps.length).length}`)
console.log('- Referencias a contenido educativo: 0 (pendientes de revisión editorial)')
console.log('\nInventario')
console.log(ommCurriculumTable())
