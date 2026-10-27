# Execution Plan — me-planet-modal-cascade-delete

> 產出日期：2026-10-27
> 起始狀態：Existing（沿用 me-planet-universe 已完成的 artifacts）
> 澄清紀錄：specs/clarify/2026-10-27-1000.md
> 需求：
> 1. 點擊 ME Planet 跳出 Modal，內容可在後台設定
> 2. 刪除 Satellite／SubSatellite 不再要求下層為空，確認對話框按下確認即刪除（cascade）

---

## 概覽

| 類型 | 數量 |
|------|------|
| Create | 7 |
| Modify | 16 |
| Delete | 0 |

---

## Phase 01: Discovery（已完成）

| 操作 | 目標 | 說明 |
|------|------|------|
| modify | specs/activities/前台展示流程.mmd | 新增 DECISION:1a（點擊對象）→ BRANCH:1a:ME Planet（相機不動，Modal 彈出） |
| modify | specs/activities/後台管理流程.mmd | 移除 D2b / D3b（下層為空判斷）；新增 STEP:5 查看 → STEP:6 編輯 ME Planet 內容 |
| modify | admin/satellite/刪除衛星.feature | 移除「前置（護欄）」與 409 Rule；新增 cascade Rule；確認對話框固定警告文字 |
| modify | admin/sub_satellite/刪除子衛星.feature | 同上（只連帶刪 Paragraph） |
| create | visitor/universe/查看ME星球.feature | @ignore @query，公開 GET |
| create | admin/me_planet/編輯ME星球內容.feature | @ignore @command，需 JWT |

---

## Phase 02: Entity Modeling

| 操作 | 目標 | 說明 |
|------|------|------|
| create | me_planet_content table | 單筆：content（text，nullable，rich text）、updated_at；無標題 |
| modify | Ref sub_satellites.satellite_id | `delete: restrict` → `delete: cascade` |
| modify | Ref paragraphs.sub_satellite_id | `delete: restrict` → `delete: cascade` |
| modify | satellites / sub_satellites Note | 移除「刪除前子資料必須為空，否則回 409」 |

---

## Phase 03: BDD Analysis

| 操作 | 目標 | 說明 |
|------|------|------|
| modify | 刪除衛星.feature | cascade Rule 補 Example（衛星、子衛星、段落三層皆消失；其他衛星不受影響） |
| modify | 刪除子衛星.feature | cascade Rule 補 Example（子衛星與段落消失；同衛星其他子衛星不受影響） |
| create | 查看ME星球.feature | 補 Example：有內容 / 從未設定 → content null / 已清空 |
| create | 編輯ME星球內容.feature | 補 Example：401 ×3、首次編輯即建立、覆蓋更新 + updated_at、送空白即清空 |
| modify | admin/satellite/句型.md、admin/sub_satellite/句型.md、系統抽象.md | 移除 HAS_CHILDREN 句型；新增 ME Planet 內容句型 |

---

## Phase 04: API Contract

| 操作 | 目標 | 說明 |
|------|------|------|
| modify | DELETE /satellites/{satelliteId} | 移除 409 HasChildren；description 註明 cascade |
| modify | DELETE /sub-satellites/{subSatelliteId} | 同上 |
| modify | components/responses/HasChildren、error code enum | 移除 HAS_CHILDREN |
| create | GET /me-planet | 公開；200 回 `{ content: string \| null, updated_at }` |
| create | PUT /me-planet | Bearer JWT；body `{ content }`（可空白）；不存在時建立（upsert），不回 404 |

---

## Phase 05: Backend TDD

| 操作 | 目標 | 說明 |
|------|------|------|
| modify | app/services/satellite_service.py、sub_satellite_service.py | 移除 HAS_CHILDREN 檢查，改為 cascade 刪除 |
| modify | app/models/sub_satellite.py、paragraph.py | FK ondelete RESTRICT → CASCADE |
| create | alembic migration | 變更兩條 FK ondelete；建立 me_planet_content 表 |
| create | ME Planet model / repository / service / schema / router | GET + PUT /me-planet |
| red-green-refactor | 刪除衛星、刪除子衛星、查看ME星球、編輯ME星球內容 .feature | TDD |

---

## Phase 06: Frontend Build

| 操作 | 目標 | 說明 |
|------|------|------|
| modify | src/scenes/universe/MePlanet.tsx | 加點擊事件 → 開啟 ME Planet Modal（相機不移動） |
| create | ME Planet Modal 元件 | 顯示 rich text 內容；content 為 null／空白時顯示空狀態 |
| modify | src/components/admin/AdminPage.tsx | 新增 ME Planet 內容編輯區（WYSIWYG）；刪除確認對話框改為固定警告文字；移除 HAS_CHILDREN 錯誤處理 |
| modify | src/lib/api/satellites.ts、sub-satellites.ts、lib/errors.ts、lib/types/error.schema.ts | 移除 HAS_CHILDREN |
| create | src/lib/api ME Planet client + zod schema | GET / PUT /me-planet |
| modify / create | src/mocks/handlers | 刪除改 cascade、新增 me-planet handlers |
| modify | frontend/layout.html | 原型同步（刪除對話框文案、ME Planet Modal） |

---

## Phase 07: Integration

| 操作 | 目標 | 說明 |
|------|------|------|
| verify | 前後台串接 | ME Planet 點擊 Modal ↔ GET；後台編輯 ↔ PUT；刪除 cascade 後前台 3D 場景同步消失 |
