import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import api from '../api/api';

// Mock the API module
vi.mock('../api/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('App', () => {
  const mockTransactions = [
    {
      id: 1,
      amount: 100.50,
      category: 'Food',
      description: 'Lunch',
      is_income: false,
      date: '2024-01-15',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: mockTransactions });
    api.post.mockResolvedValue({ data: {} });
  });

  it('renders navbar', () => {
    render(<App />);
    expect(screen.getByText('Finance App')).toBeInTheDocument();
  });

  it('renders transaction form', () => {
    render(<App />);
    expect(screen.getByText(/add transaction/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
  });

  it('fetches and displays transactions on mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/transactions');
    });

    await waitFor(() => {
      expect(screen.getByText('$100.50')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/loading transactions/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    });

    const amountInput = screen.getByLabelText(/amount/i);
    const categoryInput = screen.getByLabelText(/category/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Fill form
    amountInput.value = '200';
    categoryInput.value = 'Transport';

    // Submit form
    submitButton.click();

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });
});

