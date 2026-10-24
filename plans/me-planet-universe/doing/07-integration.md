# Phase 07: Integration Validation ★

## 審查進度

- [ ] 07.1 相關規格已審查 — **簽名**: ___
- [ ] 07.2 交付物已審查 — **簽名**: ___

## 目的 (What)

驗證前端（Phase 06）與後端（Phase 05）透過真實 HTTP 連線能正確協作。

**這不是「加一個檢查」— 這是正式的 Phase**，有完整的 2 步審查。

來源：從 CRM 專案 6 個整合問題中提煉的 architectural fix。
兩條獨立 track 各自通過測試 ≠ 合在一起能跑。

核心動作：前端關閉 MSW mock → rewrite proxy → 打真實後端 API。

**IMPL_IMPACT 感知**：若 Phase 05 或 Phase 06 有任何 Targeted Fix，Phase 07 自動觸發完整重驗（不可跳過）。Targeted Fix 改了前後端的局部，整合驗證確認局部修復沒有破壞全局。

**依賴**：Phase 05 + Phase 06 都必須在 `done/` 中。

## 相關規格

| # | 規格 | 來源 | 說明 |
|---|------|------|------|
| 1 | api.yml | Phase 04 | 契約 = 驗證基準 |
| 2 | Chrome Test Guard 測試計畫 | Phase 06 | 同一份測試計畫，換 real backend 重跑 |

## 交付物

carry-on Step 07.2 觸發時：

### 1. 啟動後端

```bash
# 方式 A: Docker
docker-compose up -d

# 方式 B: venv
source venv/bin/activate && uvicorn app.main:app --port 8000
```

健康檢查：`curl http://localhost:8000/health`

### 2. 前端環境切換

修改 `/Users/peiruwu/Desktop/Portfolio/ME_planet/frontend/.env.development`：
```
NEXT_PUBLIC_MOCK_API=false
BACKEND_URL=http://localhost:8000
```

### 3. 驗證矩陣（5 項）

詳見 `references/integration-matrix.md`。

| # | 驗證項目 | 方法 |
|---|---------|------|
| 1 | Response envelope 格式 | 打 API → 檢查 `{success, data/error}` 結構 |
| 2 | 欄位名一致性 | 前端 type vs 後端 response vs api.yml |
| 3 | Auth flow | login → cookie → authenticated request |
| 4 | Query params 完整性 | 前端傳參 vs 後端接參 |
| 5 | Error handling | 觸發 4xx/5xx → 前端正確顯示 |

### 4. Chrome E2E 重跑

用 Chrome E2E 重跑 Phase 06 的 Chrome Test Guard 測試計畫（real backend mode）。

### 5. 問題修正迴圈

發現問題 → 定位（前端 / 後端 / 契約）→ 修正 → 重跑 → 直到全部通過。

| # | 交付物 | 路徑 | 狀態 |
|---|--------|------|------|
| 07.1 | Chrome E2E 結果（real backend） | 全通過 | PENDING |
| 07.2 | 驗證矩陣通過紀錄 | 5/5 全通過 | PENDING |

### 驗收點

- [ ] 後端啟動且健康檢查通過
- [ ] 前端 `MOCK_API=false` 且 rewrite proxy 正確
- [ ] 驗證矩陣 5 項全部通過
- [ ] Chrome E2E real 模式全數通過

## 驗證紀錄（2026-10-24）

環境：Postgres `me-planet-api-postgres`（5433）＋ uvicorn（8000）＋ Next dev（3001，`NEXT_PUBLIC_MOCK_API=false`，rewrite `/api/*` → 8000）；示範資料由 `backend/scripts/seed.py --demo` 灌入。

### 驗證矩陣

| # | 項目 | 結果 | 說明 |
|---|------|------|------|
| 1 | 回應格式 | ✅ | 依 api.yml（非卡片原寫的 envelope）：成功直接回資源／陣列，錯誤 `{ code, message }` |
| 2 | 欄位名一致性 | ✅ | `id / satellite_id / sub_satellite_id / name / title / summary / content / created_at / updated_at` 與 api.yml、前端 Zod 型別一致 |
| 3 | Auth flow | ✅ | 401（未帶 / 無效 / 假 token）、400 空密碼、401 錯誤密碼；前端收到 401 → 清 cookie → 導回登入頁 |
| 4 | Query params | ✅（不適用） | api.yml 只有 path params，前後端一致 |
| 5 | Error handling | ✅（修正後） | 400 / 404 / 409 皆正確顯示；**發現並修正**：缺欄位原回 FastAPI 422 → 改為 400 `REQUIRED_FIELD_EMPTY` |

### Chrome E2E（real backend）

前台 #1–#6、後台 #7–#13 全數通過（寫入測試只操作測試期間新建的資料，結束後已清除）。

未在 real 模式執行：
- 正確密碼登入：擁有者使用自己的密碼，由擁有者手動驗證；寫入流程改以本機開發密鑰簽發的 1 小時測試 JWT 驗證
- #14 連錯 5 次鎖定：會鎖住擁有者帳號 15 分鐘，由後端 BDD（進入後台.feature）覆蓋

### 整合時發現並修正的問題

| 問題 | 層 | 修正 |
|------|----|------|
| uvicorn 直接啟動時沒有建立 DB 連線（只有測試環境注入 session factory） | 後端 | `get_session_factory()` 依 `DATABASE_URL` 延遲建立 |
| 缺欄位回 422，違反 api.yml | 後端 | `RequestValidationError` → 400 `REQUIRED_FIELD_EMPTY` |
| 無法設定擁有者密碼 | 後端 | 新增 `scripts/seed.py --owner-password`（互動輸入）／`--demo` |
| compose 專案名稱與其他本機專案衝突（誤重建 specbeacon-postgres，已恢復，資料無損） | 環境 | `docker-compose.yml` 固定 `name: me-planet`、具名 volume、埠 5433 |
