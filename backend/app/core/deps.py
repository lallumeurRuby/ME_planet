from collections.abc import Iterator

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.exceptions import AppError

_session_factory: sessionmaker[Session] | None = None


def set_session_factory(factory: sessionmaker[Session]) -> None:
    global _session_factory
    _session_factory = factory


def get_session_factory() -> sessionmaker[Session]:
    """測試環境會先注入 factory；正式執行（uvicorn）時依 DATABASE_URL 建立。"""
    global _session_factory
    if _session_factory is None:
        _session_factory = sessionmaker(
            bind=create_engine(settings.DATABASE_URL, pool_pre_ping=True)
        )
    return _session_factory


def get_db() -> Iterator[Session]:
    session: Session = get_session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


_bearer = HTTPBearer(auto_error=False)


def require_owner(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> str:
    """驗證 Bearer JWT；未帶、無效或過期一律 401 UNAUTHORIZED。"""
    if credentials is None:
        raise AppError(401, "UNAUTHORIZED", "請先登入")
    try:
        payload = jwt.decode(
            credentials.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
    except jwt.InvalidTokenError:
        raise AppError(401, "UNAUTHORIZED", "登入已失效，請重新登入") from None
    return str(payload["sub"])
