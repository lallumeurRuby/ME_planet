'use client'

import { Canvas } from '@react-three/fiber'
import type { CanvasProps } from '@react-three/fiber'
import { Suspense } from 'react'
import type { ReactNode } from 'react'

interface Canvas3DProps {
  children: ReactNode
  className?: string
  camera?: CanvasProps['camera']
  shadows?: boolean
  frameloop?: CanvasProps['frameloop']
}

export default function Canvas3D({
  children,
  className,
  camera = { fov: 45, near: 0.1, far: 1000, position: [0, 0, 5] },
  shadows = true,
  frameloop = 'always',
}: Canvas3DProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      {/* dpr 上限 1.5：Retina 螢幕像素量少約 44%，有 antialias 時畫質差異不明顯 */}
      <Canvas
        camera={camera}
        shadows={shadows}
        frameloop={frameloop}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
