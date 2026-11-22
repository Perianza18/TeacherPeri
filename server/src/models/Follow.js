// Follow: `follower` follows `followee` (Mi Espacio «Seguir»). One document
// per pair; nobody follows themselves.
import mongoose from 'mongoose'

const followSchema = new mongoose.Schema(
  {
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      validate: { validator(value) { return String(value) !== String(this.follower) }, message: 'No puedes seguirte a ti.' },
    },
  },
  { timestamps: true },
)

followSchema.index({ follower: 1, followee: 1 }, { unique: true })
followSchema.index({ followee: 1, createdAt: -1 })
followSchema.index({ follower: 1, createdAt: -1 })

export default mongoose.model('Follow', followSchema)
