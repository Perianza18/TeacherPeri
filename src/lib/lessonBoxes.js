// Loads the problems behind the problem boxes of a lesson text, keyed
// `slug:kind` as TheoryView expects (the key of a `[[problems:…]]` box is
// `problems:<códigos>`). Used by the lesson page and the editor preview, so
// both show the same boxes. A box that can't be loaded is left out.
import { apiFetch } from './api'
import { collectionSlugs, problemReferences } from './theoryArticle'

// One string that changes only when the boxes in the text change.
export function boxesSignature(content) {
  return [...collectionSlugs(content), ...problemReferences(content).map((ref) => ref.key)].join('|')
}

export function loadLessonBoxes(content) {
  const slugs = Promise.all(collectionSlugs(content).map((slug) => apiFetch(`/api/collections/${encodeURIComponent(slug)}`).catch(() => null)))
    .then((results) => results.filter(Boolean).flatMap(({ slug, collections }) => Object.entries(collections).map(([kind, problems]) => [`${slug}:${kind}`, problems])))
  const picked = Promise.all(problemReferences(content).map(({ key, codes, kind }) => apiFetch(`/api/collections?codes=${encodeURIComponent(codes.join(','))}`)
    .then(({ problems }) => [`${key}:${kind}`, problems]).catch(() => null)))
    .then((results) => results.filter(Boolean))
  return Promise.all([slugs, picked]).then(([a, b]) => Object.fromEntries([...a, ...b]))
}
