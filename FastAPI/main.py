from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from config import settings
from routers import transactions, categories
from models import Category

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed default categories
def seed_default_categories():
    """Seed default categories if they don't exist."""
    from sqlalchemy.orm import Session
    db = SessionLocal()
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
        for cat_data in expense_categories:
            existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
            if not existing:
                category = Category(**cat_data, is_default=True)
                db.add(category)
        
        # Add income categories
        for cat_data in income_categories:
            existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
            if not existing:
                category = Category(**cat_data, is_default=True)
                db.add(category)
        
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding categories: {e}")
    finally:
        db.close()

# Seed categories on startup
seed_default_categories()

# Initialize FastAPI app
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

# Include routers
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
