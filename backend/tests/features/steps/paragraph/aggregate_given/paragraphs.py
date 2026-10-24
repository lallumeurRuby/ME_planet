from behave import given

from app.models.paragraph import Paragraph
from app.repositories.paragraph_repository import ParagraphRepository
from helpers.values import parse_time, parse_value, resolve_id


@given("系統中有以下段落：")
def step_given_paragraphs(context):
    """summary 省略＝null；updated_at 省略＝created_at。"""
    repository = ParagraphRepository(context.db_session)
    for row in context.table:
        created_at = parse_time(row["created_at"])
        updated_at = parse_time(row["updated_at"]) if "updated_at" in row.headings else created_at
        summary = parse_value(context, row["summary"]) if "summary" in row.headings else None
        paragraph = repository.save(
            Paragraph(
                sub_satellite_id=resolve_id(context, row["sub_satellite_id"]),
                title=row["title"],
                summary=summary,
                content=row["content"],
                created_at=created_at,
                updated_at=updated_at,
            )
        )
        context.ids[row["title"]] = paragraph.id
