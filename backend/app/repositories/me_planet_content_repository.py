from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.me_planet_content import MePlanetContent


class MePlanetContentRepository:
    def __init__(self, session: Session):
        self.session = session

    def get(self) -> MePlanetContent | None:
        return self.session.scalars(select(MePlanetContent).limit(1)).first()

    def count(self) -> int:
        return self.session.scalar(select(func.count()).select_from(MePlanetContent))

    def save(self, me_planet_content: MePlanetContent) -> MePlanetContent:
        merged = self.session.merge(me_planet_content)
        self.session.commit()
        return merged
