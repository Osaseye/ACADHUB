import React from 'react';
import PropTypes from 'prop-types';

export const Box = ({ children, className = '', ...props }) => {
  return (
    <div className={`border border-gray-200 rounded-md bg-white ${className}`} {...props}>
      {children}
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
