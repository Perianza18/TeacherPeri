import mongoose from 'mongoose'
import Path from './Path.js'
import Step from './Step.js'
import PathSection from './PathSection.js'

const pathReferenceSchema = new mongoose.Schema(
  {
    parentPath: { type: mongoose.Schema.Types.ObjectId, ref: 'Path', required: true, index: true },
    childPath: { type: mongoose.Schema.Types.ObjectId, ref: 'Path', required: true, index: true },
    order: { type: Number, required: true, min: 1 },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'PathSection', default: null },
  },
  { timestamps: true },
)

pathReferenceSchema.index({ parentPath: 1, childPath: 1 }, { unique: true })
pathReferenceSchema.index({ parentPath: 1, order: 1 }, { unique: true })

pathReferenceSchema.pre('validate', async function validatePathReference() {
  if (!this.parentPath || !this.childPath) return
  if (this.parentPath.equals(this.childPath)) {
    this.invalidate('childPath', 'A Path cannot reference itself.')
    return
  }

  const [parent, child, existingEdge, existingOrder, step, section] = await Promise.all([
    Path.exists({ _id: this.parentPath }),
    Path.exists({ _id: this.childPath }),
    this.constructor.exists({
      _id: { $ne: this._id },
      parentPath: this.parentPath,
      childPath: this.childPath,
    }),
    this.constructor.exists({
      _id: { $ne: this._id },
      parentPath: this.parentPath,
      order: this.order,
    }),
    Step.exists({ path: this.parentPath }),
    this.section ? PathSection.exists({ _id: this.section, path: this.parentPath }) : null,
  ])

  if (!parent) this.invalidate('parentPath', 'A Path reference parent must exist.')
  if (!child) this.invalidate('childPath', 'A Path reference child must exist.')
  if (existingEdge) this.invalidate('childPath', 'A parent cannot reference the same child Path more than once.')
  if (existingOrder) this.invalidate('order', 'Child Path order positions must be unique within a parent Path.')
  if (step) this.invalidate('parentPath', 'A Path with Steps cannot reference child Paths.')
  if (this.section && !section) this.invalidate('section', 'A Path Reference section must belong to its parent Path.')
  if (!parent || !child) return

  const visited = new Set()
  let frontier = [this.childPath]
  while (frontier.length) {
    const ids = frontier.filter((id) => {
      const key = id.toString()
      if (visited.has(key)) return false
      visited.add(key)
      return true
    })
    if (!ids.length) break
    if (ids.some((id) => id.equals(this.parentPath))) {
      this.invalidate('childPath', 'A Path reference cannot create an indirect cycle.')
      return
    }
    const edges = await this.constructor
      .find({ parentPath: { $in: ids }, _id: { $ne: this._id } })
      .select('childPath')
      .lean()
    frontier = edges.map((edge) => edge.childPath)
  }
})

export default mongoose.model('PathReference', pathReferenceSchema)
