/**
 * Small Lottie (Bodymovin v5) animations built in code so they stay crisp,
 * tiny and on-brand without shipping external JSON files.
 */

type RGBA = [number, number, number, number]
type Kf = { t: number; s: number[] }

const BRAND: RGBA = [0.906, 0.353, 0.192, 1] // ≈ oklch(0.64 0.2 36)
const SUCCESS: RGBA = [0.118, 0.647, 0.443, 1]

const easeInOut = (dims: number) => ({
  i: { x: Array(dims).fill(0.4), y: Array(dims).fill(1) },
  o: { x: Array(dims).fill(0.6), y: Array(dims).fill(0) },
})

/** Animated property from keyframes (easing applied between each pair). */
function animated(frames: Kf[]) {
  const dims = frames[0].s.length
  return {
    a: 1,
    k: frames.map((f, idx) => (idx === frames.length - 1 ? f : { ...f, ...easeInOut(dims) })),
  }
}

const value = <T,>(k: T) => ({ a: 0, k })

const transform = {
  ty: "tr",
  p: value([0, 0]),
  a: value([0, 0]),
  s: value([100, 100]),
  r: value(0),
  o: value(100),
  sk: value(0),
  sa: value(0),
  nm: "Transform",
}

function layer(
  ind: number,
  op: number,
  ks: Record<string, unknown>,
  shapes: unknown[]
) {
  return {
    ddd: 0,
    ind,
    ty: 4,
    nm: `layer-${ind}`,
    sr: 1,
    ks: {
      o: value(100),
      r: value(0),
      p: value([0, 0, 0]),
      a: value([0, 0, 0]),
      s: value([100, 100, 100]),
      ...ks,
    },
    ao: 0,
    shapes,
    ip: 0,
    op,
    st: 0,
    bm: 0,
  }
}

function composition(name: string, w: number, h: number, op: number, layers: unknown[]) {
  return { v: "5.7.4", fr: 60, ip: 0, op, w, h, nm: name, ddd: 0, assets: [], layers }
}

const fill = (c: RGBA) => ({ ty: "fl", c: value(c), o: value(100), r: 1, bm: 0, nm: "Fill" })
const stroke = (c: RGBA, w: number) => ({
  ty: "st",
  c: value(c),
  o: value(100),
  w: value(w),
  lc: 2,
  lj: 2,
  ml: 4,
  bm: 0,
  nm: "Stroke",
})
const ellipse = (size: number) => ({ ty: "el", d: 1, s: value([size, size]), p: value([0, 0]), nm: "Ellipse" })
const group = (...items: unknown[]) => ({ ty: "gr", it: [...items, transform], nm: "Group", bm: 0 })

/** Three dots doing a soft wave — the "Lekan is thinking" loader. */
export const thinkingDots = (() => {
  const op = 84
  const layers = [0, 1, 2].map((i) => {
    const d = i * 12
    return layer(
      i + 1,
      op,
      {
        p: {
          s: true,
          x: value(18 + i * 22),
          y: animated([
            { t: d, s: [22] },
            { t: d + 16, s: [13] },
            { t: d + 34, s: [22] },
            { t: op, s: [22] },
          ]),
        },
        o: animated([
          { t: d, s: [35] },
          { t: d + 16, s: [100] },
          { t: d + 34, s: [35] },
          { t: op, s: [35] },
        ]),
      },
      [group(ellipse(11), fill(BRAND))]
    )
  })
  return composition("thinking-dots", 80, 34, op, layers)
})()

/**
 * Linear property whose cycle is shifted by `offset` frames and wraps
 * seamlessly at the loop boundary (from → to, then snaps back to from).
 */
function wrappingLinear(from: number[], to: number[], op: number, offset: number) {
  const lerp = (p: number) => from.map((f, i) => f + (to[i] - f) * p)
  const linear = (dims: number) => ({
    i: { x: Array(dims).fill(1), y: Array(dims).fill(1) },
    o: { x: Array(dims).fill(0), y: Array(dims).fill(0) },
  })
  const dims = from.length
  if (offset === 0) {
    return { a: 1, k: [{ t: 0, s: from, ...linear(dims) }, { t: op, s: to }] }
  }
  const startProgress = (op - offset) / op
  return {
    a: 1,
    k: [
      { t: 0, s: lerp(startProgress), ...linear(dims) },
      { t: offset - 0.01, s: to, h: 1 },
      { t: offset, s: from, ...linear(dims) },
      { t: op, s: lerp(startProgress) },
    ],
  }
}

/** Expanding rings around a core — used while waiting on Google / idle avatar. */
export const pulseRings = (() => {
  const op = 150
  const rings = [0, 1, 2].map((i) => {
    const d = i * 50
    return layer(
      i + 2,
      op,
      {
        p: value([60, 60, 0]),
        s: wrappingLinear([30, 30, 100], [100, 100, 100], op, d),
        o: wrappingLinear([70], [0], op, d),
      },
      [group(ellipse(110), stroke(BRAND, 2))]
    )
  })
  const core = layer(
    1,
    op,
    {
      p: value([60, 60, 0]),
      s: animated([
        { t: 0, s: [100, 100, 100] },
        { t: 75, s: [88, 88, 100] },
        { t: 150, s: [100, 100, 100] },
      ]),
    },
    [group(ellipse(30), fill(BRAND))]
  )
  return composition("pulse-rings", 120, 120, op, [core, ...rings])
})()

/** Circle draws in, then a check stroke — plays once on approval. */
export const successCheck = (() => {
  const op = 60
  const trim = (from: number, to: number) => ({
    ty: "tm",
    s: value(0),
    e: animated([
      { t: from, s: [0] },
      { t: to, s: [100] },
    ]),
    o: value(0),
    m: 1,
    nm: "Trim",
  })
  const circle = group(ellipse(52), stroke(SUCCESS, 4), trim(0, 22))
  const check = group(
    {
      ty: "sh",
      ks: value({
        c: false,
        v: [
          [-11, 1],
          [-3, 9],
          [12, -8],
        ],
        i: [
          [0, 0],
          [0, 0],
          [0, 0],
        ],
        o: [
          [0, 0],
          [0, 0],
          [0, 0],
        ],
      }),
      nm: "Check",
    },
    stroke(SUCCESS, 4.5),
    trim(16, 34)
  )
  return composition("success-check", 64, 64, op, [
    layer(
      1,
      op,
      {
        p: value([32, 32, 0]),
        s: animated([
          { t: 0, s: [80, 80, 100] },
          { t: 22, s: [106, 106, 100] },
          { t: 36, s: [100, 100, 100] },
        ]),
      },
      [check, circle]
    ),
  ])
})()
