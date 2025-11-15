import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionForm from '../TransactionForm';

describe('TransactionForm', () => {
  const mockFormData = {
    amount: '',
    category: '',
    description: '',
    is_income: false,
    date: '2024-01-15',
  };

  const mockHandleInputChange = vi.fn();
  const mockHandleFormSubmit = vi.fn((e) => e.preventDefault());

  it('renders all form fields', () => {
    render(
      <TransactionForm
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        handleFormSubmit={mockHandleFormSubmit}
      />
    );

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('displays form data correctly', () => {
    const formDataWithValues = {
      ...mockFormData,
      amount: '100.50',
      category: 'Food',
      description: 'Lunch',
      is_income: true,
    };

    render(
      <TransactionForm
        formData={formDataWithValues}
        handleInputChange={mockHandleInputChange}
        handleFormSubmit={mockHandleFormSubmit}
      />
    );

    expect(screen.getByDisplayValue('100.50')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Food')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lunch')).toBeInTheDocument();
    expect(screen.getByLabelText(/income/i)).toBeChecked();
  });

  it('calls handleInputChange when input changes', () => {
    render(
      <TransactionForm
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        handleFormSubmit={mockHandleFormSubmit}
      />
    );

    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '200', name: 'amount' } });

    expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
  });

  it('calls handleFormSubmit when form is submitted', () => {
    render(
      <TransactionForm
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        handleFormSubmit={mockHandleFormSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(mockHandleFormSubmit).toHaveBeenCalledTimes(1);
  });

  it('handles checkbox change correctly', () => {
    render(
      <TransactionForm
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        handleFormSubmit={mockHandleFormSubmit}
      />
    );

    const incomeCheckbox = screen.getByLabelText(/income/i);
    fireEvent.click(incomeCheckbox);

    expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
  });
});

