from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException
from models import Category
from schemas import CategoryCreate, CategoryUpdate


class CategoryService:
    """Service class for category business logic."""
    
    @staticmethod
    def create_category(db: Session, category: CategoryCreate) -> Category:
        """
        Create a new category.
        
        Args:
            db: Database session
            category: Category data
            
        Returns:
            Created category
            
        Raises:
            HTTPException: If category name already exists
        """
        # Check if category with same name exists
        existing = db.query(Category).filter(Category.name == category.name).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Category with name '{category.name}' already exists"
            )
        
        db_category = Category(**category.model_dump())
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category
    
    @staticmethod
    def get_category(db: Session, category_id: int) -> Optional[Category]:
        """
        Get a category by ID.
        
        Args:
            db: Database session
            category_id: Category ID
            
        Returns:
            Category if found, None otherwise
        """
        return db.query(Category).filter(Category.id == category_id).first()
    
    @staticmethod
    def get_category_by_name(db: Session, name: str) -> Optional[Category]:
        """
        Get a category by name.
        
        Args:
            db: Database session
            name: Category name
            
        Returns:
            Category if found, None otherwise
        """
        return db.query(Category).filter(Category.name == name).first()
    
    @staticmethod
    def get_categories(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        is_income: Optional[bool] = None,
        is_default: Optional[bool] = None
    ) -> List[Category]:
        """
        Get list of categories with optional filters.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            is_income: Filter by income/expense
            is_default: Filter by default categories
            
        Returns:
            List of categories
        """
        query = db.query(Category)
        
        if is_income is not None:
            query = query.filter(Category.is_income == is_income)
        
        if is_default is not None:
            query = query.filter(Category.is_default == is_default)
        
        return query.order_by(Category.name).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_category(
        db: Session,
        category_id: int,
        category_update: CategoryUpdate
    ) -> Category:
        """
        Update a category.
        
        Args:
            db: Database session
            category_id: Category ID
            category_update: Updated category data
            
        Returns:
            Updated category
            
        Raises:
            HTTPException: If category not found or name conflict
        """
        db_category = CategoryService.get_category(db, category_id)
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Check if updating name and it conflicts with existing category
        update_data = category_update.model_dump(exclude_unset=True)
        if 'name' in update_data and update_data['name'] != db_category.name:
            existing = db.query(Category).filter(
                Category.name == update_data['name'],
                Category.id != category_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail=f"Category with name '{update_data['name']}' already exists"
                )
        
        for field, value in update_data.items():
            setattr(db_category, field, value)
        
        db.commit()
        db.refresh(db_category)
        return db_category
    
    @staticmethod
    def delete_category(db: Session, category_id: int) -> bool:
        """
        Delete a category.
        
        Args:
            db: Database session
            category_id: Category ID
            
        Returns:
            True if deleted, False otherwise
            
        Raises:
            HTTPException: If category not found or has transactions
        """
        db_category = CategoryService.get_category(db, category_id)
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Check if category has transactions
        if db_category.transactions:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete category that has associated transactions"
            )
        
        # Prevent deletion of default categories
        if db_category.is_default:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete default categories"
            )
        
        db.delete(db_category)
        db.commit()
        return True

