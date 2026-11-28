// Mi Espacio (profiles)
//
// GET    /api/profiles?q=                     public search: username prefix (2+ chars), 20 max, public fields only
// GET    /api/profiles/:username              public; `email` only for the owner
// PUT    /api/profiles/me                     signed in: { avatar, avatarColor, bio, frame } (an avatar they own, a frame they reached)
// POST   /api/profiles/me/avatars/:id         signed in: buy a premium avatar with points
// GET    /api/profiles/:username/followers    public, 50 per page (?page=)
// GET    /api/profiles/:username/following    public, 50 per page
// PUT    /api/profiles/:username/follow       signed in, not yourself
// DELETE /api/profiles/:username/follow       signed in
// GET    /api/profiles/:username/comments     public, 20 per page
// GET    /api/profiles/:username/activity     owner only (404 for anyone else)
// GET    /api/profiles/:username/solved       owner only (404 for anyone else)
// GET    /api/profiles/:username/lists        public lists; the owner also gets private ones
// GET    /api/profiles/:username/badges       public: { earned, locked, level }
//
// Privacy is fixed: activity, solved problems, «Mis envíos», private lists and the email are
// only for the owner. They are filtered here, in the query, never sent and
// hidden in the page.

import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import Comment from '../models/Comment.js'
import Flag from '../models/Flag.js'
import Follow from '../models/Follow.js'
import Problem from '../models/Problem.js'
import ProblemSolve from '../models/ProblemSolve.js'
import SolutionProposal from '../models/SolutionProposal.js'
import User from '../models/User.js'
import UserList from '../models/UserList.js'
import UserListItem from '../models/UserListItem.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { requireAuth } from '../middleware/auth.js'
import { optionalAuth } from '../middleware/optionalAuth.js'
import { roleOf } from '../lib/permissions.js'
import { AVATAR_COLORS, AVATAR_PRICES, CHOOSABLE_AVATAR_IDS, avatarColorOf, avatarOf, isOwner, ownedAvatars, ownsAvatar, parseBio, pointBalance } from '../lib/profile.js'
import { awardBadges, publicCommentFilter } from '../lib/badges.js'
import { FRAME_IDS, frameOf, isUnlocked } from '../lib/levels.js'
import { contentNames, problemHref } from '../lib/profileContent.js'
import { ownSubmissionViews } from '../lib/submissions.js'
import { listSummaries } from './userLists.routes.js'

const router = Router()
const FOLLOW_PAGE = 50
const COMMENT_PAGE = 20
const ACTIVITY_LIMIT = 30

export const SEARCH_MIN = 2
export const SEARCH_MAX = 30
export const SEARCH_LIMIT = 20

const page = (value) => Math.max(1, Math.min(1000, Number.parseInt(value, 10) || 1))
export const personView = (user) => ({ username: user.username, avatar: avatarOf(user), avatarColor: avatarColorOf(user), frame: frameOf(user), role: roleOf(user) })
// The User fields personView needs.
export const PERSON_FIELDS = 'username role avatar avatarColor points frame unlockedAvatars'

// «Buscar usuarios» has its own budget per IP on top of the general /api one.
export const searchLimiter = ({ max = 60, windowMs = 60 * 1000 } = {}) => rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas búsquedas. Espera un momento e intenta de nuevo.' },
})

