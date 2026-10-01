import * as THREE from 'three'

export function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeAtlas() {
  const S = 1024
  const C = 128
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const g = cv.getContext('2d')!
  const R = rng(42)
  const at = (i: number) => [(i % 8) * C, Math.floor(i / 8) * C]

  const blob = (cx: number, cy: number, r: number, n: number, irr: number) => {
    const pts: number[][] = []
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2
      const rr = r * (1 - irr + R() * irr * 2)
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * (0.7 + R() * 0.5)])
    }
    g.beginPath()
    for (let k = 0; k < n; k++) {
      const p = pts[k]
      const q = pts[(k + 1) % n]
      if (k === 0) {
        const l = pts[n - 1]
        g.moveTo((l[0] + p[0]) / 2, (l[1] + p[1]) / 2)
      }
      g.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
    }
    g.closePath()
  }

  for (let i = 0; i < 32; i++) {
    const [x0, y0] = at(i)
    const cx = x0 + C / 2
    const cy = y0 + C / 2
    const r = C * (0.16 + R() * 0.18)
    blob(cx, cy, r, 8 + Math.floor(R() * 7), 0.35)
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r * 1.3)
    gr.addColorStop(0, 'rgba(255,255,255,1)')
    gr.addColorStop(0.6, 'rgba(255,255,255,.8)')
    gr.addColorStop(1, 'rgba(255,255,255,.25)')
    g.fillStyle = gr
    g.fill()
    for (let k = 0; k < 4; k++) {
      blob(cx + (R() - 0.5) * r * 2.4, cy + (R() - 0.5) * r * 2.4, r * (0.12 + R() * 0.25), 7, 0.3)
      g.fillStyle = `rgba(255,255,255,${0.4 + R() * 0.5})`
      g.fill()
    }
  }

  g.lineCap = 'round'
  for (let i = 32; i < 48; i++) {
    const [x0, y0] = at(i)
    const n = 1 + Math.floor(R() * 2)
    for (let f = 0; f < n; f++) {
      g.strokeStyle = `rgba(255,255,255,${0.6 + R() * 0.4})`
      g.lineWidth = 1.6 + R() * 2.2
      g.beginPath()
      g.moveTo(x0 + 12 + R() * 20, y0 + 12 + R() * 104)
      g.bezierCurveTo(x0 + R() * C, y0 + R() * C, x0 + R() * C, y0 + R() * C, x0 + 96 + R() * 20, y0 + 12 + R() * 104)
      g.stroke()
    }
  }

  const t = new THREE.CanvasTexture(cv)
  t.generateMipmaps = true
  t.minFilter = THREE.LinearMipmapLinearFilter
  return t
}

type Particle = { p: [number, number]; s: number; c: number; a: number; r: [number, number, number, number] }

export function makeParticles(mobile: boolean) {
  const R = rng(99)
  const list: Particle[] = []
  const pos = (): [number, number] => {
    let x = R()
    let y = R()
    const m = R()
    if (m < 0.38) {
      if (R() < 0.5) x = R() < 0.5 ? Math.pow(R(), 2.2) * 0.32 : 1 - Math.pow(R(), 2.2) * 0.32
      else y = R() < 0.5 ? Math.pow(R(), 2.2) * 0.28 : 1 - Math.pow(R(), 2) * 0.32
    } else if (m < 0.6) {
      y = 0.66 + R() * 0.34
    }
    return [x, y]
  }
  const add = (n: number, cell0: number, cells: number, smin: number, smax: number, sp: number, amin: number, amax: number) => {
    for (let i = 0; i < n; i++) {
      list.push({
        p: pos(),
        s: smin + (smax - smin) * Math.pow(R(), sp),
        c: cell0 + Math.floor(R() * cells),
        a: amin + R() * (amax - amin),
        r: [R(), R(), R(), R()],
      })
    }
  }
  const f = mobile ? 0.45 : 1
  add(Math.round(4200 * f), 0, 32, 1.4, 6.5, 2.6, 0.35, 0.95)
  add(Math.round(230 * f), 32, 16, 12, 46, 1.4, 0.35, 0.8)

  const n = list.length
  const P = new Float32Array(n * 2)
  const S = new Float32Array(n)
  const Ce = new Float32Array(n)
  const A = new Float32Array(n)
  const Rn = new Float32Array(n * 4)
  list.forEach((o, i) => {
    P.set(o.p, i * 2)
    S[i] = o.s
    Ce[i] = o.c
    A[i] = o.a
    Rn.set(o.r, i * 4)
  })
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
  geo.setAttribute('aPos', new THREE.BufferAttribute(P, 2))
  geo.setAttribute('aSize', new THREE.BufferAttribute(S, 1))
  geo.setAttribute('aCell', new THREE.BufferAttribute(Ce, 1))
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(A, 1))
  geo.setAttribute('aRnd', new THREE.BufferAttribute(Rn, 4))
  return geo
}

type Pt = [number, number]
type Thread = { a: Pt; b: Pt; sag: number; bend?: number; w: number; al: number; kind: number }

