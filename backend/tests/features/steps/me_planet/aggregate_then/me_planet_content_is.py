from behave import then

from app.repositories.me_planet_content_repository import MePlanetContentRepository
from helpers.values import assert_time_matches, parse_value


@then("ME星球內容應為：")
def step_then_me_planet_content_is(context):
    """單列；同時斷言系統中恰有一筆 ME星球內容。"""
    context.db_session.expire_all()
    repository = MePlanetContentRepository(context.db_session)
    count = repository.count()
    assert count == 1, f"ME星球內容應恰有一筆，實際 {count} 筆"
    row = context.table[0]
    me_planet_content = repository.get()
    expected_content = parse_value(context, row["content"])
    assert (
        me_planet_content.content == expected_content
    ), f"content 預期 {expected_content!r}，實際 {me_planet_content.content!r}"
    assert_time_matches(me_planet_content.updated_at, row["updated_at"], "updated_at")
