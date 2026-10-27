@ignore @query
Feature: 查看ME星球
  # 公開讀取 API（不需 JWT），前台訪客與後台擁有者共用
  # 原文：「ME planet 也可以點擊跳出彈窗，內容一樣可以在後台設定」
  # ME Planet 只有單一一份內容，僅含 content（rich text），無標題（澄清 2026-10-27 Q1）

  Rule: 後置（回應）- 回傳 ME Planet 的單一內容（content、updated_at）

  Rule: 後置（回應）- 尚未設定或已清空 ME Planet 內容時回傳空內容
    # 回 200，content 為 null（不回 404）

  Rule: 後置（狀態）- 點擊 ME Planet 後相機不移動，直接以 Modal 彈出視窗呈現 ME Planet 內容
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 無 ME Planet 內容時 Modal 顯示空狀態
    # @frontend：Phase 06 驗證
