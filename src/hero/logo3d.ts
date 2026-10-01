import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import fontData from './logoFont.json'

const FOV = 30
const CAM_Z = 10
const DEPTH = 0.32
const TILT = 0.24

export function createLogo3D(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene()
  const sceneRest = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  camera.position.z = CAM_Z

  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const env = pmrem.fromScene(room, 0.04).texture
  scene.environment = env
  scene.environmentIntensity = 0.5
  sceneRest.environment = env
  sceneRest.environmentIntensity = 0.5
  room.dispose()
  pmrem.dispose()

  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(-2, -1.5, 6)
  const sweep = new THREE.PointLight(0xffffff, 0, 0, 0)
  scene.add(key, sweep)
  sceneRest.add(key.clone())

  const font = new FontLoader().parse(fontData as never)
  const text = (s: string) => {
    const g = new TextGeometry(s, {
      font,
      size: 1,
      depth: DEPTH,
      curveSegments: 16,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.008,
      bevelSegments: 2,
    })
    g.computeBoundingBox()
    return g
  }
  const advance = (s: string) =>
    [...s].reduce((w, ch) => w + (fontData.glyphs as Record<string, { ha: number }>)[ch].ha, 0) / fontData.resolution

  const face = (color: string, roughness = 0.32) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 })
  const greenMats = [face('#1aa77c', 0.4), face('#0d5e46', 0.6)]
  const whiteMats = [face('#f6f8fa', 0.4), face('#9aa5b2', 0.6)]

  const deratGeo = text('Derat')
  const proGeo = text('Pro')
  const dotShape = new THREE.Shape().absarc(0, 0, 0.095, 0, Math.PI * 2, false)
  const dotGeo = new THREE.ExtrudeGeometry(dotShape, {
    depth: DEPTH,
    curveSegments: 32,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.008,
    bevelSegments: 2,
  })

  const derat = new THREE.Mesh(deratGeo, greenMats)
  const pro = new THREE.Mesh(proGeo, whiteMats)
  const dot = new THREE.Mesh(dotGeo, whiteMats)

  const tracking = 0
  const deratW = advance('Derat') + tracking * 5
  const proW = advance('Pro') + tracking * 3
  pro.position.x = deratW + 0.03
  dot.position.set(deratW + 0.03 + proW + 0.13, 0.745 - 0.095, 0)
  const total = dot.position.x + 0.095
  const cap = 0.745

  const inner = new THREE.Group()
  inner.add(derat)
  inner.position.set(-total / 2, -cap / 2, -DEPTH / 2)
  const innerRest = new THREE.Group()
  innerRest.add(pro, dot)
  innerRest.position.copy(inner.position)

  const group = new THREE.Group()
  group.add(inner)
  scene.add(group)
  const groupRest = new THREE.Group()
  groupRest.add(innerRest)
  sceneRest.add(groupRest)

  let litAt = -1

  const update = (o: { W: number; H: number; rect: DOMRect; canvasRect: DOMRect; rise: number; lit: boolean; time: number }) => {
    camera.aspect = o.W / o.H
    camera.updateProjectionMatrix()
    const visibleH = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const k = visibleH / o.H
    const cx = o.rect.left + o.rect.width / 2 - o.canvasRect.left
    const cy = o.rect.top + o.rect.height / 2 - o.canvasRect.top
    group.position.set((cx - o.W / 2) * k, (o.H / 2 - cy) * k, 0)
    group.scale.setScalar((o.rect.width * k) / total)

    group.rotation.x = TILT
    group.visible = o.rise > 0.001

    if (o.lit && litAt < 0) litAt = o.time
    if (!o.lit) litAt = -1
    const t = litAt < 0 ? -1 : (o.time - litAt) / 1.4
    if (t >= 0 && t <= 1) {
      const local = new THREE.Vector3(THREE.MathUtils.lerp(-0.3, deratW + 0.3, t), cap * 0.55, DEPTH + 0.6)
      sweep.position.copy(inner.localToWorld(local))
      sweep.intensity = Math.sin(t * Math.PI) * 9
    } else {
      sweep.intensity = 0
    }

    groupRest.position.copy(group.position)
    groupRest.scale.copy(group.scale)
    groupRest.rotation.copy(group.rotation)
    groupRest.visible = group.visible
  }

  const dispose = () => {
    env.dispose()
    ;[deratGeo, proGeo, dotGeo, ...greenMats, ...whiteMats].forEach((d) => d.dispose())
  }

  const render = () => {
    renderer.render(scene, camera)
    renderer.render(sceneRest, camera)
  }

  return { update, render, dispose }
}