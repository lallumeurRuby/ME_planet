from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.paragraph import Paragraph


class ParagraphRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, paragraph: Paragraph) -> Paragraph:
        merged = self.session.merge(paragraph)
        self.session.commit()
        return merged

    def find_by_id(self, paragraph_id: int) -> Paragraph | None:
        return self.session.get(Paragraph, paragraph_id)

    def find_by_title(self, title: str) -> list[Paragraph]:
        return list(self.session.scalars(select(Paragraph).where(Paragraph.title == title)))

    def delete(self, paragraph: Paragraph) -> None:
        self.session.delete(paragraph)
        self.session.commit()

    def find_by_sub_satellite_newest_first(self, sub_satellite_id: int) -> list[Paragraph]:
        return list(
            self.session.scalars(
                select(Paragraph)
                .where(Paragraph.sub_satellite_id == sub_satellite_id)
                .order_by(Paragraph.created_at.desc(), Paragraph.id.desc())
            )
        )
