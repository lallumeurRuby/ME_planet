from behave import then

from app.repositories.satellite_repository import SatelliteRepository


@then('系統中不應有衛星 "{name}"')
def step_then_satellite_absent(context, name):
    context.db_session.expire_all()
    satellite = SatelliteRepository(context.db_session).find_by_name(name)
    assert satellite is None, f"系統中仍有衛星 '{name}'（id={satellite.id}）"
