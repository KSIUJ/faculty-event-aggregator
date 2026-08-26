from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DB_USER: str = "dev_user"
    DB_PASS: str = "dev_password"
    DB_NAME: str = "local_database"
    DB_PORT: int = 5432
    DB_HOST: str = "localhost"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    SAMPLE_DATA_PATH: Path = Path("../docs/sampledata.json")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()
        ]


settings = Settings()
