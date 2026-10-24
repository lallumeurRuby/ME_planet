from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.paragraphs import router as paragraphs_router
from app.api.satellites import router as satellites_router
from app.api.sub_satellites import router as sub_satellites_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(satellites_router)
router.include_router(sub_satellites_router)
router.include_router(paragraphs_router)
