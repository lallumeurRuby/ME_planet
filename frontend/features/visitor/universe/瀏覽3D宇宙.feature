@ignore @query
Feature: 瀏覽3D宇宙初始畫面
  # 資料來源：前端寫死的靜態內容資料（2026-10-27 改為靜態網站，取代 GET /satellites）

  Rule: 後置（回應）- 場景顯示靜態資料中的所有 Satellite，順序與靜態資料中撰寫的順序相同

  Rule: 後置（回應）- 靜態資料中無任何 Satellite 時，場景只顯示 ME Planet

  Rule: 後置（回應）- 進入網站後可載入 3D 宇宙場景（ME Planet + 所有 Satellite 環繞）
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 場景載入完成後自動慢速旋轉（idle 動畫）
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 場景顯示所有 Satellite
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- WebGL 不支援時顯示 fallback 畫面
    # @frontend：Phase 06 驗證

  # Satellite 欄位：名稱（name）
