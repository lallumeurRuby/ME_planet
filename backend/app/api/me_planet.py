from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_owner
from app.schemas.me_planet import MePlanetContentInput, MePlanetContentOut
from app.services.me_planet_service import MePlanetService

router = APIRouter(tags=["me-planet"])


@router.get("/me-planet", response_model=MePlanetContentOut)
def get_me_planet_content(db: Session = Depends(get_db)) -> MePlanetContentOut:
    me_planet_content = MePlanetService(db).get()
    if me_planet_content is None:
        return MePlanetContentOut(content=None, updated_at=None)
    return MePlanetContentOut.model_validate(me_planet_content)


@router.put(
    "/me-planet",
    response_model=MePlanetContentOut,
    dependencies=[Depends(require_owner)],
)
def update_me_planet_content(
    request: MePlanetContentInput, db: Session = Depends(get_db)
) -> MePlanetContentOut:
    me_planet_content = MePlanetService(db).update(request.content)
    return MePlanetContentOut.model_validate(me_planet_content)
