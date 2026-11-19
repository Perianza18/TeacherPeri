// Penguin drawn as a graph: vertices joined by straight edges, a nod to the
// combinatorics in olympiad problems. The dark cap and back are filled and
// split into facets by light edges; the white belly stays clean. A wink to
// the creator's favorite animal until the official penguin logo exists;
// decoration only (aria-hidden), kept in this one file so the real drawing
// can replace it in one place.
//   color:    the dark back, the outline and the vertex rings
//   node:     the light parts: belly, vertices and the facet edges
//   flip:     face right instead of left
//   question: a hand-drawn «?» floats behind its head

// Vertices, facing left.
const V = {
  beakTip: [4, 36], beakTop: [20, 30], fore: [24, 20], crownF: [32, 10], crown: [46, 5],
  crownB: [60, 8], headB: [70, 18], nape: [73, 33], back1: [77, 53], back2: [84, 77],
  back3: [88, 104], hip: [87, 126], tail: [93, 142], footR: [78, 148], bottom: [60, 146],
  footL: [36, 148], front1: [26, 136], front2: [18, 112], front3: [16, 86], front4: [19, 62],
  chest: [23, 46], chin: [20, 39],
  // face patch and the line where the white belly meets the dark back
  face: [27, 31], eye: [38, 24], face2: [51, 26], cheek: [55, 41],
  k1: [59, 60], k2: [65, 87], k3: [67, 115], k4: [63, 140],
  // flipper hanging over the belly
  fin1: [50, 82], fin2: [46, 106], fin3: [56, 98],
}

const OUTLINE = ['beakTop', 'fore', 'crownF', 'crown', 'crownB', 'headB', 'nape', 'back1', 'back2', 'back3', 'hip', 'tail', 'footR', 'bottom', 'footL', 'front1', 'front2', 'front3', 'front4', 'chest', 'chin']
// Cap and back: from the forehead over the head, down the back to the tail,
// then up the belly line and around the face.
const DARK = ['fore', 'crownF', 'crown', 'crownB', 'headB', 'nape', 'back1', 'back2', 'back3', 'hip', 'tail', 'footR', 'k4', 'k3', 'k2', 'k1', 'cheek', 'face2', 'eye', 'face']
// Light edges that split the dark area into facets.
const FACETS = [['fin1', 'k2'], ['fin1', 'fin3'], ['crown', 'eye'], ['crown', 'face2'], ['crownB', 'face2'], ['headB', 'face2'], ['headB', 'cheek'], ['nape', 'cheek'], ['nape', 'k1'], ['back1', 'k1'], ['back1', 'k2'], ['back2', 'k2'], ['back2', 'k3'], ['back3', 'k3'], ['hip', 'k3'], ['hip', 'k4']]

// Flipper over the belly, and two little yellow feet.
const FLIPPER = ['k1', 'fin1', 'fin2', 'fin3', 'k2']
const FEET = [[[28, 147], [45, 145], [39, 152]], [[69, 146], [86, 148], [77, 152]]]

const points = (names) => names.map((name) => V[name].join(',')).join(' ')

export default function Penguin({ className = '', color = 'var(--tp-ink)', node = 'var(--tp-surface)', flip = false, question = false }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="-2 -2 100 154" className={`overflow-visible ${className}`} strokeLinejoin="round" strokeLinecap="round">
      <g transform={flip ? 'translate(96 0) scale(-1 1)' : undefined}>
        {question && (
          <g fill="none" stroke={color} strokeWidth="3.5">
            <path d="M80 -4 C 80 -16, 98 -16, 98 -4 C 98 5, 89 6, 89 14" />
            <circle cx="89" cy="23" r="1.6" fill={color} />
          </g>
        )}
        {/* belly, outline and beak */}
        <polygon points={points(OUTLINE)} fill={node} stroke={color} strokeWidth="2.2" />
        <polygon points={points(['beakTip', 'beakTop', 'chin'])} fill="var(--tp-yellow)" stroke={color} strokeWidth="2.2" />
        {FEET.map((foot) => <polygon key={foot[0].join()} points={foot.map((p) => p.join(',')).join(' ')} fill="var(--tp-yellow)" stroke={color} strokeWidth="2" />)}
        {/* dark cap and back, split into facets, and the flipper */}
        <polygon points={points(DARK)} fill={color} stroke={color} strokeWidth="2.2" />
        <polygon points={points(FLIPPER)} fill={color} stroke={color} strokeWidth="2.2" />
        <g stroke={node} strokeWidth="1.4" opacity=".75">
          {FACETS.map(([a, b]) => <line key={`${a}-${b}`} x1={V[a][0]} y1={V[a][1]} x2={V[b][0]} y2={V[b][1]} />)}
        </g>
        {/* vertices */}
        {Object.entries(V).map(([name, [x, y]]) => (
          name === 'eye'
            ? <circle key={name} cx={x} cy={y} r="3.6" fill={node} stroke={color} strokeWidth="1.6" />
            : <circle key={name} cx={x} cy={y} r="2.3" fill={node} stroke={color} strokeWidth="1.6" />
        ))}
      </g>
    </svg>
  )
}
