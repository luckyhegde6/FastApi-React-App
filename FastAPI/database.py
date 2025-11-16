"""
Safe, lazy-initialized DB helpers.

This module is safe to import both as a package module (e.g. `from FastAPI import database`)
and as a top-level module (e.g. `import database`) — it tries both import styles for config.
It defers engine + Session creation until first use, avoiding uvicorn/Windows spawn-time issues.
"""

import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

log = logging.getLogger(__name__)
Base = declarative_base()

# Robust config import (support package vs top-level execution)
try:
    # if running as package (recommended): from FastAPI.database import ...
    from . import config as _config  # type: ignore
except Exception:
    # if running as top-level module or in different import context
    import config as _config  # type: ignore

# Determine database url (prefer explicit DATABASE_URL, fallback to settings.database_url)
_database_url = getattr(_config, "DATABASE_URL", None)
if not _database_url:
    _database_url = getattr(getattr(_config, "settings", None), "database_url", None)

if not _database_url:
    # Keep blank here — we'll raise later in initializer if truly missing
    _database_url = None

_engine = None
_SessionLocal = None


def _init_engine():
    """Initialize the engine and sessionmaker lazily."""
    global _engine, _SessionLocal
    if _engine is not None and _SessionLocal is not None:
        return _engine, _SessionLocal

    database_url = _database_url
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured (set env or config)")

    # SQLite needs check_same_thread=False for threaded use
    connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
    log.info("Initializing DB engine for %s", database_url)
    _engine = create_engine(database_url, connect_args=connect_args)
    _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    return _engine, _SessionLocal


def get_engine():
    engine, _ = _init_engine()
    return engine


def get_sessionmaker():
    _, sessionmaker_ = _init_engine()
    return sessionmaker_


# Backwards-compatible factory function (callable similar to old SessionLocal)
def SessionLocal():
    return get_sessionmaker()


# FastAPI dependency
def get_db():
    Session = get_sessionmaker()
    db = Session()
    try:
        yield db
    finally:
        db.close()
