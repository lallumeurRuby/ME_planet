from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_owner
from app.schemas.satellite import SatelliteInput, SatelliteOut
from app.services.satellite_service import SatelliteService

router = APIRouter(tags=["satellite"])


@router.get("/satellites", response_model=list[SatelliteOut])
def list_satellites(db: Session = Depends(get_db)) -> list[SatelliteOut]:
    return [SatelliteOut.model_validate(satellite) for satellite in SatelliteService(db).list_all()]


@router.post(
    "/satellites",
    status_code=201,
    response_model=SatelliteOut,
    dependencies=[Depends(require_owner)],
)
def create_satellite(request: SatelliteInput, db: Session = Depends(get_db)) -> SatelliteOut:
    satellite = SatelliteService(db).create(request.name)
    return SatelliteOut.model_validate(satellite)


@router.put(
    "/satellites/{satellite_id}",
    response_model=SatelliteOut,
    dependencies=[Depends(require_owner)],
)
def update_satellite(
    satellite_id: int, request: SatelliteInput, db: Session = Depends(get_db)
) -> SatelliteOut:
    satellite = SatelliteService(db).update(satellite_id, request.name)
    return SatelliteOut.model_validate(satellite)


@router.delete(
    "/satellites/{satellite_id}",
    status_code=204,
    dependencies=[Depends(require_owner)],
)
def delete_satellite(satellite_id: int, db: Session = Depends(get_db)) -> Response:
    SatelliteService(db).delete(satellite_id)
    return Response(status_code=204)
