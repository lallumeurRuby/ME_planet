from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MePlanetContentInput(BaseModel):
    """整份覆蓋；""、null 或省略一律存為 null（清空）。"""

    content: str | None = None


class MePlanetContentOut(BaseModel):
    """從未設定時 content、updated_at 皆為 null。"""

    model_config = ConfigDict(from_attributes=True)

    content: str | None
    updated_at: datetime | None
