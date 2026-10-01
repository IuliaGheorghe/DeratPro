import * as THREE from 'three'
import { makeAtlas, makeParticles, makeWebs } from './builders'
import { createLogo3D } from './logo3d'
import { BASE_FS, FILM_FS, PARTICLE_FS, PARTICLE_VS, PATTERN_FS, QUAD_VS, WEB_FS, WEB_VS } from './shaders'

type Options = {
  base: HTMLCanvasElement
  over: HTMLCanvasElement
  track: HTMLElement
  logo: HTMLElement
  word: HTMLElement
  cue: HTMLElement
  photo: string
  zoom?: [number, number]
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export function createDirtScene({ base, over, track, logo, word, cue, photo, zoom = [1.1, 1] }: Options) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1
  const mobile = Math.min(window.innerWidth, window.innerHeight) < 700
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75)

  const rBase = new THREE.WebGLRenderer({ canvas: base, antialias: false })
  const rOver = new THREE.WebGLRenderer({ canvas: over, antialias: true, alpha: true })
  rBase.setPixelRatio(dpr)
  rOver.setPixelRatio(dpr)
  rOver.setClearColor(0x000000, 0)

  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const quad = new THREE.PlaneGeometry(2, 2)

  const U = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uR: { value: 0 },
    uBand: { value: 150 },
    uTime: { value: 0 },
    uDpr: { value: dpr },
    uScale: { value: new THREE.Vector2(1, 1) },
    uMotion: { value: motion },
  }
  const uniforms = (extra: Record<string, THREE.IUniform> = {}) => ({ ...U, ...extra })
  const shader = (vertexShader: string, fragmentShader: string, extra: Record<string, THREE.IUniform>, opts: THREE.ShaderMaterialParameters = {}) =>
    new THREE.ShaderMaterial({ uniforms: uniforms(extra), vertexShader, fragmentShader, depthTest: false, depthWrite: false, ...opts })

  const disposables: { dispose(): void }[] = [quad]
  let raf = 0
  let disposed = false
  let cleanupStart = () => {}

  const img = new Image()
  img.onload = () => {
    if (!disposed) cleanupStart = start()
  }
  img.src = photo

  function photoTexture() {
    const t = new THREE.Texture(img)
    t.generateMipmaps = true
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.needsUpdate = true
    disposables.push(t)
    return t
  }

  function start() {
    const tBase = photoTexture()
    const tOver = photoTexture()

    const baseMat = shader(QUAD_VS, BASE_FS, { uPhoto: { value: tBase } })
    const sBase = new THREE.Scene()
    sBase.add(new THREE.Mesh(quad, baseMat))

    const patMat = shader(QUAD_VS, PATTERN_FS, {})
    const patScene = new THREE.Scene()
    patScene.add(new THREE.Mesh(quad, patMat))

    const filmMat = shader(QUAD_VS, FILM_FS, { uPat: { value: null }, uPhoto: { value: tOver } }, { transparent: true })
    const atlas = makeAtlas()
    const dustGeo = makeParticles(mobile)
    const dustMat = shader(PARTICLE_VS, PARTICLE_FS, { uAtlas: { value: atlas }, uPhoto: { value: tOver } }, { transparent: true })
    const webMat = shader(WEB_VS, WEB_FS, { uPhoto: { value: tOver } }, { transparent: true, side: THREE.DoubleSide })
    disposables.push(baseMat, patMat, filmMat, atlas, dustGeo, dustMat, webMat)

    const logo3d = createLogo3D(rOver)
    disposables.push(logo3d)
    rOver.autoClear = false
    track.classList.add('gl')

    const sOver = new THREE.Scene()
    const film = new THREE.Mesh(quad, filmMat)
    film.frustumCulled = false
    film.renderOrder = 0
    const dust = new THREE.Points(dustGeo, dustMat)
    dust.frustumCulled = false
    dust.renderOrder = 2
    sOver.add(film, dust)

    let W = 0
    let H = 0
    const baseScale = new THREE.Vector2(1, 1)
    let rt: THREE.WebGLRenderTarget | null = null
    let webs: THREE.Mesh | null = null

    const resize = () => {
      W = base.clientWidth
      H = base.clientHeight
      rBase.setSize(W, H, false)
      rOver.setSize(W, H, false)
      U.uRes.value.set(W, H)
      U.uBand.value = Math.min(W, H) * 0.11 + 70
      const va = W / H
      const ia = img.width / img.height
      if (va > ia) baseScale.set(1, ia / va)
      else baseScale.set(va / ia, 1)

      rt?.dispose()
      rt = new THREE.WebGLRenderTarget(Math.round(W * dpr), Math.round(H * dpr), {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false,
      })
      rOver.setRenderTarget(rt)
      rOver.render(patScene, cam)
      rOver.setRenderTarget(null)
      filmMat.uniforms.uPat.value = rt.texture

      if (webs) {
        sOver.remove(webs)
        webs.geometry.dispose()
      }
      webs = new THREE.Mesh(makeWebs(W, H), webMat)
      webs.frustumCulled = false
      webs.renderOrder = 1
      sOver.add(webs)
    }

    let target = 0
    let cur = 0
    const readScroll = () => {
      target = Math.min(1, Math.max(0, -track.getBoundingClientRect().top / window.innerHeight))
    }

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', readScroll, { passive: true })
    resize()
    readScroll()
    cur = target

    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(track)

    const t0 = performance.now()
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      cur += (target - cur) * 0.085
      const p = cur
      U.uTime.value = (now - t0) / 1000

      const rise = 1 - Math.pow(1 - Math.min(1, p / 0.42), 3)
      logo.style.transform = `translateY(${((1 - rise) * 0.7 * H).toFixed(1)}px)`
      logo.classList.toggle('lit', p > 0.42)
      cue.style.opacity = (1 - smooth(0, 0.06, p)).toFixed(3)

      const z = zoom[0] + (zoom[1] - zoom[0]) * smooth(0, 0.85, p)
      U.uScale.value.set(baseScale.x / z, baseScale.y / z)
      U.uR.value = smooth(0.03, 0.82, p) * (H + U.uBand.value * 4)
      rBase.render(sBase, cam)
      rOver.clear()
      rOver.render(sOver, cam)
      logo3d.update({
        W,
        H,
        rect: word.getBoundingClientRect(),
        canvasRect: over.getBoundingClientRect(),
        rise,
        lit: p > 0.42,
        time: U.uTime.value,
      })
      logo3d.render()
    }
    raf = requestAnimationFrame(frame)

    return () => {
      track.classList.remove('gl')
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', readScroll)
      rt?.dispose()
      webs?.geometry.dispose()
    }
  }

  return () => {
    disposed = true
    img.onload = null
    cancelAnimationFrame(raf)
    cleanupStart()
    disposables.forEach((d) => d.dispose())
    rBase.dispose()
    rOver.dispose()
  }
}