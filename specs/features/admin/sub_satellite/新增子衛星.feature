@ignore @command
Feature: 新增子衛星

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT
    And 系統中存在至少一個 Satellite

  Rule: 前置（父層存在）- 目標 Satellite 必須存在

  Rule: 前置（欄位）- 名稱（name）為必填

  Rule: 後置（狀態）- 新增成功後 SubSatellite 出現在該 Satellite 的清單中

  Rule: 後置（錯誤）- 必填欄位為空時拒絕建立，回傳 400 Bad Request

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
