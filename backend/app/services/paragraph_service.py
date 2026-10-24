from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.exceptions import AppError
from app.models.paragraph import Paragraph
from app.repositories.paragraph_repository import ParagraphRepository
from app.repositories.sub_satellite_repository import SubSatelliteRepository

TITLE_MAX_LENGTH = 100


class ParagraphService:
    def __init__(self, session: Session):
        self.repository = ParagraphRepository(session)
        self.sub_satellite_repository = SubSatelliteRepository(session)

    def list_by_sub_satellite(self, sub_satellite_id: int) -> list[Paragraph]:
        self._ensure_sub_satellite_exists(sub_satellite_id)
        return self.repository.find_by_sub_satellite_newest_first(sub_satellite_id)

    def create(
        self, sub_satellite_id: int, title: str, summary: str | None, content: str
    ) -> Paragraph:
        self._ensure_sub_satellite_exists(sub_satellite_id)
        self._validate_fields(title, content)
        return self.repository.save(
            Paragraph(
                sub_satellite_id=sub_satellite_id, title=title, summary=summary, content=content
            )
        )

    def update(self, paragraph_id: int, title: str, summary: str | None, content: str) -> Paragraph:
        """整筆覆蓋：summary 送 None 即清空；updated_at 更新為當下。"""
        paragraph = self._get_or_404(paragraph_id)
        self._validate_fields(title, content)
        paragraph.title = title
        paragraph.summary = summary
        paragraph.content = content
        paragraph.updated_at = datetime.now(timezone.utc)
        return self.repository.save(paragraph)

    def delete(self, paragraph_id: int) -> None:
        self.repository.delete(self._get_or_404(paragraph_id))

    def _ensure_sub_satellite_exists(self, sub_satellite_id: int) -> None:
        if self.sub_satellite_repository.find_by_id(sub_satellite_id) is None:
            raise AppError(404, "NOT_FOUND", f"找不到子衛星 {sub_satellite_id}")

    def _get_or_404(self, paragraph_id: int) -> Paragraph:
        paragraph = self.repository.find_by_id(paragraph_id)
        if paragraph is None:
            raise AppError(404, "NOT_FOUND", f"找不到段落 {paragraph_id}")
        return paragraph

    @staticmethod
    def _validate_fields(title: str, content: str) -> None:
        if not title or not content:
            raise AppError(400, "REQUIRED_FIELD_EMPTY", "標題與內容為必填")
        if len(title) > TITLE_MAX_LENGTH:
            raise AppError(400, "FIELD_TOO_LONG", f"標題不可超過 {TITLE_MAX_LENGTH} 字")
