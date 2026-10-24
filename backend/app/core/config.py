import os


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@localhost:5432/me_planet_api_dev",
    )
    API_PREFIX: str = "/api"

    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-secret-key-change-me")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 24

    LOGIN_MAX_FAILED_ATTEMPTS: int = 5
    LOGIN_LOCK_MINUTES: int = 15


settings = Settings()
