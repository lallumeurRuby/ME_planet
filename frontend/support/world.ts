import { World, IWorldOptions } from '@cucumber/cucumber'
import { Browser, BrowserContext, Page } from '@playwright/test'

import type { Content } from '../src/lib/content-reader'
// Worker adds Page Object imports here:

export class AppWorld extends World {
  // 瀏覽器只在 @e2e 情境啟動（見 hooks.ts）
  browser?: Browser
  context?: BrowserContext
  page?: Page

  /** 每個 Example 從空的靜態資料開始，由 Given 填入 */
  content: Content = { satellites: [], subSatellites: [], paragraphs: [], mePlanetContent: { content: null } }
  result: unknown

  // Worker adds Page Object properties here:

  constructor(options: IWorldOptions) {
    super(options)
  }
}
