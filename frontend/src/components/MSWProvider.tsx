'use client'

import { useEffect, useState } from 'react'

// 開發模式下 React StrictMode 會讓 effect 執行兩次；worker 只能啟動一次，
// 否則第二次 start() 重新註冊期間發出的請求會被 bypass、直接打到後端
let mocksReady: Promise<void> | null = null

function startMocks(): Promise<void> {
  mocksReady ??= import('@/mocks/browser').then(({ initMocks }) => initMocks()).catch(() => {})
  return mocksReady
}

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MOCK_API !== 'true') {
      setReady(true)
      return
    }
    let active = true
    startMocks().finally(() => active && setReady(true))
    return () => {
      active = false
    }
  }, [])

  if (!ready) return null
  return <>{children}</>
}
