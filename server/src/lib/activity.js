// ---------------------------------------------------------------------------
// Records decisions taken in Revisión (approve, reject, rename, close a
// suggestion) in «Cambios de editores». Every decision is recorded, whoever
// takes it. When the person is an editor, every admin also gets a notification
// with a link to the entry, like editor edits (server/src/lib/contentEdits.js).
// ---------------------------------------------------------------------------

import ContentRevision from '../models/ContentRevision.js'
import Notification from '../models/Notification.js'
import User from '../models/User.js'
import { roleOf } from './permissions.js'

const VERBS = {
  approved: 'aprobó',
  rejected: 'rechazó',
  renamed: 'renombró',
  applied: 'marcó como aplicada',
  dismissed: 'descartó',
  merged: 'unió',
}

export async function recordReview({ targetType, target, targetLabel, reviewer, action, summary, note = null }) {
  const role = roleOf(reviewer)
  const revision = await ContentRevision.create({
    kind: 'review',
    targetType,
    target,
    targetLabel: targetLabel.slice(0, 300),
    editor: reviewer._id,
    editorRole: role,
    action,
    summary: summary.slice(0, 2000),
    note: note ? String(note).slice(0, 1000) : null,
  })
  if (role === 'editor') {
    const admins = await User.find({ role: { $in: ['admin', 'teacherperi'] } }).select('_id').lean()
    const message = `@${reviewer.username} ${VERBS[action]} ${summary}`.slice(0, 1200)
    if (admins.length) {
      await Notification.insertMany(admins.map((admin) => ({
        user: admin._id,
        type: 'editor-reviewed',
        problem: targetType === 'problem' ? target : null,
        revision: revision._id,
        link: `/panel/cambios/${revision._id}`,
        message,
      })))
    }
  }
  return revision
}
