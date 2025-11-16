from pydantic_settings import BaseSettings
from typing import Optional

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
# Default DB (example) — keep your existing default here
DEFAULT_DB = f"sqlite:///{BASE_DIR / 'finance.db'}"

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB)
FASTAPI_TESTING = os.getenv("FASTAPI_TESTING", "0") in ("1", "true", "True")
class Settings(BaseSettings):
    """Application settings."""
    
    # Database
    database_url: str = "sqlite:///./finance.db"
    
    # API
    api_title: str = "Finance API"
    api_version: str = "1.0.0"
    api_description: str = "A finance management API"
    
    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

