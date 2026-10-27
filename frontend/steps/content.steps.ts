import assert from 'node:assert/strict'

import { Given, Then, When } from '@cucumber/cucumber'
import type { DataTable } from '@cucumber/cucumber'

import { createContentReader, findContentErrors } from '../src/lib/content-reader'
import { parseDataTable } from '../support/parse-helpers'
import type { AppWorld } from '../support/world'

// 表格中的 "null" 代表 null
const nullable = (value: string): string | null => (value === 'null' ? null : value)
const reader = (world: AppWorld) => createContentReader(world.content)

Given('靜態資料中有以下衛星：', function (this: AppWorld, table: DataTable) {
  for (const row of parseDataTable(table)) this.content.satellites.push({ id: Number(row.id), name: row.name })
})

Given('靜態資料中有以下子衛星：', function (this: AppWorld, table: DataTable) {
  for (const row of parseDataTable(table))
    this.content.subSatellites.push({ id: Number(row.id), satellite_id: Number(row.satellite_id), name: row.name })
})

Given('靜態資料中有以下段落：', function (this: AppWorld, table: DataTable) {
  for (const row of parseDataTable(table))
    this.content.paragraphs.push({
      id: Number(row.id),
      sub_satellite_id: Number(row.sub_satellite_id),
      title: row.title,
      summary: nullable(row.summary),
      content: row.content,
      created_at: row.created_at,
    })
})

Given('ME星球內容為：', function (this: AppWorld, table: DataTable) {
  const [row] = parseDataTable(table)
  this.content.mePlanetContent = { content: nullable(row.content) }
})

When('讀取衛星清單', function (this: AppWorld) {
  this.result = reader(this).listSatellites()
})

When('讀取衛星 {int} 的子衛星清單', function (this: AppWorld, satelliteId: number) {
  this.result = reader(this).listSubSatellites(satelliteId)
})

When('讀取子衛星 {int} 的段落清單', function (this: AppWorld, subSatelliteId: number) {
  this.result = reader(this).listParagraphs(subSatelliteId)
})

When('讀取ME星球內容', function (this: AppWorld) {
  this.result = reader(this).getMePlanetContent()
})

When('檢查靜態資料', function (this: AppWorld) {
  this.result = findContentErrors(this.content)
})

/** 只比對表頭列出的欄位；列的順序即預期順序 */
const pick = (item: Record<string, unknown>, keys: string[]) =>
  Object.fromEntries(keys.map((key) => [key, item[key] === null ? null : String(item[key])]))

Then('結果應依序為：', function (this: AppWorld, table: DataTable) {
  const expected = parseDataTable(table).map((row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k, nullable(v)])))
  const keys = Object.keys(expected[0])
  assert.deepEqual((this.result as Record<string, unknown>[]).map((item) => pick(item, keys)), expected)
})

Then('結果應為空清單', function (this: AppWorld) {
  assert.deepEqual(this.result, [])
})

Then('結果應為：', function (this: AppWorld, table: DataTable) {
  const [row] = parseDataTable(table)
  const expected = Object.fromEntries(Object.entries(row).map(([k, v]) => [k, nullable(v)]))
  assert.deepEqual(pick(this.result as Record<string, unknown>, Object.keys(expected)), expected)
})

Then('ME星球內容應為空', function (this: AppWorld) {
  assert.ok(!(this.result as { content: string | null }).content)
})

Then('資料檢查應通過', function (this: AppWorld) {
  assert.deepEqual(this.result, [])
})

Then('資料檢查應失敗，錯誤為「{}」', function (this: AppWorld, message: string) {
  assert.deepEqual(this.result, [message])
})
