// ---------------------------------------------------------------------------
// ProblemImage — one picture for a problem (a geometry figure, a table…),
// stored in MongoDB itself (never on Render's disk, which is wiped on every
// restart). The server always re-encodes uploads as WebP at most 1200 px wide
// (server/src/lib/images.js), so a document is usually a few dozen KB.
//
// An image is uploaded first (owner set, not used yet) and then attached to a
// problem or a proposal by id, together with its alt text and placement (see
// Problem.images and ProblemSubmission.proposed.images). Images are never
// changed in place: replacing one uploads a new image, so every URL can be
// cached forever.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

const problemImageSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contentType: { type: String, enum: ['image/webp'], required: true },
    data: { type: Buffer, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    bytes: { type: Number, required: true },
    originalBytes: { type: Number, required: true },
  },
  { timestamps: true },
)

export default mongoose.model('ProblemImage', problemImageSchema)
