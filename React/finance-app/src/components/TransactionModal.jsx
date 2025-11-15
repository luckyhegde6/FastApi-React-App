import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';

const TransactionModal = ({ isOpen, onClose, onSubmit, categories, transaction = null }) => {
  const [formData, setFormData] = React.useState({
    amount: '',
    category_id: '',
    description: '',
    is_income: false,
    date: new Date().toISOString().split('T')[0],
  });

  // Filter categories based on is_income
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => cat.is_income === formData.is_income);
  }, [categories, formData.is_income]);

  // Populate form when editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        category_id: transaction.category_id.toString(),
        description: transaction.description || '',
        is_income: transaction.is_income,
        date: transaction.date,
      });
    } else {
      setFormData({
        amount: '',
        category_id: '',
        description: '',
        is_income: false,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [transaction, isOpen]);

  const handleInputChange = (event) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    
    const newFormData = {
      ...formData,
      [event.target.name]: value,
    };
    
    // Reset category_id when is_income changes
    if (event.target.name === 'is_income') {
      newFormData.category_id = '';
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
      category_id: parseInt(formData.category_id),
    };
    onSubmit(submitData);
  };

  const title = transaction ? 'Edit Transaction' : 'Add Transaction';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
            Amount *
          </label>
          <input
            type="number"
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount"
            name="amount"
            onChange={handleInputChange}
            value={formData.amount}
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              id="is_income"
              name="is_income"
              checked={formData.is_income}
              onChange={handleInputChange}
            />
            <span className="text-gray-700 text-sm font-bold">Income?</span>
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="category_id" className="block text-gray-700 text-sm font-bold mb-2">
            Category *
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category_id"
            name="category_id"
            onChange={handleInputChange}
            value={formData.category_id}
            required
          >
            <option value="">Select a category</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {filteredCategories.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No categories available. {formData.is_income ? 'Income' : 'Expense'} categories will appear here.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            onChange={handleInputChange}
            value={formData.description}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
            Date *
          </label>
          <input
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            name="date"
            onChange={handleInputChange}
            value={formData.date}
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {transaction ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

TransactionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      is_income: PropTypes.bool.isRequired,
    })
  ).isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    category_id: PropTypes.number.isRequired,
    description: PropTypes.string,
    is_income: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired,
  }),
};

export default TransactionModal;

