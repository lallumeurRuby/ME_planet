from behave import then


@then("查詢結果應為空清單")
def step_then_query_result_empty(context):
    data = context.last_response.json()
    assert data == [], f"預期空清單，實際 {data}"
