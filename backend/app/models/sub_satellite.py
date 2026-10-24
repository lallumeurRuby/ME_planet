from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class SubSatellite(Base):
    """子分類知識（子衛星）。name 在同一 Satellite 內唯一；底下仍有段落時不可刪除。"""

    __tablename__ = "sub_satellites"
    __table_args__ = (UniqueConstraint("satellite_id", "name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    satellite_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("satellites.id", ondelete="RESTRICT"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
