import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({ children, variant = 'default', size = 'medium', className = '', ...props }) => {
  const baseStyles = "font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  const variants = {
    default: "bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    primary: "bg-green-600 border-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-50 text-red-600 border-gray-300 hover:bg-red-100 focus:ring-red-500",
    invisible: "bg-transparent border-transparent text-gray-500 hover:text-blue-600 shadow-none",
    outline: "bg-transparent border-gray-300 text-blue-600 hover:bg-gray-50",
  };

  const sizes = {
    small: "px-2 py-1 text-xs",
    medium: "px-4 py-1.5 text-sm",
    large: "px-6 py-2 text-base",
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'primary', 'danger', 'invisible', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
};
