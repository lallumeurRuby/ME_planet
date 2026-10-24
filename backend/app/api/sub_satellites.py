from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_owner
from app.schemas.sub_satellite import SubSatelliteInput, SubSatelliteOut
from app.services.sub_satellite_service import SubSatelliteService

router = APIRouter(tags=["sub-satellite"])


@router.get("/satellites/{satellite_id}/sub-satellites", response_model=list[SubSatelliteOut])
def list_sub_satellites(satellite_id: int, db: Session = Depends(get_db)) -> list[SubSatelliteOut]:
    sub_satellites = SubSatelliteService(db).list_by_satellite(satellite_id)
    return [SubSatelliteOut.model_validate(sub_satellite) for sub_satellite in sub_satellites]


@router.post(
    "/satellites/{satellite_id}/sub-satellites",
    status_code=201,
    response_model=SubSatelliteOut,
    dependencies=[Depends(require_owner)],
)
def create_sub_satellite(
    satellite_id: int, request: SubSatelliteInput, db: Session = Depends(get_db)
) -> SubSatelliteOut:
    sub_satellite = SubSatelliteService(db).create(satellite_id, request.name)
    return SubSatelliteOut.model_validate(sub_satellite)


@router.put(
    "/sub-satellites/{sub_satellite_id}",
    response_model=SubSatelliteOut,
    dependencies=[Depends(require_owner)],
)
def update_sub_satellite(
    sub_satellite_id: int, request: SubSatelliteInput, db: Session = Depends(get_db)
) -> SubSatelliteOut:
    sub_satellite = SubSatelliteService(db).update(sub_satellite_id, request.name)
    return SubSatelliteOut.model_validate(sub_satellite)


@router.delete(
    "/sub-satellites/{sub_satellite_id}",
    status_code=204,
    dependencies=[Depends(require_owner)],
)
def delete_sub_satellite(sub_satellite_id: int, db: Session = Depends(get_db)) -> Response:
    SubSatelliteService(db).delete(sub_satellite_id)
    return Response(status_code=204)
