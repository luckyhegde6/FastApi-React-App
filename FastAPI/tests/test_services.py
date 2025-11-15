import pytest
from services.transaction_service import TransactionService
from schemas import TransactionCreate, TransactionUpdate
from fastapi import HTTPException


class TestTransactionService:
    """Test suite for transaction service."""
    
    def test_create_transaction(self, db_session, sample_transaction_data):
        """Test creating a transaction via service."""
        transaction = TransactionCreate(**sample_transaction_data)
        result = TransactionService.create_transaction(db_session, transaction)
        
        assert result.id is not None
        assert result.amount == sample_transaction_data["amount"]
        assert result.category == sample_transaction_data["category"]
    
    def test_get_transaction(self, db_session, sample_transaction_data):
        """Test getting a transaction by ID."""
        transaction = TransactionCreate(**sample_transaction_data)
        created = TransactionService.create_transaction(db_session, transaction)
        
        result = TransactionService.get_transaction(db_session, created.id)
        assert result is not None
        assert result.id == created.id
        assert result.amount == created.amount
    
    def test_get_transaction_not_found(self, db_session):
        """Test getting a non-existent transaction."""
        result = TransactionService.get_transaction(db_session, 999)
        assert result is None
    
    def test_get_transactions(self, db_session, sample_transaction_data):
        """Test getting list of transactions."""
        # Create multiple transactions
        for i in range(3):
            data = sample_transaction_data.copy()
            data["description"] = f"Transaction {i}"
            transaction = TransactionCreate(**data)
            TransactionService.create_transaction(db_session, transaction)
        
        results = TransactionService.get_transactions(db_session)
        assert len(results) == 3
    
    def test_get_transactions_with_filters(self, db_session, sample_transaction_data, sample_income_data):
        """Test getting transactions with filters."""
        TransactionService.create_transaction(db_session, TransactionCreate(**sample_transaction_data))
        TransactionService.create_transaction(db_session, TransactionCreate(**sample_income_data))
        
        # Filter by income
        income_transactions = TransactionService.get_transactions(db_session, is_income=True)
        assert len(income_transactions) == 1
        assert income_transactions[0].is_income is True
        
        # Filter by category
        food_transactions = TransactionService.get_transactions(db_session, category="Food")
        assert len(food_transactions) == 1
        assert food_transactions[0].category == "Food"
    
    def test_update_transaction(self, db_session, sample_transaction_data):
        """Test updating a transaction."""
        transaction = TransactionCreate(**sample_transaction_data)
        created = TransactionService.create_transaction(db_session, transaction)
        
        update_data = TransactionUpdate(amount=200.0, description="Updated")
        updated = TransactionService.update_transaction(db_session, created.id, update_data)
        
        assert updated.amount == 200.0
        assert updated.description == "Updated"
        assert updated.category == sample_transaction_data["category"]  # Unchanged
    
    def test_update_transaction_not_found(self, db_session):
        """Test updating a non-existent transaction."""
        update_data = TransactionUpdate(amount=200.0)
        with pytest.raises(HTTPException) as exc_info:
            TransactionService.update_transaction(db_session, 999, update_data)
        assert exc_info.value.status_code == 404
    
    def test_delete_transaction(self, db_session, sample_transaction_data):
        """Test deleting a transaction."""
        transaction = TransactionCreate(**sample_transaction_data)
        created = TransactionService.create_transaction(db_session, transaction)
        
        result = TransactionService.delete_transaction(db_session, created.id)
        assert result is True
        
        # Verify deletion
        deleted = TransactionService.get_transaction(db_session, created.id)
        assert deleted is None
    
    def test_delete_transaction_not_found(self, db_session):
        """Test deleting a non-existent transaction."""
        with pytest.raises(HTTPException) as exc_info:
            TransactionService.delete_transaction(db_session, 999)
        assert exc_info.value.status_code == 404

