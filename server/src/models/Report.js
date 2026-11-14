// ---------------------------------------------------------------------------
// Report model — one document per person who reports a comment. A person can
// report the same comment only once (unique index below). Reports stay after
// they are handled, with who handled them and when, for moderation history.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import { MODERATION_REASONS, REASON_NOTE_MAX } from '../lib/moderation.js'

const reportSchema = new mongoose.Schema(
  {
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
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

    // open: pendiente · resolved: el comentario se eliminó · dismissed: se descartó
    status: { type: String, enum: ['open', 'resolved', 'dismissed'], default: 'open' },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    handledAt: { type: Date, default: null },
  },
  { timestamps: true },
)

reportSchema.index({ comment: 1, reporter: 1 }, { unique: true })
reportSchema.index({ status: 1, createdAt: 1 })

export default mongoose.model('Report', reportSchema)
