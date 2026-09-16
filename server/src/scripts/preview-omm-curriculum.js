import {
  OMM_CURRICULUM,
  curriculumCounts,
  ommCurriculumTree,
  validateOmmCurriculumDefinition,
} from '../data/ommCurriculum.js'

validateOmmCurriculumDefinition()

console.log(ommCurriculumTree())
console.log('\nResumen')
console.log(`- Path raíz: ${OMM_CURRICULUM.root.title} (${OMM_CURRICULUM.root.publicationStatus})`)
Object.entries(curriculumCounts()).forEach(([label, value]) => console.log(`- ${label}: ${value}`))
