from behave import then

from app.repositories.satellite_repository import SatelliteRepository
from helpers.values import resolve_id


@then("系統中應有以下衛星：")
def step_then_satellites_exist(context):
    """包含即可（subset）；有 id 欄時以 id 比對同一筆。"""
    context.db_session.expire_all()
    repository = SatelliteRepository(context.db_session)
    for row in context.table:
        if "id" in row.headings:
            satellite = repository.find_by_id(resolve_id(context, row["id"]))
            assert satellite is not None, f"找不到衛星 id={row['id']}"
            assert (
                satellite.name == row["name"]
            ), f"衛星 {row['id']} 的 name 預期 '{row['name']}'，實際 '{satellite.name}'"
        else:
            assert (
                repository.find_by_name(row["name"]) is not None
            ), f"系統中沒有衛星 '{row['name']}'"
