import os


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@localhost:5432/me_planet_api_dev",
    )
    API_PREFIX: str = "/api"


settings = Settings()
