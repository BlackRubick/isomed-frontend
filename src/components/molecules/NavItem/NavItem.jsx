// NavItem.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavItem.css';

const NavItem = ({ link, text }) => {
  return (
    <li className="nav-item">
      <NavLink 
        to={link} 
        className={({ isActive }) => 
          isActive ? "nav-link active" : "nav-link"
        }
      >
        {text}
      </NavLink>
    </li>
  );
};

export default NavItem;