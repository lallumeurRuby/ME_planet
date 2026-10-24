from behave import when

from helpers.api import api_path
from helpers.values import parse_value


@when("擁有者登入後台：")
def step_when_login(context):
    row = context.table[0]
    context.last_response = context.api_client.post(
        api_path("/auth/login"),
        json={"password": parse_value(context, row["password"])},
    )
