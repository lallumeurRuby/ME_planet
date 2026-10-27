import { Before, After, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber'
import { chromium } from '@playwright/test'
import { AppWorld } from './world'
// Worker adds Page Object imports here:

setWorldConstructor(AppWorld)
setDefaultTimeout(30000)

// 靜態資料的情境不需要瀏覽器；只有 @e2e 情境對 build 好的網站（BASE_URL）執行
Before({ tags: '@e2e' }, async function (this: AppWorld) {
  this.browser = await chromium.launch({ headless: true })
  this.context = await this.browser.newContext({ baseURL: process.env.BASE_URL ?? 'http://localhost:3000' })
  this.page = await this.context.newPage()

  // Worker adds Page Object instantiation here:
})

After({ tags: '@e2e' }, async function (this: AppWorld) {
  await this.browser?.close()
})
