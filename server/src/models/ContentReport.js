// ---------------------------------------------------------------------------
// ContentReport — someone signed in reports a problem or a lesson as
// inappropriate («Reportar»: spam, offensive, personal data…). It goes to
// Moderación, like comment reports. Content corrections are not reports:
// they are suggestions (Flag, «Sugerir un cambio», Revisión).
// One OPEN report per person per page (partial unique index below).
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import { MODERATION_REASONS, REASON_NOTE_MAX } from '../lib/moderation.js'

export const CONTENT_REPORT_TARGETS = ['problem', 'theory']
export const CONTENT_REPORT_STATUSES = ['open', 'resolved', 'dismissed']

const contentReportSchema = new mongoose.Schema(
  {
    targetType: { type: String, enum: CONTENT_REPORT_TARGETS, required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, enum: MODERATION_REASONS, required: true },
    note: {
      type: String,
      trim: true,
      maxlength: REASON_NOTE_MAX,
      default: null,
      validate: {
        validator(value) { return !(this.reason === 'otro' && !value) },
        message: 'El motivo «otro» necesita una nota.',
      },
    },
    status: { type: String, enum: CONTENT_REPORT_STATUSES, default: 'open' },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    handledAt: { type: Date, default: null },
    handledNote: { type: String, trim: true, maxlength: 500, default: null },
  },
  { timestamps: true },
)

contentReportSchema.index({ status: 1, createdAt: 1 })
contentReportSchema.index({ targetType: 1, target: 1, reporter: 1 }, { unique: true, partialFilterExpression: { status: 'open' }, name: 'one_open_content_report_per_person' })

export default mongoose.model('ContentReport', contentReportSchema)
