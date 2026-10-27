from behave import when

from helpers.api import api_path


@when("查詢ME星球內容")
def step_when_get_me_planet_content(context):
    context.last_response = context.api_client.get(api_path("/me-planet"))
