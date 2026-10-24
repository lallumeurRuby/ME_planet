import { CanvasTexture, SRGBColorSpace } from 'three'

function canvasTexture(width: number, height: number, draw: (g: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d')!)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

let glow: CanvasTexture | null = null

/** 柔和放射狀光暈（星點、行星光暈、軌道光點共用） */
export function glowTexture(): CanvasTexture {
  glow ??= canvasTexture(128, 128, (g) => {
    const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.25, 'rgba(255,255,255,.45)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = gradient
    g.fillRect(0, 0, 128, 128)
  })
  return glow
}

/** 霧面行星紋理：底色 + 淡條紋 + 隨機坑洞（seed 固定，每顆行星長相穩定） */
export function planetTexture(hex: string, seed: number): CanvasTexture {
  let state = seed
  const random = () => (state = (state * 9301 + 49297) % 233280) / 233280
  return canvasTexture(512, 256, (g) => {
    g.fillStyle = hex
    g.fillRect(0, 0, 512, 256)
    for (let i = 0; i < 14; i++) {
      g.fillStyle = `rgba(255,255,255,${0.03 + random() * 0.05})`
      g.fillRect(0, random() * 256, 512, 4 + random() * 18)
    }
    for (let i = 0; i < 90; i++) {
      const x = random() * 512
      const y = random() * 256
      const radius = 3 + random() * 22
      const gradient = g.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, random() > 0.5 ? 'rgba(20,20,50,.22)' : 'rgba(255,255,255,.2)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = gradient
      g.beginPath()
      g.arc(x, y, radius, 0, Math.PI * 2)
      g.fill()
    }
  })
}
