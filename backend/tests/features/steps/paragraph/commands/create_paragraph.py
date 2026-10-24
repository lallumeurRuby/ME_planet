from behave import when

from helpers.api import api_path, auth_headers
from helpers.values import parse_value, resolve_id


@when("擁有者新增段落：")
def step_when_create_paragraph(context):
    row = context.table[0]
    sub_satellite_id = resolve_id(context, row["sub_satellite_id"])
    context.last_response = context.api_client.post(
        api_path(f"/sub-satellites/{sub_satellite_id}/paragraphs"),
        headers=auth_headers(context),
        json={field: parse_value(context, row[field]) for field in ("title", "summary", "content")},
    )
