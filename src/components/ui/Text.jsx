import React from 'react';
import PropTypes from 'prop-types';

export const Text = ({ children, as = 'p', size = 'medium', color = 'default', className = '', ...props }) => {
  const Tag = as;
  
  const sizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  const colors = {
    default: "text-gray-900",
    muted: "text-gray-500",
    success: "text-green-600",
    danger: "text-red-600",
    white: "text-white",
  };

  return (
    <Tag className={`${sizes[size]} ${colors[color]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

Text.propTypes = {
  children: PropTypes.node,
  as: PropTypes.elementType,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['default', 'muted', 'success', 'danger', 'white']),
  className: PropTypes.string,
};
