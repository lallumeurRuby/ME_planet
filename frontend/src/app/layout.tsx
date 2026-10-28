import type { Metadata } from 'next'
import { Cormorant_Garamond, Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'

import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})
// 中文字體檔很大：不預載，交給 Google Fonts 依字元分片載入
const notoSerif = Noto_Serif_TC({ weight: ['500', '600'], variable: '--font-noto-serif', display: 'swap', preload: false })
const notoSans = Noto_Sans_TC({ weight: ['300', '400', '500'], variable: '--font-noto-sans', display: 'swap', preload: false })

export const metadata: Metadata = {
  title: 'Ruby Oz',
  description: '我的知識衛星宇宙',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${cormorant.variable} ${notoSerif.variable} ${notoSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
