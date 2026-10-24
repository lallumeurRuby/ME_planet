from behave import given


@given('擁有者的 JWT 狀態為 "{jwt_state}"')
def step_given_jwt_state(context, jwt_state):
    """覆蓋 `擁有者已登入` 取得的 token：未帶 / 已過期 / 無效。"""
    tokens = {
        "未帶": lambda: None,
        "已過期": context.jwt_helper.generate_expired_token,
        "無效": context.jwt_helper.generate_invalid_token,
    }
    if jwt_state not in tokens:
        raise ValueError(f"未知的 JWT 狀態：{jwt_state}（可用：{'、'.join(tokens)}）")
    context.memo["jwt"] = tokens[jwt_state]()
