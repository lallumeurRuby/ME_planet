# Execution Plan — me-planet-universe

> 產出日期：2026-10-23
> 起始狀態：Greenfield（空）
> Delta 類型：全部 create

---

## 概覽

| 類型 | 數量 |
|------|------|
| Create | 18 |
| Modify | 0 |
| Delete | 0 |

---

## Phase 02: Entity Modeling

| 操作 | 目標 | 說明 |
|------|------|------|
| create | Satellite table | 知識領域實體，欄位待澄清（至少 id, name） |
| create | SubSatellite table | 子分類知識實體，FK → Satellite，欄位待澄清 |
| create | Paragraph table | 學習筆記/成果實體，FK → SubSatellite，欄位待澄清（至少 id, content） |
| create | 刪除護欄約束 | Satellite/SubSatellite 刪除前需子資料為空（NOT cascade delete） |

---

## Phase 03: BDD Analysis

| 操作 | 目標 | 說明 |
|------|------|------|
| create | admin/satellite/ domain | Satellite CRUD 的 BDD 規格（含刪除護欄） |
| create | admin/sub_satellite/ domain | SubSatellite CRUD 的 BDD 規格（含刪除護欄） |
| create | admin/paragraph/ domain | Paragraph CRUD 的 BDD 規格 |
| create | visitor/universe/ domain | 3D 前台的互動瀏覽規格 |

---

## Phase 04: API Contract

| 操作 | 目標 | 說明 |
|------|------|------|
| create | POST /satellites | 建立 Satellite |
| create | GET /satellites | 列出所有 Satellite |
| create | PUT/PATCH /satellites/{id} | 編輯 Satellite |
| create | DELETE /satellites/{id} | 刪除 Satellite（護欄：子資料非空則 409） |
| create | POST /satellites/{id}/sub-satellites | 建立 SubSatellite |
| create | GET /satellites/{id}/sub-satellites | 列出 SubSatellite |
| create | PUT/PATCH /sub-satellites/{id} | 編輯 SubSatellite |
| create | DELETE /sub-satellites/{id} | 刪除 SubSatellite（護欄：Paragraph 非空則 409） |
| create | POST /sub-satellites/{id}/paragraphs | 建立 Paragraph |
| create | GET /sub-satellites/{id}/paragraphs | 列出 Paragraph |
| create | PUT/PATCH /paragraphs/{id} | 編輯 Paragraph |
| create | DELETE /paragraphs/{id} | 刪除 Paragraph |

---

## Phase 05–07: Implementation

| 操作 | 目標 | 說明 |
|------|------|------|
| red-green-refactor | admin/satellite/*.feature | Satellite CRUD 的 BDD TDD |
| red-green-refactor | admin/sub_satellite/*.feature | SubSatellite CRUD 的 BDD TDD |
| red-green-refactor | admin/paragraph/*.feature | Paragraph CRUD 的 BDD TDD |
| red-green-refactor | visitor/universe/*.feature | 前台讀取 API 的 BDD TDD |

---

## IMPL_IMPACT（由 Phase 02–04 Reconciler 回填）

| Phase | 影響目標 | Impact Type | 來源 | 說明 |
|-------|---------|-------------|------|------|
| — | — | — | — | Greenfield，全部新建，Phase 02–04 完成後回填 |
