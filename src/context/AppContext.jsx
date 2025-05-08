// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Define la URL base de la API
const API_URL = 'http://34.232.185.39:8000';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Intentar obtener datos del usuario desde la API usando el token
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setIsAuthenticated(true);
            setUser(userData);
            setIsAdmin(userData.email === 'admin@hotmail.com'); // Puedes ajustar la lógica de admin
          } else {
            // Si la respuesta no es ok, limpiar token
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error al verificar autenticación:", error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Función para iniciar sesión mediante la API
  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al iniciar sesión');
      }
      
      const data = await response.json();
      
      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      
      // Configurar el estado
      setIsAuthenticated(true);
      setUser(data.user);
      setIsAdmin(data.user.email === 'admin@hotmail.com'); // Ajusta lógica para admin
      
      return data;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };
  
  // Mantener función de login anterior para compatibilidad (opcional)
  const loginLocal = (userData) => {
    // Comprueba si es el admin
    if (userData.email === 'admin@hotmail.com' && userData.password === 'admin123') {
      const admin = {
        nombre_completo: 'Administrador',  // Actualizado a nombre_completo
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
  };
  
  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      setState, 
      isAuthenticated, 
      user, 
      isAdmin,
      loading,
      login, 
      loginLocal, // Mantener función antigua como opción
      logout 
    }}>
      {children}
    </AppContext.Provider>
  );
};