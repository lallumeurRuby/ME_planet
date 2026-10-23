@ignore @command
Feature: 進入後台管理介面

  Rule: 前置（身份）- 只有擁有者可以進入後台（密碼登入 + JWT）

  Rule: 後置（狀態）- 密碼正確後發放 JWT，可看到後台管理介面

  Rule: 後置（錯誤）- 密碼錯誤時拒絕進入，回傳 401 Unauthorized
  # 重試次數限制：Phase 03 決定

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
