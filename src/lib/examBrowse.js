// Build the public tree from exams, omitting empty competition folders.
export function examBrowseTree(exams, categories) {
  const folders = new Map(categories.filter((c) => c.kind === 'exam').map((c) => [String(c._id), c]))
  const root = { children: [], exams: [] }
  for (const exam of exams) {
    const linked = (exam.categories || []).map((c) => folders.get(String(c._id || c))).find(Boolean)
    const path = []
    const seen = new Set()
    let folder = linked
    while (folder && !seen.has(String(folder._id))) {
      seen.add(String(folder._id))
      path.unshift(folder.name)
      folder = folders.get(String(folder.parent))
    }
    if (path[0] === 'Exámenes') path.shift()
    if (!path.length) path.push(exam.competition === 'TeacherPeri' ? 'TeacherPeri Originals' : exam.competition)
    if (!linked && exam.year) path.push(exam.year)
    let node = root
    for (const name of path) {
      let child = node.children.find((entry) => entry.name === name)
      if (!child) { child = { name, children: [], exams: [] }; node.children.push(child) }
      node = child
    }
    node.exams.push(exam)
  }
  const sort = (node) => {
    node.children.sort((a, b) => a.name === 'TeacherPeri Originals' ? -1 : b.name === 'TeacherPeri Originals' ? 1 : b.name.localeCompare(a.name, 'es', { numeric: true }))
    node.children.forEach(sort)
  }
  sort(root)
  return root
}
