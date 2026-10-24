from behave import when

from helpers.api import api_path, auth_headers
from helpers.values import parse_value


@when("擁有者新增衛星：")
def step_when_create_satellite(context):
    row = context.table[0]
    context.last_response = context.api_client.post(
        api_path("/satellites"),
        headers=auth_headers(context),
        json={"name": parse_value(context, row["name"])},
    )
