@ignore @command
Feature: 編輯ME星球內容
  # 原文：「ME planet 也可以點擊跳出彈窗，內容一樣可以在後台設定」
  # ME Planet 只有單一一份內容，後台只能編輯，不能新增或刪除（澄清 2026-10-27 Q1）

  Rule: 前置（身份）- 未帶 JWT 或 JWT 無效／過期（有效期 24 小時）時拒絕操作，回傳 401 Unauthorized

  Rule: 前置（欄位）- 只有內容（content）一個欄位，格式為 rich text（WYSIWYG），無標題

  Rule: 前置（欄位）- 內容（content）為選填，允許送空白；送空白即清空 ME Planet 內容（前台 Modal 顯示空狀態）

  Rule: 後置（狀態）- 編輯成功後 ME Planet 內容更新，更新日期（updated_at）同步更新

  Rule: 後置（狀態）- 從未設定過內容時，第一次編輯即建立該份內容（整份覆蓋，不回 404）
