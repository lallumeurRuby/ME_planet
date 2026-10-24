from behave import given

from app.models.sub_satellite import SubSatellite
from app.repositories.sub_satellite_repository import SubSatelliteRepository
from helpers.values import parse_time, resolve_id


@given("系統中有以下子衛星：")
def step_given_sub_satellites(context):
    repository = SubSatelliteRepository(context.db_session)
    for row in context.table:
        sub_satellite = repository.save(
            SubSatellite(
                satellite_id=resolve_id(context, row["satellite_id"]),
                name=row["name"],
                created_at=parse_time(row["created_at"]),
            )
        )
        context.ids[row["name"]] = sub_satellite.id
