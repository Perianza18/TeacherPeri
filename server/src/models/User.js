// ---------------------------------------------------------------------------
// User model — one document per person who has created an account.
//
// SKELETON (the shape every Mongoose model in this project follows):
//
//   import mongoose from 'mongoose'
//
//   const algoSchema = new mongoose.Schema({
//     campo1: { type: String, required: true },   // <- blueprint for one field
//     campo2: { type: Number, default: 0 },
//   }, { timestamps: true })                        // <- adds createdAt/updatedAt automatically
//
//   export default mongoose.model('NombreDelModelo', algoSchema)
//
// Every model file in this folder (User, Category, Problem, Comment) is just
// this same pattern with different fields.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import { DEFAULT_ROLE, LEGACY_ROLES, ROLES } from '../lib/permissions.js'
import { AVATAR_COLORS, AVATAR_IDS, BIO_MAX } from '../lib/profile.js'

const userSchema = new mongoose.Schema(
  {
    // El nombre que se muestra junto a sus comentarios (ej. "elias23").
    username: {
      type: String,
      required: true,
      unique: true, // Mongo rechaza crear un segundo usuario con el mismo username.
      trim: true,
    },

    // Se usa para iniciar sesión. También debe ser único: no puede haber dos
    // cuentas con el mismo correo.
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // normaliza "Ana@Correo.com" -> "ana@correo.com" antes de guardar
    },

    // IMPORTANTE: nunca guardamos la contraseña real, solo su "hash" — el
    // resultado de pasarla por bcrypt, que no se puede revertir para
    // recuperar la contraseña original. Ver server/src/routes/auth.routes.js
    // para dónde se genera este valor.
    passwordHash: {
      type: String,
      required: true,
    },

    // Qué puede hacer esta persona en el sitio (ver server/src/lib/permissions.js).
    // Toda cuenta nueva empieza como `user`; el registro nunca acepta un rol
    // enviado por el navegador. Solo un script o un admin puede cambiarlo.
    // Los valores antiguos (`usuario`, `teacherperi`, …) se aceptan solo para
    // leer cuentas que aún no se migran; roleOf() los traduce.
    role: {
      type: String,
      enum: [...ROLES, ...Object.keys(LEGACY_ROLES)],
      default: DEFAULT_ROLE,
      required: true,
    },

    // Mi Espacio: una descripción corta (texto simple) y un avatar elegido
    // de la lista fija (no hay fotos subidas). Sin avatar guardado, el sitio
    // usa uno fijo calculado del id (ver avatarOf en lib/profile.js), así que
    // las cuentas viejas no necesitan migración.
    bio: { type: String, trim: true, maxlength: BIO_MAX, default: '' },
    avatar: { type: String, enum: [...AVATAR_IDS, null], default: null },
    // Fondo del avatar elegido en «Editar perfil»; null = el color propio del avatar.
    avatarColor: { type: String, enum: [...AVATAR_COLORS, null], default: null },
  },
  { timestamps: true }, // agrega automáticamente createdAt y updatedAt
)

export default mongoose.model('User', userSchema)
