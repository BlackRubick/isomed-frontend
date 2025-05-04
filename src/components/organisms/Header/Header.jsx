// Header.jsx
import React from 'react';
import Navbar from '../Navbar/Navbar';
import Logo from '../../atoms/Logo/Logo';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Logo />
          <Navbar />
        </div>
      </div>
    </header>
  );
};

export default Header;