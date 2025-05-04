import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">

       
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ISOMED - Ingeniería en Soluciones Médicas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;