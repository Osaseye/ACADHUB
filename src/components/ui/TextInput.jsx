import React from 'react';
import PropTypes from 'prop-types';

export const TextInput = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">
          {label}
        </label>
      )}
      <input
        className={`appearance-none block w-full px-3 py-1.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm
          ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

TextInput.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};
