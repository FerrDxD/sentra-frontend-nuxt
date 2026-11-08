/**
 * Deterministic constellation geometry for the Hall of Fame "Nawasena sky".
 *
 * Every cabinet (angkatan) is rendered as a constellation: its members are the
 * stars, placed with an even, seeded scatter and joined by a minimum spanning
 * tree — the same linked-point structure a star chart uses, so the result reads
 * as a constellation rather than arbitrary dots on a line.
 */

export interface ConstellationPoint {
  /** Fraction of the container's width, 0..1. */
  x: number
  /** Fraction of the container's height, 0..1. */
  y: number
}

export interface ConstellationEdge {
  a: number // index into `points`
  b: number // index into `points`
  /** Seam length in a 0..100 coordinate space (used for line-draw animation). */
  length: number
}

export interface Constellation {
  points: ConstellationPoint[]
  edges: ConstellationEdge[]
}

/** FNV-1a → a stable, well-spread hash for seeding. */
export function hashString(str: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Small, fast seeded PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const GOLDEN_ANGLE = 2.399963229728653

/**
 * Build a constellation for `starIds` (one entry per star — the id seeds both
 * the golden-angle phase and the jitter so the map is stable across renders
 * and clients).
 */
export function buildConstellation(starIds: (string | number)[]): Constellation {
  const n = starIds.length
  const rand = mulberry32(hashString(starIds.map(String).join('|') || 'nawasena'))

  const points: ConstellationPoint[] = []
  for (let i = 0; i < n; i++) {
    const r = Math.sqrt((i + 0.5) / n)
    const theta = i * GOLDEN_ANGLE + (hashString(String(starIds[i])) % 360) * (Math.PI / 180)
    let x = 0.5 + r * 0.36 * Math.cos(theta)
    let y = 0.5 + r * 0.36 * Math.sin(theta)
    x += (rand() - 0.5) * 0.07
    y += (rand() - 0.5) * 0.07
    points.push({
      x: Math.min(0.9, Math.max(0.1, x)),
      y: Math.min(0.9, Math.max(0.1, y)),
    })
  }

  const edges: ConstellationEdge[] = []
  if (n > 1) {
    const inTree = new Array<boolean>(n).fill(false)
    inTree[0] = true
    for (let k = 0; k < n - 1; k++) {
      let bi = -1
      let bj = -1
      let best = Infinity
      for (let i = 0; i < n; i++) {
        if (!inTree[i]) continue
        for (let j = 0; j < n; j++) {
          if (inTree[j]) continue
          const dx = points[i]!.x - points[j]!.x
          const dy = points[i]!.y - points[j]!.y
          const d = dx * dx + dy * dy
          if (d < best) {
            best = d
            bi = i
            bj = j
          }
        }
      }
      if (bi < 0 || bj < 0) break
      inTree[bj] = true
      edges.push({ a: bi, b: bj, length: 0 })
    }
  }

  for (const e of edges) {
    const dx = (points[e.a]!.x - points[e.b]!.x) * 100
    const dy = (points[e.a]!.y - points[e.b]!.y) * 100
    e.length = Math.sqrt(dx * dx + dy * dy)
  }

  return { points, edges }
}