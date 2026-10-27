@ignore @query
Feature: 探索衛星
  # 資料來源：前端寫死的靜態內容資料（2026-10-27 改為靜態網站，取代 GET /satellites/{id}/sub-satellites）

  Rule: 後置（回應）- 顯示指定 Satellite 下所有 SubSatellite，順序與靜態資料中撰寫的順序相同

  Rule: 後置（回應）- 該 Satellite 無 SubSatellite 時，相機飛入後周圍不顯示任何 SubSatellite

  Rule: 前置（狀態）- 靜態資料中每個 SubSatellite 所屬的 Satellite 必須存在，否則 build 失敗並指出引用錯誤的 SubSatellite

  Rule: 後置（狀態）- 點擊 Satellite 後相機飛入該 Satellite 近景
    # @frontend：Phase 06 驗證

  Rule: 後置（狀態）- 相機飛入後，該 Satellite 的 SubSatellite 環繞在周圍顯示
    # @frontend：Phase 06 驗證

  # SubSatellite 欄位：名稱（name）、所屬 Satellite