// A username prefix: a leading «@» is ignored; regex characters are escaped.
export function parseUserQuery(value) {
  const text = typeof value === 'string' ? value.trim().replace(/^@/, '') : ''
  if (text.length < SEARCH_MIN) return { error: `Escribe al menos ${SEARCH_MIN} caracteres.` }
  if (text.length > SEARCH_MAX) return { error: `Escribe hasta ${SEARCH_MAX} caracteres.` }
  return { value: text, pattern: new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') }
}

router.get('/', searchLimiter(), async (req, res) => {
  const query = parseUserQuery(req.query.q)
  if (query.error) return res.status(400).json({ error: query.error })
  const users = await User.find({ username: query.pattern }).sort({ username: 1 }).limit(SEARCH_LIMIT).select(PERSON_FIELDS).lean()
  res.json({ items: users.map(personView) })
})

async function findProfile(req, res) {
  const username = typeof req.params.username === 'string' ? req.params.username : ''
  const user = username ? await User.findOne({ username }).select('username email role bio avatar avatarColor points frame unlockedAvatars createdAt').lean() : null
  if (!user) res.status(404).json({ error: 'Ese perfil no existe.' })
  return user
}

async function followCounts(userId) {
  const [followers, following] = await Promise.all([Follow.countDocuments({ followee: userId }), Follow.countDocuments({ follower: userId })])
  return { followers, following }
}

router.put('/me', requireAuth, async (req, res) => {
  const update = {}
  if ('avatar' in req.body) {
    if (!CHOOSABLE_AVATAR_IDS.includes(req.body.avatar)) return res.status(400).json({ error: 'Elige uno de los avatares.' })
    const me = await User.findById(req.userId).select('role unlockedAvatars').lean()
    if (!ownsAvatar(me, req.body.avatar)) return res.status(403).json({ error: 'Primero desbloquea ese avatar con tus puntos.' })
    update.avatar = req.body.avatar
  }
  if ('avatarColor' in req.body) {
    if (req.body.avatarColor !== null && !AVATAR_COLORS.includes(req.body.avatarColor)) return res.status(400).json({ error: 'Elige uno de los colores.' })
    update.avatarColor = req.body.avatarColor
  }
  if ('frame' in req.body) {
    const { frame } = req.body
    if (frame !== null && !FRAME_IDS.includes(frame)) return res.status(400).json({ error: 'Elige uno de los marcos.' })
    if (frame !== null) {
      const me = await User.findById(req.userId).select('points').lean()
      if (!isUnlocked(frame, me?.points)) return res.status(403).json({ error: 'Todavía no desbloqueas ese marco.' })
    }
    update.frame = frame
  }
  if ('bio' in req.body) {
    const bio = parseBio(req.body.bio)
    if (bio.error) return res.status(400).json({ error: bio.error })
    update.bio = bio.value
  }
  const user = await User.findByIdAndUpdate(req.userId, update, { new: true, runValidators: true }).select(`${PERSON_FIELDS} bio`).lean()
  res.json({ ...personView(user), bio: user.bio ?? '' })
})

// Buy a premium avatar: its price comes off the balance (points earned minus
// points spent). The update only applies if the list did not change since it
// was read, so two clicks at once cannot spend the same points twice.
router.post('/me/avatars/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const price = AVATAR_PRICES[id]
  if (!price) return res.status(404).json({ error: 'Ese avatar no se vende.' })
  const me = await User.findById(req.userId).select('points unlockedAvatars role').lean()
  if (!me) return res.status(401).json({ error: 'Inicia sesión de nuevo.' })
  // Recount first, so points from something just accepted are there.
  const { level } = await awardBadges(me)
  if (ownsAvatar(me, id)) return res.json({ unlockedAvatars: ownedAvatars(me), balance: level.balance })
  const owned = me.unlockedAvatars ?? []
  if (level.balance < price) return res.status(403).json({ error: `Te faltan ${price - level.balance} puntos para este avatar.` })
  const result = await User.updateOne({ _id: me._id, unlockedAvatars: owned }, { $push: { unlockedAvatars: id } })
  if (!result.modifiedCount) return res.status(409).json({ error: 'Tus avatares cambiaron. Recarga e intenta de nuevo.' })
  const unlockedAvatars = [...owned, id]
  res.json({ unlockedAvatars, balance: pointBalance(level.points, unlockedAvatars) })
})

router.get('/:username', optionalAuth, async (req, res) => {
  const user = await findProfile(req, res)
  if (!user) return
  const owner = isOwner(req.userId, user)
  const [counts, badges, commentFilter, proposed, isFollowing] = await Promise.all([
    followCounts(user._id),
    awardBadges(user),
    publicCommentFilter(user._id),
    Problem.countDocuments({ author: user._id, ...publishedOrLegacyProblemQuery() }),
    req.userId && !owner ? Follow.exists({ follower: req.userId, followee: user._id }) : null,
  ])
  const comments = await Comment.countDocuments(commentFilter)
  res.json({
    ...personView({ ...user, points: badges.level.points }),
    bio: user.bio ?? '',
    joinedAt: user.createdAt,
    ...counts,
    stats: { solved: badges.counts.solved, comments, proposed, solutions: badges.counts.solutions, badges: badges.earned.length },
    level: badges.level,
    ...(owner ? { unlockedAvatars: ownedAvatars(user) } : {}),
    isOwner: owner,
    isFollowing: Boolean(isFollowing),
    ...(owner ? { email: user.email } : {}),
  })
})

