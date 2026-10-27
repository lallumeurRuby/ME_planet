from behave import when

from helpers.api import api_path, auth_headers
from helpers.values import parse_value


@when("擁有者編輯ME星球內容：")
def step_when_update_me_planet_content(context):
    row = context.table[0]
    context.last_response = context.api_client.put(
        api_path("/me-planet"),
        headers=auth_headers(context),
        json={"content": parse_value(context, row["content"])},
    )
