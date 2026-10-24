from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import router as api_router
from app.exceptions import AppError


def create_app() -> FastAPI:
    app = FastAPI(title="me-planet-api API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/api")

    @app.exception_handler(AppError)
    def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"code": exc.code, "message": exc.message},
        )

    # api.yml：欄位驗證錯誤一律 400 { code, message }（不使用 FastAPI 預設的 422）
    @app.exception_handler(RequestValidationError)
    def handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
        fields = "、".join(str(error["loc"][-1]) for error in exc.errors())
        return JSONResponse(
            status_code=400,
            content={"code": "REQUIRED_FIELD_EMPTY", "message": f"必填欄位缺少或格式錯誤：{fields}"},
        )

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
