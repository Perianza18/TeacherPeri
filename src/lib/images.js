// Problem images: the URL of one image and the upload. The server re-checks
// everything (server/src/lib/images.js); these checks only give a quick answer.
import { API_BASE } from './api'

export const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const IMAGES_PER_PROBLEM = 4
export const ALT_MIN = 5
export const ALT_MAX = 300

export const imageSrc = (id) => `${API_BASE}/api/images/${id}`

// Sends the file itself as the request body. Resolves { _id, width, height, bytes }.
export async function uploadImage(file, token) {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('Solo se aceptan imágenes PNG, JPG o WebP.')
  if (file.size > IMAGE_MAX_BYTES) throw new Error('La imagen pesa más de 5 MB.')
  const res = await fetch(`${API_BASE}/api/images`, { method: 'POST', headers: { 'Content-Type': file.type, Authorization: `Bearer ${token}` }, body: file })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 401) window.dispatchEvent(new Event('teacherperi:auth-expired'))
    throw new Error(data?.error || 'No se pudo subir la imagen.')
  }
  return data
}

export const byPlacement = (images, placement) => (images || []).filter((entry) => (entry.placement || 'statement') === placement)
