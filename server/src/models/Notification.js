// ---------------------------------------------------------------------------
// Notification — an in-site message for one account, shown in the avatar menu.
// The author hears when a submission or a proposed solution is approved or rejected; admins hear
// when an editor changes a problem or a lesson (`content-edited`, with a link
// to the change in /panel/cambios) and when an editor approves, rejects or
// closes something in Revisión (`editor-reviewed`, same link).
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

export const NOTIFICATION_TYPES = ['submission-approved', 'submission-rejected', 'solution-approved', 'solution-rejected', 'content-edited', 'editor-reviewed']

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', default: null },
    // Where the notification leads on the site (a path such as /panel/cambios/<id>).
    link: { type: String, trim: true, maxlength: 300, default: null },
    revision: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentRevision', default: null },
    message: { type: String, required: true, trim: true, maxlength: 1200 },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
)

notificationSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)
