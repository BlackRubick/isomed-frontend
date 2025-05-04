import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NavItem from '../../molecules/NavItem/NavItem';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (auth === 'true' && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
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
                <NavLink to="/profile" className="dropdown-item">Mi Perfil</NavLink>
                <NavLink to="/orders" className="dropdown-item">Mis Pedidos</NavLink>
                <NavLink to="/settings" className="dropdown-item">Configuración</NavLink>
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