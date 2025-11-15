import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from database import Base, get_db
from main import app
import os


# Use in-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///./test_finance.db"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database dependency override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_transaction_data():
    """Sample transaction data for testing."""
    return {
        "amount": 100.50,
        "category": "Food",
        "description": "Lunch",
        "is_income": False,
        "date": "2024-01-15"
    }


@pytest.fixture
def sample_income_data():
    """Sample income transaction data for testing."""
    return {
        "amount": 5000.00,
        "category": "Salary",
        "description": "Monthly salary",
        "is_income": True,
        "date": "2024-01-01"
    }

