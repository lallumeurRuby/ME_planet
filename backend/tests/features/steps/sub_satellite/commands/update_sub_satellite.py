from behave import when

from helpers.api import api_path, auth_headers
from helpers.values import parse_value, resolve_id


@when("擁有者編輯子衛星：")
def step_when_update_sub_satellite(context):
    row = context.table[0]
    sub_satellite_id = resolve_id(context, row["sub_satellite_id"])
    context.last_response = context.api_client.put(
        api_path(f"/sub-satellites/{sub_satellite_id}"),
        headers=auth_headers(context),
        json={"name": parse_value(context, row["name"])},
    )
