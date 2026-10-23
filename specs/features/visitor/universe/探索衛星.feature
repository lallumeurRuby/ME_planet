@ignore @query
Feature: 探索衛星
  # 公開讀取 API（不需 JWT），前台訪客與後台擁有者共用（取代原 admin/sub_satellite/列出子衛星.feature）

  Background:
    Given 3D 宇宙場景已完成載入
    And 場景中存在至少一個 Satellite

  Rule: 後置（回應）- 回傳指定 Satellite 下所有 SubSatellite 的清單，依建立時間由舊到新排序

  Rule: 後置（回應）- 該 Satellite 無 SubSatellite 時回傳空陣列

  Rule: 後置（錯誤）- 指定 Satellite 不存在時回傳 404 Not Found

  Rule: 後置（狀態）- 點擊 Satellite 後相機飛入該 Satellite 近景

  Rule: 後置（狀態）- 相機飛入後，該 Satellite 的 SubSatellite 環繞在周圍顯示

  # SubSatellite 欄位：名稱（name）、satellite_id（FK）
  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
