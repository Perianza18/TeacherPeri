// ---------------------------------------------------------------------------
// ContactMessage model — one document per submission of the Contacto form.
// Same shape as the form on the frontend (ver ContactForm.jsx): quién eres,
// motivo del mensaje, y el mensaje mismo. `author` existe porque el
// formulario solo se puede enviar con sesión iniciada (igual que Comment).
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    perfil: {
      type: String,
      required: true,
      enum: [
        'Estudiante de Secundaria/Prepa',
        'Exolímpico/Entrenador',
        'Profesor(a)',
        'Padre/Madre',
        'Otro',
      ],
    },

    motivo: {
      type: String,
      required: true,
      enum: [
        'Sugerir un recurso',
        'Compartir experiencia',
        'Duda sobre extranjero',
        'Feedback general',
      ],
    },

    mensaje: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'El mensaje no puede pasar de 2000 caracteres.'],
    },
  },
  { timestamps: true },
)

export default mongoose.model('ContactMessage', contactMessageSchema)
