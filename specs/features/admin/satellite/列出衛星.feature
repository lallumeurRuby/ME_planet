@ignore @query
Feature: 列出衛星清單

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT

  Rule: 後置（回應）- 回傳所有 Satellite 的清單

  Rule: 後置（回應）- 清單為空時回傳空陣列

  # Satellite 欄位：名稱（name）
  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
