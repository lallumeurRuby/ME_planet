from behave import when

from helpers.api import api_path
from helpers.values import resolve_id


@when('查詢子衛星 "{sub_satellite_id}" 的段落清單')
def step_when_list_paragraphs(context, sub_satellite_id):
    context.last_response = context.api_client.get(
        api_path(f"/sub-satellites/{resolve_id(context, sub_satellite_id)}/paragraphs")
    )
