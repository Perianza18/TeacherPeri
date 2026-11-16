// Ruta context for a page opened from a Ruta step (`?ruta=a/b/c`): the
// breadcrumbs with the ciclo, the step's place among its siblings, and the
// previous / next step. Pure functions over the public Path API responses.

const pathHref = (crumbs, index) => `/rutas/${crumbs.slice(0, index + 1).map((crumb) => encodeURIComponent(crumb.slug)).join('/')}`

// «Ciclo 1 — Primeros Pasos» → «Ciclo 1».
export function cicloShortName(title) {
  return /^Ciclo\s+\d+/i.exec(title || '')?.[0] || title || ''
}

function childrenOf(path) {
  return (path?.presentation || []).filter((item) => item.type === 'child').map((item) => item.child)
}

function sectionOf(path, childSlug) {
  const child = childrenOf(path).find((entry) => entry.slug === childSlug)
  if (!child?.section) return null
  return (path.presentation || []).find((item) => item.type === 'section' && item.section._id === child.section)?.section || null
}

// route: the `?traversal=` response for the leaf ({ breadcrumbs, path }).
// ancestors: the `path` of each breadcrumb above the leaf, root first (null
// where one could not be loaded).
export function buildRutaContext(route, ancestors = []) {
  const crumbs = route?.breadcrumbs || []
  const items = [{ label: 'Rutas', href: '/rutas' }]
  crumbs.forEach((crumb, index) => {
    const section = index > 0 ? sectionOf(ancestors[index - 1], crumb.slug) : null
    if (section) items.push({ label: cicloShortName(section.title) })
    items.push(index === crumbs.length - 1 ? { label: crumb.title, current: true } : { label: crumb.title, href: pathHref(crumbs, index) })
  })

  const parentIndex = crumbs.length - 2
  const parent = ancestors[parentIndex]
  if (!parent) return { crumbs: items, strip: null }

  const leafSlug = crumbs.at(-1).slug
  const leaf = childrenOf(parent).find((child) => child.slug === leafSlug)
  // Steps are the parent's available children in the same ciclo as this one.
  const steps = childrenOf(parent).filter((child) => child.available && (child.section ?? null) === (leaf?.section ?? null))
  const index = steps.findIndex((child) => child.slug === leafSlug)
  const parentHref = pathHref(crumbs, parentIndex)
  const step = (child) => child && { title: child.title, href: `${parentHref}/${encodeURIComponent(child.slug)}` }
  const section = sectionOf(parent, leafSlug)

  return {
    crumbs: items,
    strip: {
      label: section ? `${parent.title} · ${cicloShortName(section.title)}` : parent.title,
      href: parentHref,
      parentSlug: parent.slug,
      leafSlug,
      position: index >= 0 ? index + 1 : null,
      total: steps.length,
      prev: index > 0 ? step(steps[index - 1]) : null,
      next: index >= 0 ? step(steps[index + 1]) || null : null,
    },
  }
}
