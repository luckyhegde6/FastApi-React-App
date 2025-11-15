import React, { useEffect, useState } from 'react';
import api from './api/api';
import Navbar from './components/Navbar';
import TransactionTable from './components/TransactionTable';
import TransactionModal from './components/TransactionModal';
import ConfirmationModal from './components/ConfirmationModal';
import Categories from './components/Categories';

const App = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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
      const response = await api.get('/transactions');
      setTransactions(response.data);
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
              <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
              <button
                onClick={() => handleOpenTransactionModal()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                + Add Transaction
              </button>
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
      </div>
    </div>
  );
};

export default App;

