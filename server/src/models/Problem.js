// ---------------------------------------------------------------------------
// Problem model — one document per problem, replacing the hardcoded
// PROBLEMAS array that used to live directly inside Problemas.jsx.
//
// The fields below are deliberately the SAME fields that array already had
// (id, titulo, año, tema, tipo, dificultad, exito, enunciado) — nothing new
// was invented, this is just that same shape moved into the database, plus
// one new field (`category`) linking each problem to its folder.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import { COMPETITIONS, ROUNDS, SCHOOL_STAGES } from './trainingContext.js'
import { PUBLICATION_STATUSES, publicationFields } from './content.js'

const problemSchema = new mongoose.Schema(
  {
    // Antes cada problema tenía un "id" como 'P-001' escrito a mano en el
    // array. Lo conservamos como código legible (Mongo también le da a cada
    // documento un _id propio automáticamente, pero ese es un identificador
    // técnico feo para mostrar en pantalla).
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    titulo: { type: String, trim: true },

    // El enunciado del problema. Puede incluir LaTeX (ej. "$x^2 + 1$") que
    // el frontend renderiza con KaTeX — el texto en sí se guarda tal cual,
    // como string normal.
    enunciado: { type: String, required: true },

    // A qué carpeta (Category) pertenece este problema.
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    // `category` is preserved for legacy records and existing comment/UI
    // behavior. `categories` is the reusable many-to-many folder placement
    // used by new library navigation; the backfill copies legacy values.
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],

    trainingContexts: [{
      _id: false,
      contest: { type: String, enum: COMPETITIONS, required: true },
      stage: { type: String, enum: ROUNDS, required: true },
      schoolStage: { type: String, enum: SCHOOL_STAGES, required: true },
      grade: { type: Number, min: 1, max: 6, validate: Number.isInteger },
      challenge: { type: Number, min: 1, max: 6, required: true, validate: Number.isInteger },
      rationale: { type: String, required: true, trim: true },
    }],
    hint: { type: String },
    solution: { type: String },
    sourceAttribution: { type: String, trim: true },
    competition: { type: String, trim: true },
    round: { type: String, trim: true },
    problemNumber: { type: Number, min: 1 },
    // Canonical TeacherPeri field for new content. The accented Spanish
    // values below are legacy compatibility data only.
    difficulty: { type: String, enum: ['basico', 'intermedio', 'avanzado'] },

    // Estos tres siguen siendo campos sueltos (no carpetas) porque en la UI
    // actual son filtros independientes que se combinan entre sí (un
    // problema puede ser Año=2024 Y Tema=Álgebra Y Tipo=Interno al mismo
    // tiempo) — no son una jerarquía de carpetas como Category.
    año: { type: String, required: true },
    tema: { type: String, required: true },
    tipo: { type: String, required: true },

    dificultad: {
      type: String,
      enum: ['Fácil', 'Media', 'Difícil'], // solo permite estos 3 valores exactos
      required: true,
    },

    // Porcentaje de gente que lo resuelve correctamente.
    exito: { type: Number, default: 0, min: 0, max: 100 },

    ...publicationFields,
    // Existing Problem creation paths predate the official-content workflow.
    // Preserve their public behavior while all explicit lifecycle values still
    // control public visibility for new TeacherPeri records.
    publicationStatus: {
      type: String,
      enum: PUBLICATION_STATUSES,
      default: 'published',
      index: true,
    },
  },
  { timestamps: true },
)

problemSchema.path('categories').validate((categories) => {
  const ids = categories.map(String)
  return ids.length === new Set(ids).size
}, 'A Problem cannot contain duplicate category memberships.')

problemSchema.path('trainingContexts').validate((contexts) => {
  const keys = contexts.map((c) => `${c.contest}:${c.stage}:${c.schoolStage}:${c.grade || '*'}`)
  return new Set(keys).size === keys.length && contexts.every((c) => !c.grade || c.grade <= (c.schoolStage === 'primaria' ? 6 : 3))
}, 'Context assessments must be unique and use a valid school grade.')

export default mongoose.model('Problem', problemSchema)
