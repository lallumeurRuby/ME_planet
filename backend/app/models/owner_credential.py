from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class OwnerCredential(Base):
    """擁有者登入憑證與鎖定狀態，僅單筆資料。"""

    __tablename__ = "owner_credentials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    failed_attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
