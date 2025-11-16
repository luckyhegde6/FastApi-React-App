import React, { useEffect, useState } from 'react';
import api from './api/api';
import Navbar from './components/Navbar';
import TransactionTable from './components/TransactionTable';
import TransactionModal from './components/TransactionModal';
import ConfirmationModal from './components/ConfirmationModal';
import Categories from './components/Categories';
import Reports from './components/Reports';

const App = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [view, setView] = useState('current_month');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      // Determine date filters based on view
      const params = new URLSearchParams();
      const now = new Date();
      if (view === 'day') {
        const d = new Date(now).toISOString().slice(0,10);
        params.append('start_date', d);
        params.append('end_date', d);
      } else if (view === 'current_week') {
        const n = new Date(now);
        const first = new Date(n.getFullYear(), n.getMonth(), n.getDate() - n.getDay());
        params.append('start_date', first.toISOString().slice(0,10));
        params.append('end_date', new Date().toISOString().slice(0,10));
      } else if (view === 'current_month') {
        const n = new Date(now);
        const first = new Date(n.getFullYear(), n.getMonth(), 1);
        params.append('start_date', first.toISOString().slice(0,10));
        params.append('end_date', new Date().toISOString().slice(0,10));
      } else if (view === 'current_year') {
        const n = new Date(now);
        const first = new Date(n.getFullYear(), 0, 1);
        params.append('start_date', first.toISOString().slice(0,10));
        params.append('end_date', new Date().toISOString().slice(0,10));
      } else if (view === 'all') {
        // no params
      }

      // Override with applied filters from Reports modal if provided
      if (appliedFilters && (appliedFilters.start_date || appliedFilters.end_date)) {
        if (appliedFilters.start_date) {
          params.set('start_date', appliedFilters.start_date);
        }
        if (appliedFilters.end_date) {
          params.set('end_date', appliedFilters.end_date);
        }
        // If appliedFilters explicitly set to null/empty, ensure we don't send empty params
        if (!appliedFilters.start_date) params.delete('start_date');
        if (!appliedFilters.end_date) params.delete('end_date');
      }

      const resp = await api.get(`/transactions?${params.toString()}`);
      setTransactions(resp.data);

      // Fetch aggregate for balance
      const aggResp = await api.get(`/transactions/reports/aggregate?${params.toString()}`);
      setBalance(aggResp.data.balance || 0);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab]);

  useEffect(()=>{
    // refresh when view changes and user is on transactions
    if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [view]);

  useEffect(()=>{
    // re-fetch when appliedFilters change
    if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [appliedFilters]);

  const handleOpenTransactionModal = (transaction = null) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleTransactionSubmit = async (submitData) => {
    try {
      setError(null);
      if (selectedTransaction) {
        // Update transaction
        await api.put(`/transactions/${selectedTransaction.id}`, submitData);
      } else {
        // Create transaction
        await api.post('/transactions/', submitData);
      }
      fetchTransactions();
      handleCloseTransactionModal();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to save transaction. Please check your input and try again.';
      setError(errorMessage);
      console.error('Error saving transaction:', err);
    }
  };

  const handleEditTransaction = (transaction) => {
    handleOpenTransactionModal(transaction);
  };

  const handleDeleteTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setError(null);
      await api.delete(`/transactions/${selectedTransaction.id}`);
      fetchTransactions();
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete transaction. Please try again.';
      setError(errorMessage);
      console.error('Error deleting transaction:', err);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {activeTab === 'transactions' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
                <p className="text-sm text-gray-600">Wallet balance: <span className={"font-semibold " + (balance > 0 ? 'text-green-600' : 'text-red-600')}>${balance.toFixed(2)}</span> <svg className="inline h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg></p>
              </div>
              <div className="flex items-center space-x-4">
                <select value={view} onChange={(e)=>setView(e.target.value)} className="border rounded px-2 py-1">
                  <option value="day">Day</option>
                  <option value="current_week">Current Week</option>
                  <option value="current_month">Current Month</option>
                  <option value="current_year">Current Year</option>
                  <option value="all">All</option>
                </select>
                <button
                  onClick={() => handleOpenTransactionModal()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Add Transaction
                </button>
                <button onClick={()=>setIsReportsOpen(true)} className="bg-gray-200 px-3 py-2 rounded inline-flex items-center"><svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>Reports</button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading transactions...</p>
              </div>
            ) : (
              <TransactionTable
                transactions={transactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            )}

            {/* Transaction Modal */}
            <TransactionModal
              isOpen={isTransactionModalOpen}
              onClose={handleCloseTransactionModal}
              onSubmit={handleTransactionSubmit}
              categories={categories}
              transaction={selectedTransaction}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedTransaction(null);
              }}
              onConfirm={handleDeleteConfirm}
              title="Delete Transaction"
              message={`Are you sure you want to delete this transaction of $${selectedTransaction?.amount?.toFixed(2)}? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              variant="danger"
            />
          </>
        )}

        {activeTab === 'categories' && <Categories />}
        {activeTab === 'reports' && <Reports isOpen={true} onClose={()=>{setActiveTab('transactions')}} onApplyFilters={(f)=>{ setAppliedFilters(f); }} />}
        {/* Reports modal (also can be opened via Reports button) */}
        <Reports isOpen={isReportsOpen} onClose={()=>setIsReportsOpen(false)} onApplyFilters={(f)=>{ setAppliedFilters(f); setIsReportsOpen(false); }} />
      </div>
    </div>
  );
};

export default App;

