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
}

export default function Canvas3D({
  children,
  className,
  camera = { fov: 45, near: 0.1, far: 1000, position: [0, 0, 5] },
  shadows = true,
}: Canvas3DProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas camera={camera} shadows={shadows} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
