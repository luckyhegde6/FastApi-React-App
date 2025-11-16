from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Robust imports to support running as a package or from the FastAPI folder
try:
    # package import style (preferred)
    from .config import settings, DATABASE_URL  # type: ignore
    from .database import Base, get_engine, get_sessionmaker, get_db  # type: ignore
    from .routers import transactions, categories  # type: ignore
    from .models import Category  # type: ignore
except Exception:
    # top-level import style (fallback)
    from config import settings, DATABASE_URL  # type: ignore
    from database import Base, get_engine, get_sessionmaker, get_db  # type: ignore
    from routers import transactions, categories  # type: ignore
    from models import Category  # type: ignore

logger = logging.getLogger("uvicorn")

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description=settings.api_description,
    debug=settings.debug
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers (router objects only - safe to import now)
app.include_router(transactions.router)
app.include_router(categories.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Finance API",
        "version": settings.api_version,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


def seed_default_categories():
    """Seed default categories if they don't exist."""
    # Import SQLAlchemy session/SessionLocal at runtime via get_sessionmaker to avoid
    # import-time side-effects.
    SessionMaker = get_sessionmaker()
    db = SessionMaker()
    try:
        # Default expense categories
        expense_categories = [
            {"name": "Food", "description": "Groceries and dining out", "is_income": False},
            {"name": "Transport", "description": "Transportation costs", "is_income": False},
            {"name": "Shopping", "description": "Shopping and retail", "is_income": False},
            {"name": "Bills", "description": "Utility bills and subscriptions", "is_income": False},
            {"name": "Entertainment", "description": "Movies, games, and leisure", "is_income": False},
            {"name": "Healthcare", "description": "Medical expenses", "is_income": False},
            {"name": "Education", "description": "Educational expenses", "is_income": False},
            {"name": "Other", "description": "Miscellaneous expenses", "is_income": False},
        ]

        # Default income categories
        income_categories = [
            {"name": "Salary", "description": "Monthly salary", "is_income": True},
            {"name": "Freelance", "description": "Freelance work income", "is_income": True},
            {"name": "Investment", "description": "Investment returns", "is_income": True},
            {"name": "Gift", "description": "Gifts received", "is_income": True},
            {"name": "Other Income", "description": "Other income sources", "is_income": True},
        ]

        # Add expense categories
        for cat_data in expense_categories + income_categories:
            existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
            if not existing:
                category = Category(**cat_data, is_default=True)
                db.add(category)

        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Error seeding categories: %s", e)
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    """Create tables and seed defaults on app startup (not at import time)."""
    # Log the DB being used
    logger.info("Starting app with DATABASE_URL=%s", DATABASE_URL)

    # Create tables (safe: engine is initialized lazily inside get_engine())
    engine = get_engine()
    Base.metadata.create_all(bind=engine)

    # Seed default categories (idempotent)
    seed_default_categories()
