from sqlalchemy import Column, Integer, String, Boolean, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Category(Base):
    """Category model for transaction categories."""
    
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    is_income = Column(Boolean, default=False, nullable=False)  # Whether this category is for income
    is_default = Column(Boolean, default=False, nullable=False)  # Whether this is a default category
    
    # Relationship with transactions
    transactions = relationship("Transaction", back_populates="category_obj")
    
    # Unique constraint on name + is_income combination
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )


class Transaction(Base):
    """Transaction model for the finance database."""
    
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False, index=True)
    description = Column(String, nullable=True)
    is_income = Column(Boolean, default=False, nullable=False)
    date = Column(String, nullable=False)  # Using String for date to match current implementation
    
    # Relationship with category
    category_obj = relationship("Category", back_populates="transactions")
