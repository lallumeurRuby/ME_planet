'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import type { ReactNode } from 'react'

interface Canvas3DProps {
  children: ReactNode
  className?: string
}

export default function Canvas3D({ children, className }: Canvas3DProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 1000, position: [0, 0, 5] }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}
