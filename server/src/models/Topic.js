import mongoose from 'mongoose'
import { normalizeSlug } from './content.js'

// Temas: las cuatro áreas grandes (raíces) y sus subtemas (Combinatoria ›
// Principio de casillas). Cualquier persona con sesión puede proponer un
// subtema nuevo, que queda «en revisión» hasta que un editor lo aprueba,
// lo renombra, lo une con un tema que ya existía o lo rechaza (igual que las
// carpetas de examen). Un documento sin reviewStatus cuenta como aprobado.
export const TOPIC_REVIEW_STATUSES = ['approved', 'pending', 'rejected']
export const TOPIC_NAME_MAX = 60

export function publicTopicQuery() {
  return { reviewStatus: { $nin: ['pending', 'rejected'] } }
}

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, immutable: true, trim: true, lowercase: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
    // Otros nombres con los que la gente busca el tema («palomar» para
    // «Principio de casillas»). Los comunes viven en data/topicAliases.js;
    // aquí quedan los que agrega la revisión (al unir un tema propuesto).
    aliases: { type: [String], default: undefined },
    reviewStatus: { type: String, enum: TOPIC_REVIEW_STATUSES, default: 'approved' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewReason: { type: String, trim: true, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

topicSchema.pre('validate', async function normalizeAndPreventCycles() {
  if (!this.slug) this.slug = normalizeSlug(this.name)
  if (!this.parent) return
  if (this._id.equals(this.parent)) this.invalidate('parent', 'A topic cannot be its own parent.')

  const visited = new Set([this._id.toString()])
  let parentId = this.parent
  while (parentId) {
    const key = parentId.toString()
    if (visited.has(key)) {
      this.invalidate('parent', 'A topic hierarchy cannot contain a cycle.')
      return
    }
    visited.add(key)
    const parent = await this.constructor.findById(parentId).select('parent').lean()
    if (!parent) {
      this.invalidate('parent', 'A topic parent must exist.')
      return
    }
    parentId = parent?.parent || null
  }
})

export default mongoose.model('Topic', topicSchema)
