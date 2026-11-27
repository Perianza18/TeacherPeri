// ---------------------------------------------------------------------------
// ContentRevision — the history in «Cambios de editores» (/panel/cambios).
//
// kind 'edit': a change an editor or admin makes directly to a problem or a
// lesson from the site (/panel/problemas/:id/editar, /panel/teoria/:id/editar),
// with the value before and after each field (server/src/lib/contentEdits.js).
//
// kind 'review': a decision taken in Revisión, on the site or with
// `npm run review`: approving or rejecting a proposal or an exam folder,
// renaming a folder, or closing a suggestion (server/src/lib/activity.js).
// It stores the action, a readable summary and the note or reason.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

export const REVISION_TARGETS = ['problem', 'theory', 'folder', 'topic']
export const REVISION_KINDS = ['edit', 'review']
export const REVIEW_ACTIONS = ['approved', 'rejected', 'renamed', 'applied', 'dismissed', 'merged']

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
    kind: { type: String, enum: REVISION_KINDS, default: 'edit' },
    targetType: { type: String, enum: REVISION_TARGETS, required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetLabel: { type: String, required: true, trim: true },
    editor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    editorRole: { type: String, required: true },
    changes: { type: [changeSchema], default: [] },
    // Only for kind 'review'.
    action: { type: String, enum: REVIEW_ACTIONS, default: null },
    summary: { type: String, trim: true, maxlength: 2000, default: null },
    note: { type: String, trim: true, maxlength: 1000, default: null },
  },
  { timestamps: true },
)

revisionSchema.index({ createdAt: -1 })
revisionSchema.index({ targetType: 1, target: 1, createdAt: -1 })

export default mongoose.model('ContentRevision', revisionSchema)
