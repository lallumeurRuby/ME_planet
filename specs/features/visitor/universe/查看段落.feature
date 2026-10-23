@ignore @query
Feature: 查看段落筆記
  # 公開讀取 API（不需 JWT），前台訪客與後台擁有者共用（取代原 admin/paragraph/列出段落.feature）

  Background:
    Given 3D 宇宙場景已完成載入
    And 已選取一個 Satellite
    And 該 Satellite 下存在至少一個 SubSatellite

  Rule: 後置（回應）- 回傳指定 SubSatellite 下所有 Paragraph 的清單，依建立時間由新到舊排序

  Rule: 後置（回應）- 該 SubSatellite 無 Paragraph 時回傳空陣列

  Rule: 後置（錯誤）- 指定 SubSatellite 不存在時回傳 404 Not Found

  Rule: 後置（狀態）- 點擊 SubSatellite 後以 Modal 彈出視窗呈現 Paragraph 清單（含標題、摘要、內容、建立日期）

  Rule: 後置（狀態）- 無 Paragraph 時 Modal 顯示空狀態
  # TODO(Phase-06): 空狀態的具體 UI 文字由 Frontend Build 決定

  # Paragraph 欄位：標題（title）、摘要（summary）、內容（content）、建立日期（created_at）、更新日期（updated_at）、sub_satellite_id（FK）
  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
