@ignore @command
Feature: 進入後台管理介面

  Rule: 前置（身份）- 只有擁有者可以進入後台（密碼登入 + JWT）

  Rule: 前置（參數）- 密碼為必填，未提供時回傳 400 Bad Request

  Rule: 前置（鎖定）- 連續密碼錯誤 5 次後鎖定 15 分鐘，鎖定期間一律回傳 429 Too Many Requests

  Rule: 後置（狀態）- 密碼正確後發放 JWT（有效期 24 小時），可看到後台管理介面

  Rule: 後置（狀態）- 登入成功後連續錯誤次數歸零

  Rule: 後置（錯誤）- 密碼錯誤時拒絕進入，回傳 401 Unauthorized

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
