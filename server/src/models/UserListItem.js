// One saved item (a problem or a lesson) in a personal list. It points at the
// content; it never copies it.
import mongoose from 'mongoose'
import { LIST_ITEM_TYPES } from '../lib/profile.js'

const userListItemSchema = new mongoose.Schema(
  {
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'UserList', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: LIST_ITEM_TYPES, required: true },
    item: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
)

userListItemSchema.index({ list: 1, itemType: 1, item: 1 }, { unique: true })
userListItemSchema.index({ list: 1, createdAt: -1 })
userListItemSchema.index({ owner: 1, createdAt: -1 })

export default mongoose.model('UserListItem', userListItemSchema)
