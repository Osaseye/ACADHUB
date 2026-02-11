import React from 'react';
import PropTypes from 'prop-types';

export const Flash = ({ children, variant = 'info', className = '', ...props }) => {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div 
      className={`p-4 mb-4 border rounded-md ${variants[variant]} ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex">
        <div className="text-sm font-medium">
          {children}
        </div>
      </div>
    </div>
  );
};

Flash.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'danger']),
  className: PropTypes.string,
};
