@ignore @query
Feature: 列出子衛星清單

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT
    And 系統中存在至少一個 Satellite

  Rule: 後置（回應）- 回傳指定 Satellite 下所有 SubSatellite 的清單

  Rule: 後置（回應）- 該 Satellite 無 SubSatellite 時回傳空陣列

  # SubSatellite 欄位：名稱（name）、satellite_id（FK）
  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
