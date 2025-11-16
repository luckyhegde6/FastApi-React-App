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
              <span className="inline-flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                Transactions
              </span>
            </button>
            <button
              onClick={() => onTabChange('categories')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <span className="inline-flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4v4h8v-4c0-2.21-1.79-4-4-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8v8a2 2 0 002 2h8a2 2 0 002-2V8" />
                </svg>
                Categories
              </span>
            </button>
            <button
              onClick={() => onTabChange('reports')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <span className="inline-flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10" />
                </svg>
                Reports
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  activeTab: PropTypes.oneOf(['transactions', 'categories', 'reports']).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default Navbar;

