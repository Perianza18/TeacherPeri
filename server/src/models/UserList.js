// UserList: a personal list in Mi Espacio («Guardar en lista»). Private by
// default; only its owner sees a private list. TeacherPeri's curated lists
// are a different model (List).
import mongoose from 'mongoose'
import { LIST_NAME_MAX } from '../lib/profile.js'

const userListSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: LIST_NAME_MAX },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true },
)

userListSchema.index({ owner: 1, createdAt: -1 })

export default mongoose.model('UserList', userListSchema)
