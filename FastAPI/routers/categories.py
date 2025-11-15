from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from schemas import CategoryCreate, CategoryUpdate, CategoryResponse
from services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("/", response_model=CategoryResponse, status_code=201)
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new category.
    
    - **name**: Category name (must be unique)
    - **description**: Optional category description
    - **is_income**: Whether this category is for income transactions
    """
    return CategoryService.create_category(db, category)


@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    is_income: Optional[bool] = Query(None, description="Filter by income/expense"),
    is_default: Optional[bool] = Query(None, description="Filter by default categories"),
    db: Session = Depends(get_db)
):
    """
    Get list of categories.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **is_income**: Optional filter for income/expense categories
    - **is_default**: Optional filter for default categories
    """
    return CategoryService.get_categories(db, skip, limit, is_income, is_default)


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a category by ID.
    
    - **category_id**: The ID of the category to retrieve
    """
    category = CategoryService.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a category.
    
    - **category_id**: The ID of the category to update
    - **category_update**: Updated category data (only provided fields will be updated)
    """
    return CategoryService.update_category(db, category_id, category_update)


@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a category.
    
    - **category_id**: The ID of the category to delete
    
    Note: Cannot delete categories that have transactions or default categories.
    """
    CategoryService.delete_category(db, category_id)
    return None

