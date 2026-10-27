from datetime import datetime

from sqlalchemy import DateTime, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class MePlanetContent(Base):
    """ME Planet 點擊 Modal 的單一內容，僅單筆資料；第一次編輯時建立。content 為 null 表示已清空。"""

    __tablename__ = "me_planet_content"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
