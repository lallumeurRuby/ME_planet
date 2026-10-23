@ignore @command
Feature: 探索子衛星

  Background:
    Given 3D 宇宙場景已完成載入
    And 已選取一個 Satellite
    And 該 Satellite 下存在至少一個 SubSatellite

  Rule: 後置（狀態）- 可看到該 Satellite 下的所有 SubSatellite

  Rule: 後置（狀態）- 點擊 SubSatellite 後彈出 Modal 視窗顯示該 SubSatellite 的 Paragraph 清單

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
