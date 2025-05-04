// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Verificar autenticación al cargar y crear usuario admin si no existe
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated');
      const userData = localStorage.getItem('user');
      
      if (auth === 'true' && userData) {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setIsAdmin(parsedUser.email === 'admin@hotmail.com');
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
      }
    };
    
    // Verificar si ya existe el usuario admin
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      // Crear usuario admin
      const admin = {
        name: 'Administrador',
        email: 'admin@hotmail.com',
        password: 'admin123', // En una app real, nunca almacenar contraseñas sin encriptar
        role: 'admin'
      };
      
      localStorage.setItem('adminUser', JSON.stringify(admin));
      console.log('Usuario administrador creado correctamente');
    }
    
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
    // Comprueba si es el admin
    if (userData.email === 'admin@hotmail.com' && userData.password === 'admin123') {
      const admin = {
        name: 'Administrador',
        email: 'admin@hotmail.com',
        role: 'admin'
      };
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(admin));
      setIsAuthenticated(true);
      setUser(admin);
      setIsAdmin(true);
    } else {
      // Login de usuario normal
      const user = {
        ...userData,
        role: 'user'
      };
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      setIsAdmin(false);
    }
    
    window.dispatchEvent(new Event('auth-change'));
  };
  
  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      setState, 
      isAuthenticated, 
      user, 
      isAdmin,
      login, 
      logout 
    }}>
      {children}
    </AppContext.Provider>
  );
};