from behave import when

from helpers.api import api_path, auth_headers
from helpers.values import resolve_id


@when('擁有者刪除衛星 "{satellite_id}"')
def step_when_delete_satellite(context, satellite_id):
    context.last_response = context.api_client.delete(
        api_path(f"/satellites/{resolve_id(context, satellite_id)}"),
        headers=auth_headers(context),
    )
