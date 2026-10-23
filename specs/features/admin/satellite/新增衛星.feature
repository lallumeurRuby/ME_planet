@ignore @command
Feature: 新增衛星

  Background:
    Given 擁有者已以密碼登入並取得有效 JWT

  Rule: 前置（欄位）- 名稱（name）為必填

  Rule: 後置（狀態）- 新增成功後 Satellite 出現在清單中

  Rule: 後置（錯誤）- 必填欄位為空時拒絕建立，回傳 400 Bad Request

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待澄清後補充。
