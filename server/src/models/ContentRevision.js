// ---------------------------------------------------------------------------
// ContentRevision — one document per change an editor or admin makes directly
// to a problem or a lesson from the site (/panel/problemas/:id/editar,
// /panel/teoria/:id/editar). It records who changed what and when, with the
// value before and after each field, so admins can read the history and get
// notified (see server/src/lib/contentEdits.js).
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

export const REVISION_TARGETS = ['problem', 'theory']

const changeSchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    label: { type: String, required: true },
    // Readable values (text, names of áreas, folder path), not raw ids.
    before: { type: mongoose.Schema.Types.Mixed, default: null },
    after: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false },
)

const revisionSchema = new mongoose.Schema(
  {
    targetType: { type: String, enum: REVISION_TARGETS, required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetLabel: { type: String, required: true, trim: true },
    editor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    editorRole: { type: String, required: true },
    changes: { type: [changeSchema], default: [] },
  },
  { timestamps: true },
)

revisionSchema.index({ createdAt: -1 })
revisionSchema.index({ targetType: 1, target: 1, createdAt: -1 })

export default mongoose.model('ContentRevision', revisionSchema)
