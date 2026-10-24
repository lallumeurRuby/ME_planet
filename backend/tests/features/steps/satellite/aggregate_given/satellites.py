from behave import given

from app.models.satellite import Satellite
from app.repositories.satellite_repository import SatelliteRepository
from helpers.values import parse_time


@given("系統中有以下衛星：")
def step_given_satellites(context):
    repository = SatelliteRepository(context.db_session)
    for row in context.table:
        satellite = repository.save(
            Satellite(name=row["name"], created_at=parse_time(row["created_at"]))
        )
        context.ids[row["name"]] = satellite.id
