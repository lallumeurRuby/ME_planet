from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SubSatelliteInput(BaseModel):
    name: str


class SubSatelliteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    satellite_id: int
    name: str
    created_at: datetime
