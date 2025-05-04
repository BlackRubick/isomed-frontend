// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated');
      const userData = localStorage.getItem('user');
      
      if (auth === 'true' && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    // Verificar al montar el componente
    checkAuth();
    
    // Escuchar evento de cambio de autenticación
    window.addEventListener('auth-change', checkAuth);
    
    // Limpiar el listener al desmontar
    return () => {
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);
  
  // Función para iniciar sesión
  const login = (userData) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    window.dispatchEvent(new Event('auth-change'));
  };
  
  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      setState, 
      isAuthenticated, 
      user, 
      login, 
      logout 
    }}>
      {children}
    </AppContext.Provider>
  );
};