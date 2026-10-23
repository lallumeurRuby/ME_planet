@ignore @command
Feature: 新增段落

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT
    And 系統中存在至少一個 SubSatellite

  Rule: 前置（父層存在）- 目標 SubSatellite 必須存在

  Rule: 前置（欄位）- 標題（title）與內容（content）為必填；摘要（summary）為選填
  # content 格式：Rich text（WYSIWYG，後端儲存 HTML 或 JSON delta）
  # sub_satellite_id 為 FK，確認為父層關聯欄位，非自由標籤

  Rule: 後置（狀態）- 新增成功後 Paragraph 出現在該 SubSatellite 的清單中

  Rule: 後置（錯誤）- 必填欄位為空時拒絕建立，回傳 400 Bad Request

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
