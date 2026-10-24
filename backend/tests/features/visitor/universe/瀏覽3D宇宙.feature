@query
Feature: 瀏覽3D宇宙初始畫面
  # 公開讀取 API（不需 JWT），前台訪客與後台擁有者共用（取代原 admin/satellite/列出衛星.feature）

  Rule: 後置（回應）- 回傳所有 Satellite 的清單，依建立時間由舊到新排序

    Example: 依建立時間由舊到新列出所有衛星
      Given 系統中有以下衛星：
        | name     | created_at       |
        | 程式設計 | 2026-01-02 00:00 |
        | 天文     | 2026-01-01 00:00 |
        | 音樂     | 2026-01-03 00:00 |
      When 查詢衛星清單
      Then 操作成功
      And 查詢結果應依序為：
        | name     |
        | 天文     |
        | 程式設計 |
        | 音樂     |

  Rule: 後置（回應）- 無任何 Satellite 時回傳空陣列

    Example: 沒有衛星時回傳空清單
      When 查詢衛星清單
      Then 操作成功
      And 查詢結果應為空清單

  Rule: 後置（回應）- 進入網站後可載入 3D 宇宙場景（ME Planet + 所有 Satellite 環繞）
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 場景載入完成後自動慢速旋轉（idle 動畫）
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 場景顯示所有 Satellite
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- WebGL 不支援時顯示 fallback 畫面
    # @frontend：Phase 06 驗證

  # Satellite 欄位：名稱（name）
