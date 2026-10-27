@ignore @query
Feature: 查看段落筆記
  # 資料來源：前端寫死的靜態內容資料（2026-10-27 改為靜態網站，取代 GET /sub-satellites/{id}/paragraphs）

  Rule: 後置（回應）- 顯示指定 SubSatellite 下所有 Paragraph，順序與靜態資料中撰寫的順序相同（建立日期 created_at 僅用於顯示，不影響排序）

  Rule: 後置（回應）- 該 SubSatellite 無 Paragraph 時，Modal 顯示空狀態

  Rule: 前置（狀態）- 靜態資料中每個 Paragraph 所屬的 SubSatellite 必須存在，否則 build 失敗並指出引用錯誤的 Paragraph

  Rule: 後置（狀態）- 點擊 SubSatellite 後以 Modal 彈出視窗呈現 Paragraph 清單（含標題、摘要、內容、建立日期）
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 無 Paragraph 時 Modal 顯示空狀態
    # @frontend：Phase 06 驗證
    # TODO(Phase-06): 空狀態的具體 UI 文字由 Frontend Build 決定

  # Paragraph 欄位：標題（title）、摘要（summary，可為空）、內容（content，HTML）、建立日期（created_at）
