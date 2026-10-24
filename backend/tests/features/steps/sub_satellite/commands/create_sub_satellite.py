from behave import when

from helpers.api import api_path, auth_headers
from helpers.values import parse_value, resolve_id


@when("擁有者新增子衛星：")
def step_when_create_sub_satellite(context):
    row = context.table[0]
    satellite_id = resolve_id(context, row["satellite_id"])
    context.last_response = context.api_client.post(
        api_path(f"/satellites/{satellite_id}/sub-satellites"),
        headers=auth_headers(context),
        json={"name": parse_value(context, row["name"])},
    )
