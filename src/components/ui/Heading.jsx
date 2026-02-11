import React from 'react';
import PropTypes from 'prop-types';

export const Heading = ({ children, level = 1, className = '', ...props }) => {
  const Tag = `h${level}`;
  
  const sizes = {
    1: "text-3xl font-semibold tracking-tight text-gray-900",
    2: "text-2xl font-semibold border-b border-gray-200 pb-2 text-gray-900",
    3: "text-xl font-semibold text-gray-900",
    4: "text-base font-semibold text-gray-900",
    5: "text-sm font-semibold text-gray-900",
    6: "text-xs font-semibold text-gray-500 uppercase tracking-wider",
  };

  return (
    <Tag className={`${sizes[level]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

Heading.propTypes = {
  children: PropTypes.node,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  className: PropTypes.string,
};
