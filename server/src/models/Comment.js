// ---------------------------------------------------------------------------
// Comment model — one document per comment/reply on a Problem.
//
// Replies nest through a self-referencing `parent` (the same trick Category
// uses for folders), up to MAX_COMMENT_DEPTH levels below a top-level comment;
// deeper replies stay at the last level. `root` points at the thread's
// top-level comment so a whole thread can be grouped without walking parents.
//
// Deleting is a SOFT delete: the document stays (with who, when and why) and
// the API hides its text, so moderation history is never erased. Comments
// saved before these fields existed read as visible, top-level comments.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import { MAX_COMMENT_DEPTH, MODERATION_REASONS, REASON_NOTE_MAX } from '../lib/moderation.js'

const commentSchema = new mongoose.Schema(
  {
    // Qué problema está comentando.
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },

    // Quién lo escribió. Es un ObjectId, no un nombre de texto — así, si
    // alguien cambia su username después, sus comentarios viejos siguen
    // apuntando a la cuenta correcta en vez de quedar con un nombre viejo.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'El comentario no puede pasar de 2000 caracteres.'],
    },

    // A qué comentario responde (null = comentario de primer nivel).
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      validate: {
        validator(value) { return (this.depth > 0) === Boolean(value) },
        message: 'Una respuesta necesita parent y profundidad mayor a 0.',
      },
    },

    // El comentario de primer nivel de este hilo (null si este ES el primero).
    root: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      validate: {
        validator(value) { return Boolean(this.parent) === Boolean(value) },
        message: 'Una respuesta necesita el comentario raíz de su hilo.',
      },
    },

    // 0 = primer nivel; cada respuesta suma 1, sin pasar de MAX_COMMENT_DEPTH.
    depth: {
      type: Number,
      default: 0,
      min: 0,
      max: MAX_COMMENT_DEPTH,
      validate: { validator: Number.isInteger, message: 'La profundidad debe ser un número entero.' },
    },

    status: { type: String, enum: ['visible', 'deleted'], default: 'visible' },

    // Solo para comentarios eliminados: quién (y en qué papel), cuándo y por qué.
    deletedAs: {
      type: String,
      enum: ['autor', 'moderacion', null],
      default: null,
      validate: {
        validator(value) { return this.status !== 'deleted' || Boolean(value && this.deletedBy && this.deletedAt) },
        message: 'Falta quién y cuándo eliminó el comentario.',
      },
    },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    deletedReason: {
      type: String,
      enum: [...MODERATION_REASONS, null],
      default: null,
      validate: {
        validator(value) { return !(this.status === 'deleted' && this.deletedAs === 'moderacion' && !value) },
        message: 'La moderación necesita un motivo.',
      },
    },
    deletedReasonNote: {
      type: String,
      trim: true,
      maxlength: REASON_NOTE_MAX,
      default: null,
      validate: {
        validator(value) { return !(this.deletedReason === 'otro' && !value) },
        message: 'El motivo «otro» necesita una nota.',
      },
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }, // createdAt es lo que se usa para ordenar los comentarios
)

export default mongoose.model('Comment', commentSchema)