async function followList(req, res, field, other) {
  const user = await findProfile(req, res)
  if (!user) return
  const current = page(req.query.page)
  const filter = { [field]: user._id }
  const [total, rows] = await Promise.all([
    Follow.countDocuments(filter),
    Follow.find(filter).sort({ createdAt: -1 }).skip((current - 1) * FOLLOW_PAGE).limit(FOLLOW_PAGE).populate(other, PERSON_FIELDS).lean(),
  ])
  res.json({ total, page: current, pageSize: FOLLOW_PAGE, items: rows.filter((row) => row[other]).map((row) => personView(row[other])) })
}

router.get('/:username/followers', (req, res) => followList(req, res, 'followee', 'follower'))
router.get('/:username/following', (req, res) => followList(req, res, 'follower', 'followee'))

router.put('/:username/follow', requireAuth, async (req, res) => {
  const user = await findProfile(req, res)
  if (!user) return
  if (String(user._id) === req.userId) return res.status(400).json({ error: 'No puedes seguirte a ti.' })
  await Follow.updateOne({ follower: req.userId, followee: user._id }, { $setOnInsert: { follower: req.userId, followee: user._id } }, { upsert: true })
  res.json({ ...(await followCounts(user._id)), isFollowing: true })
})

router.delete('/:username/follow', requireAuth, async (req, res) => {
  const user = await findProfile(req, res)
  if (!user) return
  await Follow.deleteOne({ follower: req.userId, followee: user._id })
  res.json({ ...(await followCounts(user._id)), isFollowing: false })
})

router.get('/:username/comments', async (req, res) => {
  const user = await findProfile(req, res)
  if (!user) return
  const current = page(req.query.page)
  const filter = await publicCommentFilter(user._id)
  const [total, comments] = await Promise.all([
    Comment.countDocuments(filter),
    Comment.find(filter).sort({ createdAt: -1 }).skip((current - 1) * COMMENT_PAGE).limit(COMMENT_PAGE).select('problem body createdAt').lean(),
  ])
  const names = await contentNames({ problemIds: comments.map((c) => c.problem) })
  res.json({
    total,
    page: current,
    pageSize: COMMENT_PAGE,
    items: comments.map((comment) => {
      const problem = names.problems.get(String(comment.problem))
      return { id: comment._id, body: comment.body, createdAt: comment.createdAt, target: { label: problem?.label ?? 'Problema', href: `${problemHref(comment.problem)}#comentario-${comment._id}` } }
    }),
  })
})

const FLAG_STATES = { open: 'pending', resolved: 'applied', dismissed: 'dismissed' }
const SOLUTION_STATES = { pending: 'pending', approved: 'accepted', rejected: 'rejected' }
const SUBMISSION_STATES = { pending: 'pending', 'published-pending': 'pending', rejected: 'rejected', 'published-rejected': 'rejected', published: 'accepted' }

