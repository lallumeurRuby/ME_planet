from behave import when

from helpers.api import api_path, auth_headers
from helpers.values import resolve_id


@when('擁有者刪除段落 "{paragraph_id}"')
def step_when_delete_paragraph(context, paragraph_id):
    context.last_response = context.api_client.delete(
        api_path(f"/paragraphs/{resolve_id(context, paragraph_id)}"),
        headers=auth_headers(context),
    )
