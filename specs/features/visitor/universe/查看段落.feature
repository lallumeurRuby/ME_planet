@ignore @query
Feature: 查看段落筆記

  Background:
    Given 3D 宇宙場景已完成載入
    And 已選取一個 SubSatellite
    And 該 SubSatellite 下存在至少一個 Paragraph

  Rule: 後置（回應）- 可取得並瀏覽該 SubSatellite 下所有 Paragraph 的內容

  Rule: 後置（狀態）- Paragraph 清單以 Modal 彈出視窗呈現（含標題、摘要、內容、建立日期）

  Rule: 後置（狀態）- 無 Paragraph 時 Modal 顯示空狀態
  # TODO(Phase-06): 空狀態的具體 UI 文字由 Frontend Build 決定

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
