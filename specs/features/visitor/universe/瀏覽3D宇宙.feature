@ignore @query
Feature: 瀏覽3D宇宙初始畫面
  # 公開讀取 API（不需 JWT），前台訪客與後台擁有者共用（取代原 admin/satellite/列出衛星.feature）

  Rule: 後置（回應）- 回傳所有 Satellite 的清單，依建立時間由舊到新排序

  Rule: 後置（回應）- 無任何 Satellite 時回傳空陣列

  Rule: 後置（回應）- 進入網站後可載入 3D 宇宙場景（ME Planet + 所有 Satellite 環繞）

  Rule: 後置（狀態）- 場景載入完成後自動慢速旋轉（idle 動畫）

  Rule: 後置（狀態）- 場景顯示所有 Satellite

  Rule: 後置（狀態）- WebGL 不支援時顯示 fallback 畫面

  # Satellite 欄位：名稱（name）
  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
