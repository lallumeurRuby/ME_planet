from collections.abc import Iterator

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.exceptions import AppError

_session_factory: sessionmaker[Session] | None = None


def set_session_factory(factory: sessionmaker[Session]) -> None:
    global _session_factory
    _session_factory = factory


def get_db() -> Iterator[Session]:
    if _session_factory is None:
        raise RuntimeError("Session factory not initialized")
    session: Session = _session_factory()
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
