from behave import when

from helpers.api import api_path, auth_headers
from helpers.values import parse_value, resolve_id


@when("擁有者編輯段落：")
def step_when_update_paragraph(context):
    row = context.table[0]
    paragraph_id = resolve_id(context, row["paragraph_id"])
    context.last_response = context.api_client.put(
        api_path(f"/paragraphs/{paragraph_id}"),
        headers=auth_headers(context),
        json={field: parse_value(context, row[field]) for field in ("title", "summary", "content")},
    )
