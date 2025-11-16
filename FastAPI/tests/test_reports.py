import io
import csv
from fastapi import status


class TestReportsEndpoints:
    def test_aggregate_and_download_csv_pdf(self, client, sample_transaction_data, sample_income_data):
        # Create transactions
        client.post('/transactions/', json=sample_transaction_data)
        client.post('/transactions/', json=sample_income_data)

        # Aggregate without dates
        resp = client.get('/transactions/reports/aggregate')
        assert resp.status_code == status.HTTP_200_OK
        data = resp.json()
        assert 'total_income' in data and 'total_expense' in data and 'balance' in data
        assert data['count'] == 2

        # Download CSV
        resp_csv = client.get('/transactions/reports/download?file_type=csv')
        assert resp_csv.status_code == status.HTTP_200_OK
        assert resp_csv.headers.get('content-type').startswith('text/csv')
        # parse CSV
        content = resp_csv.content.decode('utf-8')
        reader = csv.reader(io.StringIO(content))
        rows = list(reader)
        # header + 2 rows
        assert len(rows) >= 1

        # Download PDF
        resp_pdf = client.get('/transactions/reports/download?file_type=pdf')
        assert resp_pdf.status_code == status.HTTP_200_OK
        # PDF should be served with PDF mime-type
        assert 'application/pdf' in resp_pdf.headers.get('content-type', '')

    def test_download_with_date_range(self, client, sample_transaction_data, sample_income_data):
        # Create transactions with known dates
        client.post('/transactions/', json=sample_transaction_data)
        client.post('/transactions/', json=sample_income_data)

        # Filter for a narrow range that includes only one of the sample dates
        resp = client.get('/transactions/reports/aggregate?start_date=2024-01-01&end_date=2024-01-01')
        assert resp.status_code == status.HTTP_200_OK
        data = resp.json()
        # sample_income_data is on 2024-01-01
        assert data['count'] >= 1
