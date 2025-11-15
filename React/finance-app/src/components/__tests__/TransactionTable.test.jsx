import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TransactionTable from '../TransactionTable';

describe('TransactionTable', () => {
  const mockTransactions = [
    {
      id: 1,
      amount: 100.50,
      category: 'Food',
      description: 'Lunch',
      is_income: false,
      date: '2024-01-15',
    },
    {
      id: 2,
      amount: 5000.00,
      category: 'Salary',
      description: 'Monthly salary',
      is_income: true,
      date: '2024-01-01',
    },
  ];

  it('renders empty state when no transactions', () => {
    render(<TransactionTable transactions={[]} />);
    expect(screen.getByText(/no transactions found/i)).toBeInTheDocument();
  });

  it('renders transactions table with data', () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText('$100.50')).toBeInTheDocument();
    expect(screen.getByText('$5000.00')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Monthly salary')).toBeInTheDocument();
  });

  it('displays correct transaction type badges', () => {
    render(<TransactionTable transactions={mockTransactions} />);

    const incomeBadges = screen.getAllByText('Income');
    const expenseBadges = screen.getAllByText('Expense');

    expect(incomeBadges.length).toBeGreaterThan(0);
    expect(expenseBadges.length).toBeGreaterThan(0);
  });

  it('displays dates correctly', () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('handles missing description gracefully', () => {
    const transactionsWithoutDescription = [
      {
        id: 1,
        amount: 100.50,
        category: 'Food',
        description: null,
        is_income: false,
        date: '2024-01-15',
      },
    ];

    render(<TransactionTable transactions={transactionsWithoutDescription} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});

