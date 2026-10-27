from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.me_planet_content import MePlanetContent
from app.repositories.me_planet_content_repository import MePlanetContentRepository


class MePlanetService:
    def __init__(self, session: Session):
        self.repository = MePlanetContentRepository(session)

    def get(self) -> MePlanetContent | None:
        """從未設定時回傳 None。"""
        return self.repository.get()

    def update(self, content: str | None) -> MePlanetContent:
        """upsert：從未設定時建立；整份覆蓋，"" 視同 null（清空）；updated_at 更新為當下。"""
        me_planet_content = self.repository.get() or MePlanetContent()
        me_planet_content.content = content or None
        me_planet_content.updated_at = datetime.now(timezone.utc)
        return self.repository.save(me_planet_content)
