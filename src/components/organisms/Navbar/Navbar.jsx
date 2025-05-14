// src/components/organisms/Navbar/Navbar.jsx
import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NavItem from '../../molecules/NavItem/NavItem';
import { AppContext } from '../../../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCatalogMenu, setShowCatalogMenu] = useState(false);
  const { isAuthenticated, user, isAdmin, logout } = useContext(AppContext);
  
  const navigate = useNavigate();

  // Log para debugging del usuario actual y estado de admin
  useEffect(() => {
    if (user) {
      console.log("Navbar - Usuario actual:", user);
      console.log("Navbar - Estado isAdmin:", isAdmin);
      console.log("Navbar - Email:", user.email);
      console.log("Navbar - Role:", user.role);
      console.log("Navbar - ¿Tiene nombre_completo?", user.hasOwnProperty('nombre_completo'));
      console.log("Navbar - ¿Tiene name?", user.hasOwnProperty('name'));
    }
  }, [user, isAdmin]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    // Cierra el menú de catálogos si está abierto
    if (showCatalogMenu) setShowCatalogMenu(false);
  };
  
  const toggleCatalogMenu = (e) => {
    e.stopPropagation(); // Evitar que el clic afecte a otros elementos
    setShowCatalogMenu(!showCatalogMenu);
  };
  
  const handleLogout = () => {
    logout();  
    navigate('/');
  };

  // Determinar si es admin de forma más robusta
  const userIsAdmin = isAdmin || 
                     (user && (user.role === 'admin' || 
                             user.email === 'admin@hotmail.com'));
  
  // Determinar el nombre a mostrar - compatible con ambas estructuras
  const displayName = user?.nombre_completo || user?.name || 'Usuario';
  const userInitial = displayName.charAt(0).toUpperCase();

  // Cerrar menú de usuario al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userMenuContainer = document.querySelector('.user-menu-container');
      if (userMenuContainer && !userMenuContainer.contains(event.target) && showUserMenu) {
        setShowUserMenu(false);
        setShowCatalogMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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
        {isAuthenticated && userIsAdmin && (
          <></>
        )}
        {isAuthenticated && !userIsAdmin && (
          <NavItem link="/solicitar-pedido" text="Solicitar Pedido" />
        )}
      </ul>
      
      <div className="auth-buttons">
        {isAuthenticated && user ? (
          <div className="user-menu-container">
            <button className="user-button" onClick={toggleUserMenu}>
              <span className="user-initials">
                {userInitial}
              </span>
              <span className="user-name">
                {displayName}
                {userIsAdmin && ' (Admin)'}
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
                {userIsAdmin ? (
                  // Menú para admin
                  <>
                    <NavLink to="/pedidos-admin" className="dropdown-item">Gestión de Pedidos</NavLink>
                    <div className="dropdown-catalog">
                      <button className="dropdown-catalog-button" onClick={toggleCatalogMenu}>
                        Catálogos
                        <svg 
                          className={`dropdown-icon ${showCatalogMenu ? 'active' : ''}`} 
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
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                      {showCatalogMenu && (
                        <div className="catalog-submenu">
                          <NavLink to="/admin/usuarios" className="dropdown-item">Ver lista de usuarios</NavLink>
                          <NavLink to="/admin/tipos-usuario" className="dropdown-item">Ver lista de tipos de usuario</NavLink>
                          <NavLink to="/admin/figura-fiscal" className="dropdown-item">Ver lista de figura fiscal</NavLink>
                        </div>
                      )}
                    </div>
                    <NavLink to="/admin/productos" className="dropdown-item">Gestión de Productos</NavLink>
                  </>
                ) : (
                  // Menú para usuarios normales
                  <>
                    <NavLink to="/ordenes-trabajo" className="dropdown-item">Órdenes de Trabajo</NavLink>
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