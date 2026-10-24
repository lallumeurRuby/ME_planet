from behave import then

from app.models.paragraph import Paragraph
from app.repositories.paragraph_repository import ParagraphRepository
from helpers.values import assert_time_matches, parse_value, resolve_id

_TIME_FIELDS = ("created_at", "updated_at")
_TEXT_FIELDS = ("title", "summary", "content")


def _mismatches(context, paragraph: Paragraph, row) -> list[str]:
    problems = []
    if "sub_satellite_id" in row.headings:
        expected = resolve_id(context, row["sub_satellite_id"])
        if paragraph.sub_satellite_id != expected:
            problems.append(f"sub_satellite_id 預期 {expected}，實際 {paragraph.sub_satellite_id}")
    for field in _TEXT_FIELDS:
        if field in row.headings:
            expected = parse_value(context, row[field])
            actual = getattr(paragraph, field)
            if actual != expected:
                problems.append(f"{field} 預期 {expected!r}，實際 {actual!r}")
    for field in _TIME_FIELDS:
        if field in row.headings:
            try:
                assert_time_matches(getattr(paragraph, field), row[field], field)
            except AssertionError as error:
                problems.append(str(error))
    return problems


@then("系統中應有以下段落：")
def step_then_paragraphs_exist(context):
    """包含即可（subset）；有 id 欄時以 id 比對同一筆，否則以 title 找出符合所有欄位的一筆。"""
    context.db_session.expire_all()
    repository = ParagraphRepository(context.db_session)
    for row in context.table:
        if "id" in row.headings:
            paragraph = repository.find_by_id(resolve_id(context, row["id"]))
            assert paragraph is not None, f"找不到段落 id={row['id']}"
            problems = _mismatches(context, paragraph, row)
            assert not problems, f"段落 {row['id']} 不符：" + "；".join(problems)
        else:
            candidates = repository.find_by_title(parse_value(context, row["title"]))
            assert any(
                not _mismatches(context, p, row) for p in candidates
            ), f"系統中沒有符合 {dict(zip(row.headings, row.cells))} 的段落"
