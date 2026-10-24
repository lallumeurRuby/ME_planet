from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ParagraphCreateInput(BaseModel):
    title: str
    summary: str | None = None
    content: str


class ParagraphOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sub_satellite_id: int
    title: str
    summary: str | None
    content: str
    created_at: datetime
    updated_at: datetime


class ParagraphUpdateInput(BaseModel):
    """整筆覆蓋：三個欄位皆須送出，summary 可為 null。"""

    title: str
    summary: str | None
    content: str
