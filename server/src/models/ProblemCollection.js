import mongoose from 'mongoose'
import { publicationFields } from './content.js'
import { orderedProblemSchema, validateOrderedProblems } from './problemReferences.js'

// The problems behind one box of a theory lesson. The lesson text says
// `[[collection:<slug>:<kind>]]`; the page looks up the collection with that
// slug and kind and shows its problems in order. Problems stay in the banco
// de problemas; a collection only points to them.
export const COLLECTION_KINDS = ['ejercicios', 'practice', 'dificiles']
export const COLLECTION_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const problemCollectionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, match: COLLECTION_SLUG },
    kind: { type: String, enum: COLLECTION_KINDS, required: true },
    problems: { type: [orderedProblemSchema], default: [] },
    ...publicationFields,
  },
  { timestamps: true },
)

problemCollectionSchema.index({ slug: 1, kind: 1 }, { unique: true })
problemCollectionSchema.pre('validate', validateOrderedProblems)

export default mongoose.model('ProblemCollection', problemCollectionSchema)
