@ignore @command
Feature: 刪除子衛星

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT
    And 系統中存在至少一個 SubSatellite

  Rule: 前置（確認）- 刪除前必須顯示確認對話框，使用者主動確認後才執行刪除

  Rule: 前置（護欄）- 只有 Paragraph 清單為空的 SubSatellite 才可刪除
    # 原文：「確保所屬下層資料為空才可以刪除」

  Rule: 後置（狀態）- 刪除成功後 SubSatellite 從清單消失

  Rule: 後置（錯誤）- Paragraph 清單非空時拒絕刪除，回傳 409 Conflict

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
