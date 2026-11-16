import { useState } from 'react'

// A Ruta is a graph of steps, so the Rutas header shows one: vertices and
// edges flowing from a start (yellow) to a goal (violet star). The path from
// the start to the vertex under the mouse lights up and draws itself;
// otherwise the path to the goal does. Decoration only (aria-hidden).

const NODES = {
  A: [34, 196], B: [100, 140], C: [104, 222], D: [170, 92], E: [178, 182],
  F: [244, 58], G: [250, 144], H: [306, 208], I: [334, 36],
}
const EDGES = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'E'], ['D', 'F'], ['D', 'G'], ['E', 'G'], ['E', 'H'], ['F', 'I'], ['G', 'I'], ['G', 'H']]
// One way back to the start from every vertex (a spanning tree of the graph).
const PARENT = { B: 'A', C: 'A', D: 'B', E: 'C', F: 'D', G: 'E', H: 'E', I: 'F' }
const START = 'A'
const GOAL = 'I'

function pathTo(node) {
  const path = [node]
  while (PARENT[path[0]]) path.unshift(PARENT[path[0]])
  return path
}

export default function RouteGraph({ className = '' }) {
  const [target, setTarget] = useState(GOAL)
  const path = pathTo(target)
  const onPath = new Set(path)
  const ink = 'var(--tp-ink)'

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 368 252" className={`overflow-visible ${className}`} onMouseLeave={() => setTarget(GOAL)}>
      <g stroke={ink} strokeWidth="2.5" strokeLinecap="round">
        {EDGES.map(([a, b]) => <line key={a + b} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />)}
      </g>
      {/* the lit path, keyed so it redraws when the target changes */}
      <polyline key={target} className="tp-route-path" points={path.map((n) => NODES[n].join(',')).join(' ')} pathLength="1000" fill="none" stroke="var(--tp-violet)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      {Object.entries(NODES).map(([name, [x, y]]) => {
        const fill = name === START ? 'var(--tp-yellow)' : name === GOAL ? 'var(--tp-violet)' : onPath.has(name) ? 'var(--tp-tint-violet)' : 'var(--tp-surface)'
        return (
          <g key={name} className="cursor-pointer" onMouseEnter={() => setTarget(name)}>
            <circle cx={x + 3} cy={y + 3} r="13" fill={ink} />
            <circle cx={x} cy={y} r="13" fill={fill} stroke={ink} strokeWidth="2.5" className="transition-[fill] duration-200" />
            {name === GOAL && <path d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y - 2} L${x + 3} ${y + 1.5} L${x + 4.5} ${y + 7} L${x} ${y + 4} L${x - 4.5} ${y + 7} L${x - 3} ${y + 1.5} L${x - 7} ${y - 2} L${x - 2} ${y - 2} Z`} fill="var(--tp-surface)" />}
            {/* a bigger invisible target, easier to hover */}
            <circle cx={x} cy={y} r="22" fill="transparent" />
          </g>
        )
      })}
    </svg>
  )
}
