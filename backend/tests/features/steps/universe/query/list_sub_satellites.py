from behave import when

from helpers.api import api_path
from helpers.values import resolve_id


@when('查詢衛星 "{satellite_id}" 的子衛星清單')
def step_when_list_sub_satellites(context, satellite_id):
    context.last_response = context.api_client.get(
        api_path(f"/satellites/{resolve_id(context, satellite_id)}/sub-satellites")
    )
