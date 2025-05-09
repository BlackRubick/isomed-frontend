import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', onClick, type = 'button' }) => {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;