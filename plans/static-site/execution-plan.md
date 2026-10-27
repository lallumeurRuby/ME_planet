# Execution Plan — static-site

> 產出日期：2026-10-27
> 起始狀態：Existing（沿用 me-planet-modal-cascade-delete 已完成的 artifacts）
> 分支：feature/static-site
> 澄清紀錄：specs/clarify/2026-10-27-1607.md
> 需求：拿掉後台與後端資料庫，前台內容全部寫死在前端，改為靜態網站（方案 1）

---

## 概覽

| 類型 | 數量 |
|------|------|
| Create | 4 |
| Modify | 14 |
| Delete | 9（目錄／檔案群組） |

---

## Phase 01: Discovery（已完成）

| 操作 | 目標 | 說明 |
|------|------|------|
| delete | specs/activities/後台管理流程.mmd | 後台流程整個移除 |
| delete | specs/actors/擁有者.md | 無後台，Owner Actor 消失 |
| delete | backend/tests/features/admin/** | 11 支 command feature + 5 份句型.md |
| modify | specs/activities/前台展示流程.mmd | 流程不變；標頭註記資料來源為前端靜態資料 |
| modify | specs/actors/訪客.md | 註記網站為靜態網站、無後台 |
| modify | specs/arguments.yml | FEATURE_SPECS_DIR → ${FRONTEND_DIR}/features |
| modify | 4 支 visitor/universe/*.feature | 搬至 frontend/features/visitor/universe/；API 層 Rule 改寫為靜態資料 Rule，標記 @ignore，移除 API 層 Example |

已決議的規則（詳見澄清紀錄）：
- 衛星、子衛星、段落一律依靜態資料撰寫順序顯示；段落 created_at 僅顯示用
- 原「不存在回 404」改為 build 時的資料一致性檢查（子衛星→衛星、段落→子衛星引用必須存在）
- 空狀態保留：無衛星時只顯示 ME Planet；ME Planet 內容留空時 Modal 顯示空狀態
- 段落與 ME Planet 皆移除 updated_at

## Phase 02: Entity Modeling

| 操作 | 目標 | 說明 |
|------|------|------|
| delete | specs/entity/erm.dbml | 無資料庫 |
| modify | frontend/src/lib/types/*.schema.ts | 移除 auth.schema.ts；Satellite／SubSatellite 移除 created_at；Paragraph 移除 updated_at；MePlanetContent 只留 content |

## Phase 03: BDD Analysis

| 操作 | 目標 | 說明 |
|------|------|------|
| modify | frontend/features/visitor/universe/*.feature | 依新 Rule 補 Example（Given 改為「靜態資料中有以下衛星」等句型），移除 @ignore |
| create | frontend/features/visitor/universe/句型.md | 由 backend 版本改寫為靜態資料句型（含一致性檢查句型） |
| delete | backend/tests/features/系統抽象.md、visitor/universe/句型.md | 隨 backend/ 一併移除（內容已改寫至前端） |

## Phase 04: API Contract

| 操作 | 目標 | 說明 |
|------|------|------|
| delete | specs/api/api.yml | 無 HTTP API |

## Phase 05: Backend

| 操作 | 目標 | 說明 |
|------|------|------|
| create | git tag backend-final | 打在 develop 4b26c69（最後一個含完整後端的 commit） |
| delete | backend/ | 整個目錄（需要時 `git checkout backend-final -- backend` 取回） |

## Phase 06: Frontend Build

| 操作 | 目標 | 說明 |
|------|------|------|
| create | frontend/src/data/content.ts | 由 mocks/fixtures.ts 搬入示範資料，依新型別調整；陣列順序即顯示順序 |
| create | 靜態資料一致性檢查 | build 前執行，引用不存在的衛星／子衛星時失敗並指出錯誤資料 |
| modify | frontend/src/lib/api/{satellites,sub-satellites,paragraphs,me-planet}.ts | 只保留讀取函式，改為回傳靜態資料；移除 create／update／delete |
| delete | frontend/src/lib/api/{auth,client}.ts、lib/errors.ts（ApiClientError 依賴） | 無 HTTP 呼叫 |
| delete | frontend/src/components/admin/**、app/(protected)/**、app/(public)/admin/** | 後台頁面 |
| delete | frontend/src/mocks/**、components/MSWProvider.tsx、public/mockServiceWorker.js、msw 套件 | 不再需要 mock |
| modify | frontend/src/app/layout.tsx | 移除 MSWProvider |
| modify | frontend/src/components/universe/{UniversePage,MePlanetModal,ParagraphModal}.tsx | 視需要移除 loading／錯誤狀態（資料同步可得）；空狀態依 Rule 保留 |
| modify | frontend/next.config.mjs | 移除 /api rewrites；output: 'export' |
| modify | frontend/.env.* | 移除 NEXT_PUBLIC_MOCK_API、NEXT_PUBLIC_API_BASE_URL、BACKEND_URL |

## Phase 07: Frontend E2E

| 操作 | 目標 | 說明 |
|------|------|------|
| modify | frontend/support/*、steps/ | 移除 MSW／route 相關 helper；E2E 直接對靜態 build 執行 4 支 visitor feature |

## Phase 08: Integration

| 操作 | 目標 | 說明 |
|------|------|------|
| verify | next build | 產出純靜態 out/，無 /api 請求 |
| create | Vercel 部署 | 連結 GitHub repo（lallumeurRuby/ME_planet），根路徑，不需 basePath |
| modify | 專案文件 | 移除後端啟動、seed、docker-compose 相關說明 |
