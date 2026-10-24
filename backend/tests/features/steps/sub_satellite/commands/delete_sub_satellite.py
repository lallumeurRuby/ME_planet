from behave import when

from helpers.api import api_path, auth_headers
from helpers.values import resolve_id


@when('擁有者刪除子衛星 "{sub_satellite_id}"')
def step_when_delete_sub_satellite(context, sub_satellite_id):
    context.last_response = context.api_client.delete(
        api_path(f"/sub-satellites/{resolve_id(context, sub_satellite_id)}"),
        headers=auth_headers(context),
    )
