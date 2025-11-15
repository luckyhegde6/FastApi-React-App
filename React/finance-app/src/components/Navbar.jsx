import React from 'react';
import PropTypes from 'prop-types';

const Navbar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Finance App</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => onTabChange('transactions')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => onTabChange('categories')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              Categories
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  activeTab: PropTypes.oneOf(['transactions', 'categories']).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default Navbar;

