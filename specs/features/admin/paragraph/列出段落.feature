@ignore @query
Feature: 列出段落清單

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT
    And 系統中存在至少一個 SubSatellite

  Rule: 後置（回應）- 回傳指定 SubSatellite 下所有 Paragraph 的清單

  Rule: 後置（回應）- 該 SubSatellite 無 Paragraph 時回傳空陣列

  # Paragraph 欄位：標題（title）、摘要（summary）、內容（content）、建立日期（created_at）、sub_satellite_id（FK）
  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