export function makeWebs(W: number, H: number) {
  const R = rng(7)
  const th: Thread[] = []
  const m = Math.min(W, H)

  const corner = (cx: number, cy: number, sx: number, sy: number, size: number, den: number, hang: boolean) => {
    const P = (x: number, y: number): Pt => [cx + sx * x, cy + sy * y]
    const top: number[] = []
    const side: number[] = []
    const nA = Math.round(16 * den)
    for (let i = 0; i < nA; i++) {
      top.push(size * (0.03 + 0.97 * Math.pow(R(), 1.35)))
      side.push(size * (0.03 + 0.97 * Math.pow(R(), 1.35)))
    }
    for (let i = 0; i < Math.round(52 * den); i++) {
      const x = top[Math.floor(R() * top.length)]
      const y = x * (0.45 + R() * 1.25)
      if (y > size * 1.15) continue
      th.push({ a: P(x, -2), b: P(-2, y), sag: 0.03 + R() * 0.1, w: 0.35 + R() * 0.45, al: 0.15 + Math.pow(R(), 2) * 0.6, kind: 0 })
    }
    for (let i = 0; i < Math.round(7 * den); i++) {
      th.push({
        a: P(size * (0.6 + R()), -2),
        b: P(-2, size * (0.6 + R())),
        sag: 0.02 + R() * 0.05,
        w: 0.45 + R() * 0.35,
        al: 0.18 + R() * 0.25,
        kind: 0,
      })
    }
    const nodes: Pt[] = []
    for (let i = 0; i < Math.round(36 * den); i++) {
      const rad = size * Math.pow(R(), 0.75) * 0.85
      const an = 0.08 + R() * (Math.PI / 2 - 0.16)
      nodes.push([Math.cos(an) * rad, Math.sin(an) * rad])
    }
    const pool: Pt[] = [...nodes, ...top.map((x): Pt => [x, -2]), ...side.map((y): Pt => [-2, y])]
    for (const n of nodes) {
      const near = pool
        .filter((q) => q !== n)
        .map((q) => [q, (q[0] - n[0]) ** 2 + (q[1] - n[1]) ** 2] as const)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 5)
      const k = 2 + Math.floor(R() * 2.5)
      for (let j = 0; j < k; j++) {
        const q = near[Math.floor(R() * near.length)][0]
        th.push({ a: P(n[0], n[1]), b: P(q[0], q[1]), sag: 0.02 + R() * 0.08, w: 0.3 + R() * 0.4, al: 0.12 + Math.pow(R(), 2) * 0.5, kind: 0 })
      }
    }
    if (hang) {
      for (let i = 0; i < Math.round(10 * den); i++) {
        const n = nodes[Math.floor(R() * nodes.length)]
        const st = P(n[0], n[1])
        const L = 25 + R() * 160
        th.push({ a: st, b: [st[0] + (R() - 0.5) * 16, st[1] + L], sag: 0, bend: (R() - 0.5) * 0.25, w: 0.45 + R() * 0.4, al: 0.35 + R() * 0.4, kind: 1 })
      }
    }
  }

  corner(0, 0, 1, 1, m * 0.55 + 80, 1.0, true)
  corner(W, 0, -1, 1, m * 0.4 + 50, 0.75, true)
  corner(0, H, 1, -1, m * 0.26 + 30, 0.45, false)

  type Seg = { p0: Pt; p1: Pt; s0: number; s1: number; A: Pt; B: Pt; mid: Pt; info: number[]; w: number }
  const segs: Seg[] = []
  for (const t of th) {
    const { a, b } = t
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const c: Pt = [(a[0] + b[0]) / 2 + (t.bend ?? 0) * L, (a[1] + b[1]) / 2 + t.sag * L]
    const n = Math.max(3, Math.min(22, Math.round(L / 22)))
    const brk = t.kind === 0 ? 0.25 + R() * 0.5 : 1
    const rnd = R()
    const q = (s: number): Pt => {
      const u = 1 - s
      return [u * u * a[0] + 2 * u * s * c[0] + s * s * b[0], u * u * a[1] + 2 * u * s * c[1] + s * s * b[1]]
    }
    const mid = q(0.5)
    for (let i = 0; i < n; i++) {
      segs.push({ p0: q(i / n), p1: q((i + 1) / n), s0: i / n, s1: (i + 1) / n, A: a, B: b, mid, info: [brk, rnd, t.al, t.kind], w: t.w })
    }
  }

  const V = segs.length * 4
  const F = (k: number) => new Float32Array(V * k)
  const P0 = F(2), P1 = F(2), S = F(2), ES = F(2), A = F(2), B = F(2), M = F(2), I = F(4), Wd = F(1)
  const idx = new Uint32Array(segs.length * 6)
  const corners = [[0, -1], [0, 1], [1, -1], [1, 1]]
  segs.forEach((g, i) => {
    for (let k = 0; k < 4; k++) {
      const v = i * 4 + k
      P0.set(g.p0, v * 2)
      P1.set(g.p1, v * 2)
      S[v * 2] = g.s0
      S[v * 2 + 1] = g.s1
      ES.set(corners[k], v * 2)
      A.set(g.A, v * 2)
      B.set(g.B, v * 2)
      M.set(g.mid, v * 2)
      I.set(g.info, v * 4)
      Wd[v] = g.w
    }
    idx.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 2, i * 4 + 1, i * 4 + 3], i * 6)
  })

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(F(3), 3))
  const attrs: [string, Float32Array, number][] = [
    ['aP0', P0, 2], ['aP1', P1, 2], ['aS', S, 2], ['aES', ES, 2], ['aA', A, 2],
    ['aB', B, 2], ['aMid', M, 2], ['aInfo', I, 4], ['aW', Wd, 1],
  ]
  for (const [name, arr, size] of attrs) geo.setAttribute(name, new THREE.BufferAttribute(arr, size))
  geo.setIndex(new THREE.BufferAttribute(idx, 1))
  return geo
}
