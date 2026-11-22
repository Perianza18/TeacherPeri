// UserBadge: a badge someone earned (see lib/badges.js). Badges are never
// removed, even if the count behind them goes down later.
import mongoose from 'mongoose'
import { BADGE_IDS } from '../lib/badgeRules.js'

const userBadgeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    badge: { type: String, enum: BADGE_IDS, required: true },
    earnedAt: { type: Date, required: true },
  },
  { timestamps: true },
)

userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true })

export default mongoose.model('UserBadge', userBadgeSchema)
