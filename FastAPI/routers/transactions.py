from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from services.transaction_service import TransactionService

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("/", response_model=TransactionResponse, status_code=201)
async def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new transaction.
    
    - **amount**: Transaction amount (must be positive)
    - **category_id**: Category ID
    - **description**: Optional transaction description
    - **is_income**: Whether this is an income transaction
    - **date**: Transaction date (YYYY-MM-DD format)
    """
    transaction_obj = TransactionService.create_transaction(db, transaction)
    return {
        "id": transaction_obj.id,
        "amount": transaction_obj.amount,
        "category_id": transaction_obj.category_id,
        "category_name": transaction_obj.category_obj.name if transaction_obj.category_obj else None,
        "description": transaction_obj.description,
        "is_income": transaction_obj.is_income,
        "date": transaction_obj.date
    }


@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    is_income: Optional[bool] = Query(None, description="Filter by income/expense"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    db: Session = Depends(get_db)
):
    """
    Get list of transactions.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **is_income**: Optional filter for income/expense
    - **category_id**: Optional filter by category ID
    """
    transactions = TransactionService.get_transactions(db, skip, limit, is_income, category_id)
    # Add category name to response
    result = []
    for t in transactions:
        t_dict = {
            "id": t.id,
            "amount": t.amount,
            "category_id": t.category_id,
            "category_name": t.category_obj.name if t.category_obj else None,
            "description": t.description,
            "is_income": t.is_income,
            "date": t.date
        }
        result.append(t_dict)
    return result


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a transaction by ID.
    
    - **transaction_id**: The ID of the transaction to retrieve
    """
    transaction = TransactionService.get_transaction(db, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {
        "id": transaction.id,
        "amount": transaction.amount,
        "category_id": transaction.category_id,
        "category_name": transaction.category_obj.name if transaction.category_obj else None,
        "description": transaction.description,
        "is_income": transaction.is_income,
        "date": transaction.date
    }


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a transaction.
    
    - **transaction_id**: The ID of the transaction to update
    - **transaction_update**: Updated transaction data (only provided fields will be updated)
    """
    transaction = TransactionService.update_transaction(db, transaction_id, transaction_update)
    return {
        "id": transaction.id,
        "amount": transaction.amount,
        "category_id": transaction.category_id,
        "category_name": transaction.category_obj.name if transaction.category_obj else None,
        "description": transaction.description,
        "is_income": transaction.is_income,
        "date": transaction.date
    }


@router.delete("/{transaction_id}", status_code=204)
async def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a transaction.
    
    - **transaction_id**: The ID of the transaction to delete
    """
    TransactionService.delete_transaction(db, transaction_id)
    return None

