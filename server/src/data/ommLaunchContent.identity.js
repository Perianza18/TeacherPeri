function ids(values = []) {
  return values.map(String).sort()
}

export function theoryMatches(existing, specification) {
  return existing.title === specification.title &&
    existing.summary === specification.summary &&
    existing.content === specification.content &&
    existing.level === specification.level &&
    existing.publicationStatus === specification.publicationStatus &&
    ids(existing.topics).length === 0 && ids(existing.tags).length === 0 && ids(existing.categories).length === 0
}

export function stepMatches(existing, specification, expectedReferences) {
  const actualReferences = existing.teacherperiReferences
    .map(({ contentType, target }) => `${contentType}:${target}`)
    .sort()
  return existing.order === specification.order &&
    existing.title === specification.title &&
    existing.description === specification.description &&
    existing.extraResources.length === 0 &&
    JSON.stringify(actualReferences) === JSON.stringify([...expectedReferences].sort())
}

export function assertNoAuthoredContentConflict(kind, identity, matches) {
  if (!matches) throw new Error(`${kind} identity conflict for ${identity}; refusing to overwrite independently authored content.`)
  return true
}
