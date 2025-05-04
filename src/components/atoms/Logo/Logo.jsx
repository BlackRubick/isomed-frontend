import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = () => {
  return (
    <div className="logo">
      <Link to="/">
        <img src="src/assets/images/logoformal.png" alt="ISOMED Logo" />
      </Link>
    </div>
  );
};

export default Logo;