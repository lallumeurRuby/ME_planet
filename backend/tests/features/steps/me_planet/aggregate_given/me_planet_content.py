from behave import given

from app.models.me_planet_content import MePlanetContent
from app.repositories.me_planet_content_repository import MePlanetContentRepository
from helpers.values import parse_time, parse_value


@given("ME星球內容為：")
def step_given_me_planet_content(context):
    """單列；不寫此 Given ＝ 從未設定（無資料列）。"""
    row = context.table[0]
    MePlanetContentRepository(context.db_session).save(
        MePlanetContent(
            content=parse_value(context, row["content"]),
            updated_at=parse_time(row["updated_at"]),
        )
    )
