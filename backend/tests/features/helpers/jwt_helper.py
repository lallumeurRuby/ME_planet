from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import settings


class JwtHelper:
    """產生測試用 JWT：有效 / 已過期 / 無效（錯誤密鑰）。"""

    def generate_token(self, issued_at: datetime | None = None) -> str:
        iat = issued_at or datetime.now(timezone.utc)
        payload = {
            "sub": "owner",
            "iat": int(iat.timestamp()),
            "exp": int((iat + timedelta(hours=settings.JWT_EXPIRE_HOURS)).timestamp()),
        }
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    def generate_expired_token(self) -> str:
        return self.generate_token(datetime.now(timezone.utc) - timedelta(hours=25))

    def generate_invalid_token(self) -> str:
        now = datetime.now(timezone.utc)
        payload = {
            "sub": "owner",
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(hours=1)).timestamp()),
        }
        return jwt.encode(payload, "wrong-secret-key", algorithm=settings.JWT_ALGORITHM)
