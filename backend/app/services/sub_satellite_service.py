from sqlalchemy.orm import Session

from app.exceptions import AppError
from app.models.sub_satellite import SubSatellite
from app.repositories.satellite_repository import SatelliteRepository
from app.repositories.sub_satellite_repository import SubSatelliteRepository

NAME_MAX_LENGTH = 50


class SubSatelliteService:
    def __init__(self, session: Session):
        self.repository = SubSatelliteRepository(session)
        self.satellite_repository = SatelliteRepository(session)

    def list_by_satellite(self, satellite_id: int) -> list[SubSatellite]:
        self._ensure_satellite_exists(satellite_id)
        return self.repository.find_by_satellite_oldest_first(satellite_id)

    def create(self, satellite_id: int, name: str) -> SubSatellite:
        self._ensure_satellite_exists(satellite_id)
        self._validate_name(name)
        self._ensure_name_unique(satellite_id, name)
        return self.repository.save(SubSatellite(satellite_id=satellite_id, name=name))

    def update(self, sub_satellite_id: int, name: str) -> SubSatellite:
        sub_satellite = self._get_or_404(sub_satellite_id)
        self._validate_name(name)
        self._ensure_name_unique(sub_satellite.satellite_id, name, exclude_id=sub_satellite.id)
        sub_satellite.name = name
        return self.repository.save(sub_satellite)

    def delete(self, sub_satellite_id: int) -> None:
        sub_satellite = self._get_or_404(sub_satellite_id)
        self.repository.delete(sub_satellite)

    def _ensure_satellite_exists(self, satellite_id: int) -> None:
        if self.satellite_repository.find_by_id(satellite_id) is None:
            raise AppError(404, "NOT_FOUND", f"找不到衛星 {satellite_id}")

    def _get_or_404(self, sub_satellite_id: int) -> SubSatellite:
        sub_satellite = self.repository.find_by_id(sub_satellite_id)
        if sub_satellite is None:
            raise AppError(404, "NOT_FOUND", f"找不到子衛星 {sub_satellite_id}")
        return sub_satellite

    @staticmethod
    def _validate_name(name: str) -> None:
        if not name:
            raise AppError(400, "REQUIRED_FIELD_EMPTY", "名稱為必填")
        if len(name) > NAME_MAX_LENGTH:
            raise AppError(400, "FIELD_TOO_LONG", f"名稱不可超過 {NAME_MAX_LENGTH} 字")

    def _ensure_name_unique(
        self, satellite_id: int, name: str, exclude_id: int | None = None
    ) -> None:
        """同一衛星內唯一；改成自己現有的名稱不算重複。"""
        existing = self.repository.find_by_satellite_and_name(satellite_id, name)
        if existing is not None and existing.id != exclude_id:
            raise AppError(409, "NAME_DUPLICATED", f"此衛星底下已有子衛星「{name}」")
