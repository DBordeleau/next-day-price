from __future__ import annotations

from dataclasses import dataclass

from pipeline.config import Settings, load_settings


@dataclass(frozen=True)
class DatabaseConfig:
    url: str
    has_secret_key: bool


def get_database_config(settings: Settings | None = None) -> DatabaseConfig | None:
    settings = settings or load_settings()
    if not settings.supabase_url:
        return None
    return DatabaseConfig(
        url=settings.supabase_url,
        has_secret_key=bool(settings.supabase_secret_key),
    )
