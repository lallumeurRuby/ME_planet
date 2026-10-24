from behave import then


@then("操作成功")
def step_then_success(context):
    response = context.last_response
    assert response is not None, "尚未收到任何回應"
    assert response.status_code in (
        200,
        201,
        204,
    ), f"預期成功（200/201/204），實際 {response.status_code}：{response.text}"
