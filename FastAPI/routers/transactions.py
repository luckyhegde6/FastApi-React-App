from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from services.transaction_service import TransactionService
import csv
import io
from fastapi.responses import StreamingResponse, Response

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
        "category": transaction_obj.category_obj.name if transaction_obj.category_obj else None, "category_name": transaction_obj.category_obj.name if transaction_obj.category_obj else None,
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
    start_date: Optional[str] = Query(None, description='Start date YYYY-MM-DD'),
    end_date: Optional[str] = Query(None, description='End date YYYY-MM-DD'),
    db: Session = Depends(get_db)
):
    """
    Get list of transactions.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **is_income**: Optional filter for income/expense
    - **category_id**: Optional filter by category ID
    """
    transactions = TransactionService.get_transactions(db, skip, limit, is_income, category_id, start_date, end_date)
    # Add category name to response
    result = []
    for t in transactions:
        t_dict = {
            "id": t.id,
            "amount": t.amount,
            "category_id": t.category_id,
            "category": t.category_obj.name if t.category_obj else None, "category_name": t.category_obj.name if t.category_obj else None,
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
        "category": transaction.category_obj.name if transaction.category_obj else None, "category_name": transaction.category_obj.name if transaction.category_obj else None,
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
        "category": transaction.category_obj.name if transaction.category_obj else None, "category_name": transaction.category_obj.name if transaction.category_obj else None,
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




@router.get('/reports/aggregate')
async def get_report_aggregate(
    start_date: Optional[str] = Query(None, description='Start date YYYY-MM-DD'),
    end_date: Optional[str] = Query(None, description='End date YYYY-MM-DD'),
    db: Session = Depends(get_db)
):
    """Return aggregated totals (income, expense, balance) and transactions count for a date range."""
    agg = TransactionService.get_transactions_aggregate(db, start_date, end_date)
    return {
        'total_income': agg['total_income'],
        'total_expense': agg['total_expense'],
        'balance': agg['balance'],
        'count': len(agg['transactions'])
    }


@router.get('/reports/download')
async def download_report(
    file_type: str = Query('csv', regex='^(csv|pdf)$'),
    start_date: Optional[str] = Query(None, description='Start date YYYY-MM-DD'),
    end_date: Optional[str] = Query(None, description='End date YYYY-MM-DD'),
    db: Session = Depends(get_db)
):
    """Download transactions as CSV or PDF for a given date range.

    CSV: returns a CSV streaming response.
    PDF: returns a simple text-based PDF (basic fallback) if PDF generation libraries unavailable.
    """
    agg = TransactionService.get_transactions_aggregate(db, start_date, end_date)
    transactions = agg['transactions']

    if file_type == 'csv':
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['id', 'amount', 'category_id', 'category_name', 'description', 'is_income', 'date'])
        for t in transactions:
            writer.writerow([
                t.id,
                t.amount,
                t.category_id,
                t.category_obj.name if t.category_obj else None,
                t.description,
                t.is_income,
                t.date
            ])
        output.seek(0)
        headers = {
            'Content-Disposition': f'attachment; filename="transactions_{start_date or "all"}_{end_date or "all"}.csv"'
        }
        return StreamingResponse(iter([output.getvalue().encode('utf-8')]), media_type='text/csv', headers=headers)

    # Generate a nicely formatted PDF using reportlab
    try:
        from reportlab.lib.pagesizes import letter, landscape
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib.units import inch
        import datetime

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=landscape(letter), leftMargin=0.5*inch, rightMargin=0.5*inch)
        styles = getSampleStyleSheet()
        elems = []

        title = Paragraph('Transactions Report', styles['Title'])
        elems.append(title)
        elems.append(Spacer(1, 0.1*inch))
        date_range_text = f'Date Range: {start_date or "-"} to {end_date or "-"}  Generated: {datetime.date.today()}'
        elems.append(Paragraph(date_range_text, styles['Normal']))
        elems.append(Spacer(1, 0.2*inch))

        # Build table data
        data = [['ID', 'Amount', 'Category', 'Description', 'Type', 'Date']]
        for t in transactions:
            data.append([
                str(t.id),
                f"{t.amount:.2f}",
                t.category_obj.name if t.category_obj else '',
                (t.description or '').replace('\n', ' '),
                'Income' if t.is_income else 'Expense',
                t.date
            ])

        table = Table(data, repeatRows=1)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f0f0f0')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.black),
            ('ALIGN', (1,1), (-1,-1), 'LEFT'),
            ('GRID', (0,0), (-1,-1), 0.25, colors.grey),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))

        elems.append(table)
        doc.build(elems)
        buffer.seek(0)
        headers = {
            'Content-Disposition': f'attachment; filename="transactions_{start_date or "all"}_{end_date or "all"}.pdf"'
        }
        return StreamingResponse(buffer, media_type='application/pdf', headers=headers)
    except Exception as e:
        # If PDF generation fails, fall back to plain text CSV-like response
        body = '\n'.join([f"{t.id},{t.amount},{t.category_obj.name if t.category_obj else ''},{(t.description or '').replace('\n',' ')},{t.is_income},{t.date}" for t in transactions])
        headers = {'Content-Disposition': f'attachment; filename="transactions_{start_date or "all"}_{end_date or "all"}.pdf"'}
        return Response(content=body.encode('utf-8'), media_type='application/pdf', headers=headers)

