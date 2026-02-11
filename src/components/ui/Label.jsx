import React from 'react';
import PropTypes from 'prop-types';

export const Label = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-600 border-gray-200",
    primary: "bg-blue-100 text-blue-700 border-blue-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    neutral: "bg-gray-100 text-gray-600 border-transparent",
  };

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Label.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'neutral']),
  className: PropTypes.string,
};
