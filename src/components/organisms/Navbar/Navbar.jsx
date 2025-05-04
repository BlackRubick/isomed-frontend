// src/components/organisms/Navbar/Navbar.jsx
import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NavItem from '../../molecules/NavItem/NavItem';
import { AppContext } from '../../../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, isAdmin, logout } = useContext(AppContext);
  
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  const handleLogout = () => {
    logout();  // Utilizamos la función de logout del contexto
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="mobile-menu-toggle" onClick={toggleMenu}>
        <span className={`burger-icon ${isOpen ? 'active' : ''}`}></span>
      </div>
      
      <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
        <NavItem link="/" text="Inicio" />
        <NavItem link="/servicios" text="Servicios" />
        <NavItem link="/productos" text="Productos" />
        <NavItem link="/nosotros" text="Nosotros" />
        <NavItem link="/contacto" text="Contacto" />
        {isAuthenticated && isAdmin && (
          <NavItem link="/pedidos-admin" text="Ver Pedidos" />
        )}
        {isAuthenticated && !isAdmin && (
          <NavItem link="/solicitar-pedido" text="Solicitar Pedido" />
        )}
      </ul>
      
      <div className="auth-buttons">
        {isAuthenticated ? (
          <div className="user-menu-container">
            <button className="user-button" onClick={toggleUserMenu}>
              <span className="user-initials">
                {user?.name?.charAt(0) || 'U'}
              </span>
              <span className="user-name">
                {user?.name || 'Usuario'}
                {isAdmin && ' (Admin)'}
              </span>
              <svg 
                className={`dropdown-icon ${showUserMenu ? 'active' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                {isAdmin ? (
                  // Menú para admin
                  <>
                    <NavLink to="/panel-admin" className="dropdown-item">Panel de Admin</NavLink>
                    <NavLink to="/pedidos-admin" className="dropdown-item">Gestión de Pedidos</NavLink>
                    <NavLink to="/usuarios" className="dropdown-item">Usuarios</NavLink>
                  </>
                ) : (
                  // Menú para usuarios normales
                  <>
                    <NavLink to="/profile" className="dropdown-item">Mi Perfil</NavLink>
                    <NavLink to="/mis-pedidos" className="dropdown-item">Mis Pedidos</NavLink>
                    <NavLink to="/settings" className="dropdown-item">Configuración</NavLink>
                  </>
                )}
                <button onClick={handleLogout} className="dropdown-item logout">
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink to="/login" className="login-button">
              Iniciar Sesión
            </NavLink>
            <NavLink to="/register" className="register-button">
              Registrarse
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;