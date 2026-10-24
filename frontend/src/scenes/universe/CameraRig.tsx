'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'

import { SYSTEM_RADIUS, type SceneRegistry } from './registry'

export const WIDE_BREAKPOINT = 860
const FOV = 28
const SHIFT_RIGHT = 0.12 // 寬螢幕時把星系中心移到畫面 62% 處，讓出左側 hero
const HOME_DIRECTION = new Vector3(0, 8.5, 23).normalize() // 俯角約 20°
const FOCUS_DISTANCE = 9.5 // 飛入後與衛星的水平距離
const FOCUS_HEIGHT = 3.2
const UP = new Vector3(0, 1, 0)

/**
 * 相機：首頁時依視窗大小自動算距離，讓整個星系留在 hero 右側的可用範圍內；
 * 飛入衛星時以指數緩動靠近（抵達時自然減速），並回到畫面正中央。
 */
export function CameraRig({ focusedId, registry }: { focusedId: number | null; registry: SceneRegistry }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)
  const pointer = useThree((s) => s.pointer)

  const homeOffset = useMemo(() => {
    const wide = size.width > WIDE_BREAKPOINT
    const tanV = Math.tan((FOV * Math.PI) / 360)
    const tanH = tanV * (size.width / size.height)
    const usableH = wide ? 0.77 : 0.85
    const usableV = wide ? 0.85 : 0.55
    const fitWidth = SYSTEM_RADIUS / (tanH * usableH)
    const fitHeight = (SYSTEM_RADIUS * 0.4) / (tanV * usableV)
    return HOME_DIRECTION.clone().multiplyScalar(Math.max(fitWidth, fitHeight, 24))
  }, [size.width, size.height])

  const state = useRef({ target: new Vector3(), position: homeOffset.clone(), shift: 0 })
  const goal = useMemo(() => ({ target: new Vector3(), position: new Vector3() }), [])
  const tangent = useMemo(() => new Vector3(), [])
  const parallax = useMemo(() => new Vector3(), [])

  useEffect(() => {
    camera.fov = FOV
    camera.far = 600
    camera.updateProjectionMatrix()
  }, [camera])

  useFrame((_, dt) => {
    const focus = focusedId === null ? undefined : registry.satellitePositions.get(focusedId)
    if (focus) {
      // 從公轉軌道的切線方向看衛星：ME Planet 落在畫面一側，不會擋在衛星正後方
      tangent.set(-focus.z, 0, focus.x).normalize()
      // 兩個切線方向取離目前鏡頭較近的一側，避免繞到星系另一邊
      if (tangent.dot(parallax.copy(state.current.position).sub(focus)) < 0) tangent.negate()
      goal.target.copy(focus)
      goal.position.copy(focus).addScaledVector(tangent, FOCUS_DISTANCE).addScaledVector(UP, FOCUS_HEIGHT)
    } else {
      goal.target.set(0, 0, 0)
      goal.position.copy(homeOffset)
    }
    const k = 1 - Math.exp(-dt * 2.6)
    const s = state.current
    s.target.lerp(goal.target, k)
    s.position.lerp(goal.position, k)

    // 滑鼠視差（飛入時減弱）
    parallax.set(pointer.x * 0.6, pointer.y * 0.4, 0).multiplyScalar(focus ? 0.3 : 1)
    camera.position.copy(s.position).add(parallax)
    camera.lookAt(s.target)

    s.shift += ((focus || size.width <= WIDE_BREAKPOINT ? 0 : SHIFT_RIGHT) - s.shift) * k
    camera.setViewOffset(size.width, size.height, -s.shift * size.width, 0, size.width, size.height)
    camera.updateMatrixWorld()
  })

  return null
}
