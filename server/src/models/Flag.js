// ---------------------------------------------------------------------------
// Flag — someone signed in reports an error in a problem or a theory page
// («Reportar un error»), with a message describing it. Editors and admins see
// every flag (GET /api/flags); the review script lists and closes them.
// One OPEN flag per person per page (partial unique index below).
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

export const FLAG_TARGETS = ['problem', 'theory']
export const FLAG_STATUSES = ['open', 'resolved', 'dismissed']
export const FLAG_MESSAGE_MIN = 10
export const FLAG_MESSAGE_MAX = 1000

const flagSchema = new mongoose.Schema(
  {
    targetType: { type: String, enum: FLAG_TARGETS, required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true, minlength: FLAG_MESSAGE_MIN, maxlength: FLAG_MESSAGE_MAX },
    status: { type: String, enum: FLAG_STATUSES, default: 'open' },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    handledAt: { type: Date, default: null },
    handledNote: { type: String, trim: true, maxlength: 500, default: null },
  },
  { timestamps: true },
)

flagSchema.index({ status: 1, createdAt: 1 })
flagSchema.index({ targetType: 1, target: 1 })
flagSchema.index({ targetType: 1, target: 1, reporter: 1 }, { unique: true, partialFilterExpression: { status: 'open' }, name: 'one_open_flag_per_person' })

export default mongoose.model('Flag', flagSchema)
