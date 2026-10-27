from sqlalchemy.orm import Session

from app.exceptions import AppError
from app.models.satellite import Satellite
from app.repositories.satellite_repository import SatelliteRepository

NAME_MAX_LENGTH = 50


class SatelliteService:
    def __init__(self, session: Session):
        self.repository = SatelliteRepository(session)

    def list_all(self) -> list[Satellite]:
        return self.repository.find_all_oldest_first()

    def create(self, name: str) -> Satellite:
        self._validate_name(name)
        self._ensure_name_unique(name)
        return self.repository.save(Satellite(name=name))

    def update(self, satellite_id: int, name: str) -> Satellite:
        satellite = self._get_or_404(satellite_id)
        self._validate_name(name)
        self._ensure_name_unique(name, exclude_id=satellite.id)
        satellite.name = name
        return self.repository.save(satellite)

    def delete(self, satellite_id: int) -> None:
        satellite = self._get_or_404(satellite_id)
        self.repository.delete(satellite)

    def _get_or_404(self, satellite_id: int) -> Satellite:
        satellite = self.repository.find_by_id(satellite_id)
        if satellite is None:
            raise AppError(404, "NOT_FOUND", f"找不到衛星 {satellite_id}")
        return satellite

    @staticmethod
    def _validate_name(name: str) -> None:
        if not name:
            raise AppError(400, "REQUIRED_FIELD_EMPTY", "名稱為必填")
        if len(name) > NAME_MAX_LENGTH:
            raise AppError(400, "FIELD_TOO_LONG", f"名稱不可超過 {NAME_MAX_LENGTH} 字")

    def _ensure_name_unique(self, name: str, exclude_id: int | None = None) -> None:
        """全域唯一；改成自己現有的名稱不算重複。"""
        existing = self.repository.find_by_name(name)
        if existing is not None and existing.id != exclude_id:
            raise AppError(409, "NAME_DUPLICATED", f"衛星名稱「{name}」已存在")
