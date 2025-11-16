from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


# Category Schemas
class CategoryBase(BaseModel):
    """Base schema for category data."""
    
    name: str = Field(..., min_length=1, max_length=100, description="Category name")
    description: Optional[str] = Field(None, max_length=500, description="Category description")
    is_income: bool = Field(default=False, description="Whether this category is for income")


class CategoryCreate(CategoryBase):
    """Schema for creating a new category."""
    pass


class CategoryUpdate(BaseModel):
    """Schema for updating a category."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_income: Optional[bool] = None


class CategoryResponse(CategoryBase):
    """Schema for category response."""
    
    id: int
    is_default: bool
    
    class Config:
        from_attributes = True


# Transaction Schemas
class TransactionBase(BaseModel):
    """Base schema for transaction data."""
    
    amount: float = Field(..., gt=0, description="Transaction amount (must be positive)")
    category_id: Optional[int] = None
    description: Optional[str] = Field(None, max_length=500, description="Transaction description")
    is_income: bool = Field(default=False, description="Whether this is an income transaction")
    date: str = Field(..., description="Transaction date (YYYY-MM-DD format)")
    category: Optional[str] = Field(None, description="Category name (optional, will be used to resolve/create category)")
    
    @field_validator('date')
    @classmethod
    def validate_date(cls, v: str) -> str:
        """Validate date format."""
        try:
            datetime.strptime(v, '%Y-%m-%d')
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')
        return v


class TransactionCreate(TransactionBase):
    """Schema for creating a new transaction."""
    pass


class TransactionUpdate(BaseModel):
    """Schema for updating a transaction."""
    
    amount: Optional[float] = Field(None, gt=0)
    category_id: Optional[int] = None
    description: Optional[str] = Field(None, max_length=500)
    is_income: Optional[bool] = None
    date: Optional[str] = None
    
    @field_validator('date')
    @classmethod
    def validate_date(cls, v: Optional[str]) -> Optional[str]:
        """Validate date format if provided."""
        if v is not None:
            try:
                datetime.strptime(v, '%Y-%m-%d')
            except ValueError:
                raise ValueError('Date must be in YYYY-MM-DD format')
        return v


class TransactionResponse(BaseModel):
    """Schema for transaction response."""
    
    id: int
    amount: float
    category_id: int
    category: Optional[str] = None  # Category name for convenience
    description: Optional[str]
    is_income: bool
    date: str
    
    class Config:
        from_attributes = True

