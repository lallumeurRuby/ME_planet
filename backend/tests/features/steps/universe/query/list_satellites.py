from behave import when

from helpers.api import api_path


@when("查詢衛星清單")
def step_when_list_satellites(context):
    context.last_response = context.api_client.get(api_path("/satellites"))
