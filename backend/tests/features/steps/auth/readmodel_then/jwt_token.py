from datetime import datetime, timezone

import jwt
from behave import then

from app.core.config import settings


@then("回應應包含有效期 24 小時的 JWT")
def step_then_jwt_valid_for_24_hours(context):
    data = context.last_response.json()
    assert "token" in data, f"回應中沒有 token：{data}"
    payload = jwt.decode(data["token"], settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    lifetime = payload["exp"] - payload["iat"]
    assert lifetime == 24 * 3600, f"預期有效期 24 小時，實際 {lifetime} 秒"
    now = datetime.now(timezone.utc).timestamp()
    assert abs(payload["iat"] - now) <= 5, f"iat 預期為現在，實際 {payload['iat']}"
