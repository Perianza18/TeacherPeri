// POST /api/contact — enviar el formulario de la página Contacto.
// Requiere sesión iniciada (el frontend oculta el formulario si no hay
// sesión, pero el backend lo exige por su cuenta, igual que comments).
//
// A propósito NO hay un GET que liste los mensajes: no existe un rol de
// "administrador" en este proyecto (todos los usuarios son iguales), así
// que exponer los mensajes de todo mundo a cualquiera con sesión sería un
// problema de privacidad. Por ahora se leen directo de Mongo.

import { Router } from 'express'
import ContactMessage from '../models/ContactMessage.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
  const { perfil, motivo } = req.body
  const mensaje = (req.body.mensaje || '').trim()

  if (!perfil || !motivo || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos: perfil, motivo o mensaje.' })
  }

  try {
    const contactMessage = await ContactMessage.create({
      author: req.userId,
      perfil,
      motivo,
      mensaje,
    })
    res.status(201).json(contactMessage)
  } catch (err) {
    if (err.name === 'ValidationError') {
      const mensajeError = Object.values(err.errors)
        .map((e) => e.message)
        .join(' ')
      return res.status(400).json({ error: mensajeError })
    }
    res.status(500).json({ error: 'No se pudo enviar el mensaje.' })
  }
})

export default router
