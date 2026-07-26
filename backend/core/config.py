from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "TruthForge AI"
    app_version: str = "0.1.0"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    cors_origins: str = (
    "http://127.0.0.1:5173,"
    "http://localhost:5173,"
    "http://127.0.0.1:5174,"
    "http://localhost:5174"
)
    log_level: str = "INFO"
    chroma_persist_dir: str = ".chroma"
    chroma_persist_directory: str = ".chroma"
    chroma_collection_name: str = "truthforge_ai"
    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    embedding_model_device: str = "cpu"

    llm_provider: str = "openai"
    llm_model: str = "gpt-3.5-turbo"
    llm_api_key: Optional[str] = None
    llm_api_base: str = "https://api.openai.com/v1"
    llm_timeout: int = 60

    chunk_size: int = 512
    chunk_overlap: int = 50

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="TRUTHFORGE_",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def enable_docs(self) -> bool:
        return self.environment.lower() != "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
