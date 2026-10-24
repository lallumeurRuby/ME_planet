from behave import then

from app.repositories.sub_satellite_repository import SubSatelliteRepository


@then('系統中不應有子衛星 "{name}"')
def step_then_sub_satellite_absent(context, name):
    context.db_session.expire_all()
    found = SubSatelliteRepository(context.db_session).find_by_name(name)
    assert not found, f"系統中仍有子衛星 '{name}'（id={[s.id for s in found]}）"
