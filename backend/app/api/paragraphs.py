from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_owner
from app.schemas.paragraph import ParagraphCreateInput, ParagraphOut, ParagraphUpdateInput
from app.services.paragraph_service import ParagraphService

router = APIRouter(tags=["paragraph"])


@router.get("/sub-satellites/{sub_satellite_id}/paragraphs", response_model=list[ParagraphOut])
def list_paragraphs(sub_satellite_id: int, db: Session = Depends(get_db)) -> list[ParagraphOut]:
    paragraphs = ParagraphService(db).list_by_sub_satellite(sub_satellite_id)
    return [ParagraphOut.model_validate(paragraph) for paragraph in paragraphs]


@router.post(
    "/sub-satellites/{sub_satellite_id}/paragraphs",
    status_code=201,
    response_model=ParagraphOut,
    dependencies=[Depends(require_owner)],
)
def create_paragraph(
    sub_satellite_id: int, request: ParagraphCreateInput, db: Session = Depends(get_db)
) -> ParagraphOut:
    paragraph = ParagraphService(db).create(
        sub_satellite_id, request.title, request.summary, request.content
    )
    return ParagraphOut.model_validate(paragraph)


@router.put(
    "/paragraphs/{paragraph_id}",
    response_model=ParagraphOut,
    dependencies=[Depends(require_owner)],
)
def update_paragraph(
    paragraph_id: int, request: ParagraphUpdateInput, db: Session = Depends(get_db)
) -> ParagraphOut:
    paragraph = ParagraphService(db).update(
        paragraph_id, request.title, request.summary, request.content
    )
    return ParagraphOut.model_validate(paragraph)


@router.delete(
    "/paragraphs/{paragraph_id}",
    status_code=204,
    dependencies=[Depends(require_owner)],
)
def delete_paragraph(paragraph_id: int, db: Session = Depends(get_db)) -> Response:
    ParagraphService(db).delete(paragraph_id)
    return Response(status_code=204)
