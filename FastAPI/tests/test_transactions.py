import pytest
from fastapi import status


class TestTransactionEndpoints:
    """Test suite for transaction endpoints."""
    
    def test_create_transaction(self, client, sample_transaction_data):
        """Test creating a new transaction."""
        response = client.post("/transactions/", json=sample_transaction_data)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["amount"] == sample_transaction_data["amount"]
        assert data["category"] == sample_transaction_data["category"]
        assert data["description"] == sample_transaction_data["description"]
        assert data["is_income"] == sample_transaction_data["is_income"]
        assert data["date"] == sample_transaction_data["date"]
        assert "id" in data
    
    def test_create_transaction_income(self, client, sample_income_data):
        """Test creating an income transaction."""
        response = client.post("/transactions/", json=sample_income_data)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["is_income"] is True
        assert data["amount"] == sample_income_data["amount"]
    
    def test_create_transaction_invalid_amount(self, client, sample_transaction_data):
        """Test creating a transaction with invalid amount."""
        invalid_data = sample_transaction_data.copy()
        invalid_data["amount"] = -10.0
        response = client.post("/transactions/", json=invalid_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_create_transaction_invalid_date(self, client, sample_transaction_data):
        """Test creating a transaction with invalid date format."""
        invalid_data = sample_transaction_data.copy()
        invalid_data["date"] = "invalid-date"
        response = client.post("/transactions/", json=invalid_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_create_transaction_missing_fields(self, client):
        """Test creating a transaction with missing required fields."""
        incomplete_data = {"amount": 100.0}
        response = client.post("/transactions/", json=incomplete_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_get_transactions_empty(self, client):
        """Test getting transactions when database is empty."""
        response = client.get("/transactions/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []
    
    def test_get_transactions(self, client, sample_transaction_data, sample_income_data):
        """Test getting list of transactions."""
        # Create multiple transactions
        client.post("/transactions/", json=sample_transaction_data)
        client.post("/transactions/", json=sample_income_data)
        
        response = client.get("/transactions/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
    
    def test_get_transactions_with_pagination(self, client, sample_transaction_data):
        """Test getting transactions with pagination."""
        # Create multiple transactions
        for i in range(5):
            data = sample_transaction_data.copy()
            data["description"] = f"Transaction {i}"
            client.post("/transactions/", json=data)
        
        response = client.get("/transactions/?skip=2&limit=2")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
    
    def test_get_transactions_filter_by_income(self, client, sample_transaction_data, sample_income_data):
        """Test filtering transactions by income/expense."""
        client.post("/transactions/", json=sample_transaction_data)
        client.post("/transactions/", json=sample_income_data)
        
        # Get only income transactions
        response = client.get("/transactions/?is_income=true")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["is_income"] is True
        
        # Get only expense transactions
        response = client.get("/transactions/?is_income=false")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["is_income"] is False
    
    def test_get_transactions_filter_by_category(self, client, sample_transaction_data):
        """Test filtering transactions by category."""
        client.post("/transactions/", json=sample_transaction_data)
        
        # Create another transaction with different category
        other_data = sample_transaction_data.copy()
        other_data["category"] = "Transport"
        client.post("/transactions/", json=other_data)
        
        response = client.get("/transactions/?category=Food")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["category"] == "Food"
    
    def test_get_transaction_by_id(self, client, sample_transaction_data):
        """Test getting a transaction by ID."""
        create_response = client.post("/transactions/", json=sample_transaction_data)
        transaction_id = create_response.json()["id"]
        
        response = client.get(f"/transactions/{transaction_id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == transaction_id
        assert data["amount"] == sample_transaction_data["amount"]
    
    def test_get_transaction_not_found(self, client):
        """Test getting a non-existent transaction."""
        response = client.get("/transactions/999")
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_transaction(self, client, sample_transaction_data):
        """Test updating a transaction."""
        create_response = client.post("/transactions/", json=sample_transaction_data)
        transaction_id = create_response.json()["id"]
        
        update_data = {"amount": 200.0, "description": "Updated description"}
        response = client.put(f"/transactions/{transaction_id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["amount"] == 200.0
        assert data["description"] == "Updated description"
        assert data["category"] == sample_transaction_data["category"]  # Unchanged
    
    def test_update_transaction_not_found(self, client):
        """Test updating a non-existent transaction."""
        update_data = {"amount": 200.0}
        response = client.put("/transactions/999", json=update_data)
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_transaction_invalid_amount(self, client, sample_transaction_data):
        """Test updating a transaction with invalid amount."""
        create_response = client.post("/transactions/", json=sample_transaction_data)
        transaction_id = create_response.json()["id"]
        
        update_data = {"amount": -10.0}
        response = client.put(f"/transactions/{transaction_id}", json=update_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_delete_transaction(self, client, sample_transaction_data):
        """Test deleting a transaction."""
        create_response = client.post("/transactions/", json=sample_transaction_data)
        transaction_id = create_response.json()["id"]
        
        response = client.delete(f"/transactions/{transaction_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify transaction is deleted
        get_response = client.get(f"/transactions/{transaction_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_transaction_not_found(self, client):
        """Test deleting a non-existent transaction."""
        response = client.delete("/transactions/999")
        assert response.status_code == status.HTTP_404_NOT_FOUND

