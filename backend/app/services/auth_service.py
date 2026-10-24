import logging
from datetime import datetime, timedelta, timezone

import jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import verify_password
from app.exceptions import AppError
from app.models.owner_credential import OwnerCredential
from app.repositories.owner_credential_repository import OwnerCredentialRepository

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, session: Session):
        self.repository = OwnerCredentialRepository(session)

    def login(self, password: str) -> str:
        if not password:
            raise AppError(400, "REQUIRED_FIELD_EMPTY", "密碼為必填")

        credential = self.repository.get()
        if credential is None:
            raise AppError(401, "INVALID_PASSWORD", "密碼錯誤")

        now = datetime.now(timezone.utc)
        self._ensure_not_locked(credential, now)

        if not verify_password(password, credential.password_hash):
            self._record_failed_attempt(credential, now)
            raise AppError(401, "INVALID_PASSWORD", "密碼錯誤")

        credential.failed_attempts = 0
        credential.locked_until = None
        self.repository.save(credential)
        return _issue_token(now)

    def _ensure_not_locked(self, credential: OwnerCredential, now: datetime) -> None:
        """鎖定中拒絕登入；鎖定已到期則錯誤計數從 0 重新起算。"""
        if credential.locked_until is None:
            return
        if now < credential.locked_until:
            raise AppError(429, "LOGIN_LOCKED", "登入已鎖定，請稍後再試")
        credential.failed_attempts = 0
        credential.locked_until = None

    def _record_failed_attempt(self, credential: OwnerCredential, now: datetime) -> None:
        credential.failed_attempts += 1
        if credential.failed_attempts >= settings.LOGIN_MAX_FAILED_ATTEMPTS:
            credential.locked_until = now + timedelta(minutes=settings.LOGIN_LOCK_MINUTES)
            logger.warning(
                "login_locked failed_attempts=%s locked_until=%s",
                credential.failed_attempts,
                credential.locked_until.isoformat(),
            )
        self.repository.save(credential)


def _issue_token(issued_at: datetime) -> str:
    payload = {
        "sub": "owner",
        "iat": int(issued_at.timestamp()),
        "exp": int((issued_at + timedelta(hours=settings.JWT_EXPIRE_HOURS)).timestamp()),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
