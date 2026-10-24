from behave import then


@then('操作失敗，狀態碼為 {status:d}，錯誤代碼為 "{code}"')
def step_then_failure(context, status, code):
    response = context.last_response
    assert response is not None, "尚未收到任何回應"
    assert (
        response.status_code == status
    ), f"預期狀態碼 {status}，實際 {response.status_code}：{response.text}"
    actual_code = response.json().get("code")
    assert actual_code == code, f"預期錯誤代碼 '{code}'，實際 '{actual_code}'"
