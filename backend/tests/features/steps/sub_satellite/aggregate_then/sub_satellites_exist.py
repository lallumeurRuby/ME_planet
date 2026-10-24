from behave import then

from app.repositories.sub_satellite_repository import SubSatelliteRepository
from helpers.values import resolve_id


@then("系統中應有以下子衛星：")
def step_then_sub_satellites_exist(context):
    """包含即可（subset）；有 id 欄時以 id 比對同一筆。"""
    context.db_session.expire_all()
    repository = SubSatelliteRepository(context.db_session)
    for row in context.table:
        satellite_id = resolve_id(context, row["satellite_id"])
        if "id" in row.headings:
            sub_satellite = repository.find_by_id(resolve_id(context, row["id"]))
            assert sub_satellite is not None, f"找不到子衛星 id={row['id']}"
            actual = (sub_satellite.satellite_id, sub_satellite.name)
            assert actual == (satellite_id, row["name"]), (
                f"子衛星 {row['id']} 預期 (satellite_id={satellite_id}, name='{row['name']}')，"
                f"實際 {actual}"
            )
        else:
            found = repository.find_by_satellite_and_name(satellite_id, row["name"])
            assert found is not None, f"衛星 {row['satellite_id']} 底下沒有子衛星 '{row['name']}'"
