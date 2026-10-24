/** 衛星配色：依建立順序循環（霧面粉彩行星）。hex 給 3D 材質，css 給 2D 小圓點 */
export const SATELLITE_PALETTE = [
  { hex: '#7f95dd', css: 'radial-gradient(circle at 35% 30%, #c7d3fb, #7f95dd 55%, #3f4f8f)' },
  { hex: '#b9a8e0', css: 'radial-gradient(circle at 35% 30%, #ece5ff, #b9a8e0 55%, #62558f)' },
  { hex: '#e3a679', css: 'radial-gradient(circle at 35% 30%, #ffe0c4, #e3a679 55%, #8f5733)' },
  { hex: '#c8c88f', css: 'radial-gradient(circle at 35% 30%, #f3f3cf, #c8c88f 55%, #6d6d3f)' },
  { hex: '#dca1a6', css: 'radial-gradient(circle at 35% 30%, #ffe1e3, #dca1a6 55%, #8a4d53)' },
  { hex: '#8fb2d9', css: 'radial-gradient(circle at 35% 30%, #d9ecff, #8fb2d9 55%, #3f6189)' },
] as const

export const paletteAt = (index: number) => SATELLITE_PALETTE[index % SATELLITE_PALETTE.length]
