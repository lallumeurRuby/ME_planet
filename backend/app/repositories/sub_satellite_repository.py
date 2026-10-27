from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.sub_satellite import SubSatellite


class SubSatelliteRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, sub_satellite: SubSatellite) -> SubSatellite:
        merged = self.session.merge(sub_satellite)
        self.session.commit()
        return merged

    def find_by_id(self, sub_satellite_id: int) -> SubSatellite | None:
        return self.session.get(SubSatellite, sub_satellite_id)

    def find_by_name(self, name: str) -> list[SubSatellite]:
        return list(self.session.scalars(select(SubSatellite).where(SubSatellite.name == name)))

    def find_by_satellite_and_name(self, satellite_id: int, name: str) -> SubSatellite | None:
        return self.session.scalars(
            select(SubSatellite).where(
                SubSatellite.satellite_id == satellite_id, SubSatellite.name == name
            )
        ).first()

    def delete(self, sub_satellite: SubSatellite) -> None:
        self.session.delete(sub_satellite)
        self.session.commit()

    def find_by_satellite_oldest_first(self, satellite_id: int) -> list[SubSatellite]:
        return list(
            self.session.scalars(
                select(SubSatellite)
                .where(SubSatellite.satellite_id == satellite_id)
                .order_by(SubSatellite.created_at, SubSatellite.id)
            )
        )
