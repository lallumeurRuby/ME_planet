@ignore @command
Feature: 探索衛星

  Background:
    Given 3D 宇宙場景已完成載入
    And 場景中存在至少一個 Satellite

  Rule: 後置（狀態）- 點擊 Satellite 後相機飛入該 Satellite 近景

  Rule: 後置（狀態）- 相機飛入後，該 Satellite 的 SubSatellite 環繞在周圍顯示

  Rule: 後置（狀態）- 可取得該 Satellite 下的 SubSatellite 清單

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
