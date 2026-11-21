const coordinates = (point) => point.join(' ')

export const polyline = (points, color = '#111111', closed = false) => {
  const [start, ...rest] = points
  const commands = rest.map((point) => `L ${coordinates(point)}`).join(' ')
  return `<path stroke="${color}" d="M ${coordinates(start)} ${commands}${closed ? ' Z' : ''}"/>`
}

export const line = (start, end, color = '#111111') => polyline([start, end], color)
export const highlightedEdge = (start, end, color) => `<path stroke="${color}" stroke-linecap="butt" d="M ${coordinates(start)} L ${coordinates(end)}"/>`
export const triangle = (a, b, c, color = '#111111') => polyline([a, b, c], color, true)
export const chevron = ([x, y], color = '#111111') => polyline([[x - 6, y - 6], [x, y], [x - 6, y + 6]], color)

export const arrow = (start, tip, upper, lower, color = '#111111') => `<path stroke="${color}" d="M ${coordinates(upper)} L ${coordinates(tip)} L ${coordinates(lower)} M ${coordinates(start)} L ${coordinates(tip)}"/>`
