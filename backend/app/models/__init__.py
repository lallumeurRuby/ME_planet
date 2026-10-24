from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# 匯入所有 model，讓 Base.metadata 完整（Alembic、測試清表依賴此）
from app.models.owner_credential import OwnerCredential  # noqa: E402,F401
from app.models.paragraph import Paragraph  # noqa: E402,F401
from app.models.satellite import Satellite  # noqa: E402,F401
from app.models.sub_satellite import SubSatellite  # noqa: E402,F401
