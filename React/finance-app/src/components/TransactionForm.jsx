import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const TransactionForm = ({ formData, categories, handleInputChange, handleFormSubmit }) => {
  // Filter categories based on is_income
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => cat.is_income === formData.is_income);
  }, [categories, formData.is_income]);

  return (
    <form onSubmit={handleFormSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
          Amount
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
        <label htmlFor="category_id" className="block text-gray-700 text-sm font-bold mb-2">
          Category
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

      <div className="mb-4">
        <label className="flex items-center">
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

      <div className="mb-6">
        <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
          Date
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

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

TransactionForm.propTypes = {
  formData: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string.isRequired,
    is_income: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      is_income: PropTypes.bool.isRequired,
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
};

export default TransactionForm;

