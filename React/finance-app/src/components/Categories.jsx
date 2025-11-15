import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../api/api';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_income: false,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (event) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        is_income: category.is_income,
      });
      setSelectedCategory(category);
    } else {
      setFormData({
        name: '',
        description: '',
        is_income: false,
      });
      setSelectedCategory(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      is_income: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (selectedCategory) {
        // Update category
        await api.put(`/categories/${selectedCategory.id}`, formData);
      } else {
        // Create category
        await api.post('/categories/', formData);
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to save category. Please try again.';
      setError(errorMessage);
      console.error('Error saving category:', err);
    }
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setError(null);
      await api.delete(`/categories/${selectedCategory.id}`);
      fetchCategories();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete category. Please try again.';
      setError(errorMessage);
      console.error('Error deleting category:', err);
      setIsDeleteModalOpen(false);
    }
  };

  const expenseCategories = categories.filter(cat => !cat.is_income);
  const incomeCategories = categories.filter(cat => cat.is_income);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            + Add Category
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense Categories */}
            <div className="bg-white shadow-md rounded overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Expense Categories</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {expenseCategories.length === 0 ? (
                  <div className="px-6 py-4 text-center text-gray-500">
                    No expense categories found
                  </div>
                ) : (
                  expenseCategories.map((category) => (
                    <div key={category.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                        {category.description && (
                          <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        )}
                        {category.is_default && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {!category.is_default && (
                          <>
                            <button
                              onClick={() => handleOpenModal(category)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit category"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(category)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete category"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Income Categories */}
            <div className="bg-white shadow-md rounded overflow-hidden">
              <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Income Categories</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {incomeCategories.length === 0 ? (
                  <div className="px-6 py-4 text-center text-gray-500">
                    No income categories found
                  </div>
                ) : (
                  incomeCategories.map((category) => (
                    <div key={category.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                        {category.description && (
                          <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        )}
                        {category.is_default && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {!category.is_default && (
                          <>
                            <button
                              onClick={() => handleOpenModal(category)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit category"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(category)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete category"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Category Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedCategory ? 'Edit Category' : 'Add Category'}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name *
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                name="name"
                onChange={handleInputChange}
                value={formData.name}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                onChange={handleInputChange}
                value={formData.description}
                rows="3"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  id="is_income"
                  name="is_income"
                  checked={formData.is_income}
                  onChange={handleInputChange}
                />
                <span className="text-gray-700 text-sm font-bold">Income Category?</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {selectedCategory ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Category"
          message={`Are you sure you want to delete the category "${selectedCategory?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default Categories;

