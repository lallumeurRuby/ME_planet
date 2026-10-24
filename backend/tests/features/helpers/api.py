from app.core.config import settings


def api_path(path: str) -> str:
    """api.yml 的 path 加上掛載前綴（servers url = http://localhost:8000/api）。"""
    return f"{settings.API_PREFIX}{path}"


def auth_headers(context) -> dict[str, str]:
    """依目前的 JWT 狀態組 Authorization header；未帶 JWT 時回傳空 dict。"""
    token = context.memo.get("jwt")
    return {"Authorization": f"Bearer {token}"} if token else {}