router.get('/:username/activity', optionalAuth, async (req, res) => {
  const user = await findProfile(req, res)
  if (!user) return
  // Same answer as an unknown profile, so nobody learns more than the public page shows.
  if (!isOwner(req.userId, user)) return res.status(404).json({ error: 'Ese perfil no existe.' })
  const limit = ACTIVITY_LIMIT
  const [comments, submissions, flags, saved, solves, follows, solutions] = await Promise.all([
    Comment.find({ author: user._id, status: 'visible' }).sort({ createdAt: -1 }).limit(limit).select('problem createdAt').lean(),
    ownSubmissionViews(user._id),
    Flag.find({ reporter: user._id }).sort({ createdAt: -1 }).limit(limit).select('targetType target status createdAt').lean(),
    UserListItem.find({ owner: user._id }).sort({ createdAt: -1 }).limit(limit).populate('list', 'name').lean(),
    ProblemSolve.find({ user: user._id }).sort({ createdAt: -1 }).limit(limit).select('problem createdAt').lean(),
    Follow.find({ follower: user._id }).sort({ createdAt: -1 }).limit(limit).populate('followee', 'username').lean(),
    SolutionProposal.find({ author: user._id, status: { $ne: 'withdrawn' } }).sort({ createdAt: -1 }).limit(limit).select('problem status createdAt').lean(),
  ])
  const problemIds = [
    ...comments.map((c) => c.problem), ...solves.map((s) => s.problem), ...solutions.map((s) => s.problem),
    ...flags.filter((f) => f.targetType === 'problem').map((f) => f.target),
    ...saved.filter((s) => s.itemType === 'problem').map((s) => s.item),
  ]
  const theoryIds = [...flags.filter((f) => f.targetType === 'theory').map((f) => f.target), ...saved.filter((s) => s.itemType === 'theory').map((s) => s.item)]
  const names = await contentNames({ problemIds, theoryIds })
  const nameOf = (type, id) => (type === 'problem' ? names.problems : names.theory).get(String(id))
  const events = []
  for (const c of comments) {
    const problem = nameOf('problem', c.problem)
    if (problem) events.push({ kind: 'comment', at: c.createdAt, target: { label: problem.label, href: `${problem.href}#comentario-${c._id}` } })
  }
  for (const s of submissions) {
    const label = s.examFolderPath.length > 1 ? `${s.examFolderPath.slice(1).join(' › ')}${s.proposal.problemNumber ? `, problema ${s.proposal.problemNumber}` : ''}` : (s.titulo || s.codigo)
    events.push({ kind: 'proposal', at: s.createdAt, target: { label, href: `/mis-envios/${s._id}` }, status: SUBMISSION_STATES[s.state] ?? 'pending' })
  }
  for (const s of solutions) {
    const problem = nameOf('problem', s.problem)
    if (problem) events.push({ kind: 'solution', at: s.createdAt, target: { label: problem.label, href: problem.href }, status: SOLUTION_STATES[s.status] })
  }
  for (const f of flags) {
    const target = nameOf(f.targetType, f.target)
    if (target) events.push({ kind: 'suggestion', at: f.createdAt, target: { label: target.label, href: target.href }, status: FLAG_STATES[f.status] })
  }
  for (const s of saved) {
    const target = nameOf(s.itemType, s.item)
    if (target && s.list) events.push({ kind: 'saved', at: s.createdAt, target: { label: target.label, href: target.href }, list: { name: s.list.name, href: `/perfil/${encodeURIComponent(user.username)}/colecciones/${s.list._id}` } })
  }
  for (const s of solves) {
    const problem = nameOf('problem', s.problem)
    if (problem) events.push({ kind: 'solved', at: s.createdAt, target: { label: problem.label, href: problem.href } })
  }
  for (const f of follows) {
    if (f.followee) events.push({ kind: 'follow', at: f.createdAt, target: { label: `@${f.followee.username}`, href: `/perfil/${encodeURIComponent(f.followee.username)}` } })
  }
  events.sort((a, b) => new Date(b.at) - new Date(a.at))
  res.json({ items: events.slice(0, limit) })
})

// «Problemas resueltos» from «En números»: only published problems, the same
// ones the count includes, newest first. Owner only.
router.get('/:username/solved', optionalAuth, async (req, res) => {
  const user = await findProfile(req, res)
  if (!user) return
  if (!isOwner(req.userId, user)) return res.status(404).json({ error: 'Ese perfil no existe.' })
  const solves = await ProblemSolve.find({ user: user._id }).sort({ createdAt: -1 }).select('problem createdAt').lean()
  const problems = solves.length
    ? await Problem.find({ _id: { $in: solves.map((s) => s.problem) }, ...publishedOrLegacyProblemQuery() }).select('enunciado tema').lean()
    : []
  const byId = new Map(problems.map((p) => [String(p._id), p]))
  const items = solves.filter((s) => byId.has(String(s.problem))).map((s) => {
    const problem = byId.get(String(s.problem))
    return { id: problem._id, preview: problem.enunciado, area: problem.tema ?? null, solvedAt: s.createdAt, href: problemHref(problem._id) }
  })
  res.json({ items })
})

router.get('/:username/lists', optionalAuth, async (req, res) => {
  const user = await findProfile(req, res)
  if (!user) return
  const owner = isOwner(req.userId, user)
  const lists = await UserList.find({ owner: user._id, ...(owner ? {} : { isPublic: true }) }).sort({ createdAt: -1 }).lean()
  res.json({ isOwner: owner, items: await listSummaries(lists, user) })
})

router.get('/:username/badges', async (req, res) => {
  const user = await findProfile(req, res)
  if (!user) return
  const { view, level } = await awardBadges(user)
  res.json({ ...view, level })
})

export default router
