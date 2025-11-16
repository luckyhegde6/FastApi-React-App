from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException
from models import Transaction, Category
from schemas import TransactionCreate, TransactionUpdate


class TransactionService:
    """Service class for transaction business logic."""
    
    @staticmethod
    def create_transaction(db: Session, transaction: TransactionCreate) -> Transaction:
        """
        Create a new transaction.
        
        Args:
            db: Database session
            transaction: Transaction data
            
        Returns:
            Created transaction
            
        Raises:
            HTTPException: If category not found
        """
        # Resolve category: allow passing category name in `category` or category_id
        if getattr(transaction, 'category_id', None) is None and getattr(transaction, 'category', None):
            # find or create by name
            cat = db.query(Category).filter(Category.name == transaction.category).first()
            if not cat:
                cat = Category(name=transaction.category, description=None, is_income=transaction.is_income)
                db.add(cat)
                db.commit()
                db.refresh(cat)
            transaction_dict = transaction.model_dump()
            transaction_dict['category_id'] = cat.id
        else:
            transaction_dict = transaction.model_dump()
        # Remove any transient 'category' field (name) so SQLAlchemy model doesn't receive unexpected keyword args
        transaction_dict.pop('category', None)
        # Validate category exists
        category = db.query(Category).filter(Category.id == transaction_dict.get('category_id')).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        db_transaction = Transaction(**transaction_dict)
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    
    @staticmethod
    def get_transaction(db: Session, transaction_id: int) -> Optional[Transaction]:
        """
        Get a transaction by ID.
        
        Args:
            db: Database session
            transaction_id: Transaction ID
            
        Returns:
            Transaction if found, None otherwise
        """
        return db.query(Transaction).filter(Transaction.id == transaction_id).first()
    
    @staticmethod
    def get_transactions(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        is_income: Optional[bool] = None,
        category_id: Optional[int] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> List[Transaction]:
        """
        Get list of transactions with optional filters.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            is_income: Filter by income/expense
            category_id: Filter by category ID
            
        Returns:
            List of transactions
        """
        query = db.query(Transaction)

        if is_income is not None:
            query = query.filter(Transaction.is_income == is_income)

        if category_id is not None:
            query = query.filter(Transaction.category_id == category_id)

        # Filter by date range if provided (dates stored as YYYY-MM-DD strings)
        if start_date is not None:
            query = query.filter(Transaction.date >= start_date)
        if end_date is not None:
            query = query.filter(Transaction.date <= end_date)

        return query.order_by(Transaction.id.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_transactions_aggregate(
        db: Session,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> dict:
        """
        Return aggregated totals for income and expenses and list of transactions in range.
        """
        query = db.query(Transaction)
        if start_date is not None:
            query = query.filter(Transaction.date >= start_date)
        if end_date is not None:
            query = query.filter(Transaction.date <= end_date)

        transactions = query.order_by(Transaction.id.desc()).all()

        total_income = sum(t.amount for t in transactions if t.is_income)
        total_expense = sum(t.amount for t in transactions if not t.is_income)

        return {
            'transactions': transactions,
            'total_income': total_income,
            'total_expense': total_expense,
            'balance': total_income - total_expense
        }
    
    @staticmethod
    def update_transaction(
        db: Session,
        transaction_id: int,
        transaction_update: TransactionUpdate
    ) -> Transaction:
        """
        Update a transaction.
        
        Args:
            db: Database session
            transaction_id: Transaction ID
            transaction_update: Updated transaction data
            
        Returns:
            Updated transaction
            
        Raises:
            HTTPException: If transaction or category not found
        """
        db_transaction = TransactionService.get_transaction(db, transaction_id)
        if not db_transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        update_data = transaction_update.model_dump(exclude_unset=True)
        
        # Validate category if being updated
        if 'category_id' in update_data:
            category = db.query(Category).filter(Category.id == update_data['category_id']).first()
            if not category:
                raise HTTPException(status_code=404, detail="Category not found")
        
        for field, value in update_data.items():
            setattr(db_transaction, field, value)
        
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    
    @staticmethod
    def delete_transaction(db: Session, transaction_id: int) -> bool:
        """
        Delete a transaction.
        
        Args:
            db: Database session
            transaction_id: Transaction ID
            
        Returns:
            True if deleted, False otherwise
            
        Raises:
            HTTPException: If transaction not found
        """
        db_transaction = TransactionService.get_transaction(db, transaction_id)
        if not db_transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        db.delete(db_transaction)
        db.commit()
        return True

