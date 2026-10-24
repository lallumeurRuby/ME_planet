from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.satellite import Satellite


class SatelliteRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, satellite: Satellite) -> Satellite:
        merged = self.session.merge(satellite)
        self.session.commit()
        return merged

    def find_by_id(self, satellite_id: int) -> Satellite | None:
        return self.session.get(Satellite, satellite_id)

    def find_by_name(self, name: str) -> Satellite | None:
        return self.session.scalars(select(Satellite).where(Satellite.name == name)).first()

    def find_all_oldest_first(self) -> list[Satellite]:
        return list(
            self.session.scalars(select(Satellite).order_by(Satellite.created_at, Satellite.id))
        )

    def delete(self, satellite: Satellite) -> None:
        self.session.delete(satellite)
        self.session.commit()
