// ---------------------------------------------------------------------------
// Notification — an in-site message for one account, shown in the avatar menu.
// Today: the author hears when a submission is approved or rejected. Later the
// admin will also hear when an editor changes something.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

export const NOTIFICATION_TYPES = ['submission-approved', 'submission-rejected']

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', default: null },
    message: { type: String, required: true, trim: true, maxlength: 1200 },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
)

notificationSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)
