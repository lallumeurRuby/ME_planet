import * as data from '@/data/content'

import { createContentReader, findContentErrors } from './content-reader'

// 靜態匯出時頁面會在 build 期間執行此模組：資料有誤就讓 build 失敗
const errors = findContentErrors(data)
if (errors.length) throw new Error(`src/data/content.ts 資料有誤：\n- ${errors.join('\n- ')}`)

export const { listSatellites, listSubSatellites, listParagraphs, getMePlanetContent } = createContentReader(data)
