// Reads what a person has done, stores any badge they have reached
// (UserBadge) and their points (User.points), and returns the Insignias view. Called when a profile or its
// badges are read, so old activity is picked up with the right dates and no
// migration is needed. Stored badges are never deleted.
import Comment from '../models/Comment.js'
import Flag from '../models/Flag.js'
import Problem from '../models/Problem.js'
import ProblemSolve from '../models/ProblemSolve.js'
import ProblemSubmission from '../models/ProblemSubmission.js'
import SolutionProposal from '../models/SolutionProposal.js'
import User from '../models/User.js'
import UserBadge from '../models/UserBadge.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { roleOf } from './permissions.js'
import { badgeView, dueBadges } from './badgeRules.js'
import { levelView, pointsFrom } from './levels.js'
import { pointBalance } from './profile.js'

async function publishedIds(ids) {
  if (!ids.length) return new Set()
  const rows = await Problem.find({ _id: { $in: ids }, ...publishedOrLegacyProblemQuery() }).select('_id').lean()
  return new Set(rows.map((row) => String(row._id)))
}

// Visible comments on public problems (the ones a profile shows), oldest first.
export async function publicCommentFilter(userId) {
  const problems = await Comment.distinct('problem', { author: userId, status: 'visible' })
  const visible = await publishedIds(problems)
  return { author: userId, status: 'visible', problem: { $in: [...visible] } }
}

// One date per counted item, oldest first.
export async function activityDates(userId) {
  const [solves, comments, accepted, solutions, applied] = await Promise.all([
    ProblemSolve.find({ user: userId }).sort({ createdAt: 1 }).select('problem createdAt').lean(),
    publicCommentFilter(userId).then((filter) => Comment.find(filter).sort({ createdAt: 1 }).select('createdAt').lean()),
    ProblemSubmission.find({ author: userId, kind: 'create', status: 'approved' }).sort({ reviewedAt: 1 }).select('reviewedAt updatedAt').lean(),
    SolutionProposal.find({ author: userId, status: 'approved' }).sort({ reviewedAt: 1 }).select('reviewedAt updatedAt').lean(),
    Flag.find({ reporter: userId, status: 'resolved' }).sort({ handledAt: 1 }).select('handledAt updatedAt').lean(),
  ])
  const live = await publishedIds(solves.map((s) => s.problem))
  return {
    solved: solves.filter((s) => live.has(String(s.problem))).map((s) => s.createdAt),
    comments: comments.map((c) => c.createdAt),
    contributions: accepted.map((s) => s.reviewedAt ?? s.updatedAt),
    solutions: solutions.map((s) => s.reviewedAt ?? s.updatedAt),
    suggestions: applied.map((f) => f.handledAt ?? f.updatedAt),
  }
}

export async function awardBadges(user) {
  const dates = await activityDates(user._id)
  const due = dueBadges(dates, roleOf(user))
  if (due.length) {
    await UserBadge.bulkWrite(due.map(({ badge, earnedAt }) => ({
      updateOne: { filter: { user: user._id, badge }, update: { $setOnInsert: { user: user._id, badge, earnedAt } }, upsert: true },
    })), { ordered: false })
  }
  const earned = await UserBadge.find({ user: user._id }).lean()
  const counts = Object.fromEntries(Object.entries(dates).map(([key, list]) => [key, list.length]))
  // Points only come from what the team accepted (lib/levels.js); keep the
  // stored total current so comments and lists can show the frame cheaply.
  const points = pointsFrom(counts)
  await User.updateOne({ _id: user._id, points: { $ne: points } }, { $set: { points } })
  const unlocked = user.unlockedAvatars ?? (await User.findById(user._id).select('unlockedAvatars').lean())?.unlockedAvatars ?? []
  return { counts, earned, view: badgeView(earned, counts), level: levelView(points, pointBalance(points, unlocked)) }
}
