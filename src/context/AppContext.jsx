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
      
      // Verificar si hay token en localStorage
      const token = localStorage.getItem('token');
      
      // Verificar si hay usuario guardado en localStorage (para compatibilidad)
      const savedUser = localStorage.getItem('user');
      const isAuthenticatedLocal = localStorage.getItem('isAuthenticated');
      
      if (token) {
        try {
          // Intentar obtener datos del usuario desde la API usando el token
          console.log("Verificando token con la API...");
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log("Datos de usuario obtenidos de la API:", userData);
            
            // Asegurarse de que tengamos la estructura correcta (compatibilidad nombre_completo/name)
            const userDataFormatted = {
              ...userData,
              // Si el backend devuelve name pero no nombre_completo o viceversa
              nombre_completo: userData.nombre_completo || userData.name || "Usuario",
              name: userData.name || userData.nombre_completo || "Usuario"
            };
            
            setIsAuthenticated(true);
            setUser(userDataFormatted);
            setIsAdmin(userData.email === 'admin@hotmail.com'); // Ajustar según lógica de admin
            
            // Actualizar localStorage con datos frescos
            localStorage.setItem('user', JSON.stringify(userDataFormatted));
            localStorage.setItem('isAuthenticated', 'true');
          } else {
            console.warn("Token inválido o expirado, eliminando credenciales...");
            // Si la respuesta no es ok, limpiar token
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error al verificar autenticación:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          setIsAdmin(false);
        }
      } else if (savedUser && isAuthenticatedLocal === 'true') {
        // Compatibilidad con el sistema anterior si no hay token pero sí hay usuario guardado
        try {
          const userData = JSON.parse(savedUser);
          console.log("Usando datos de usuario guardados en localStorage:", userData);
          
          // Asegurarse de que tengamos la estructura correcta (compatibilidad nombre_completo/name)
          const userDataFormatted = {
            ...userData,
            nombre_completo: userData.nombre_completo || userData.name || "Usuario",
            name: userData.name || userData.nombre_completo || "Usuario"
          };
          
          setIsAuthenticated(true);
          setUser(userDataFormatted);
          setIsAdmin(userData.email === 'admin@hotmail.com');
        } catch (error) {
          console.error("Error al procesar datos de usuario guardados:", error);
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        // No hay credenciales guardadas
        console.log("No hay credenciales guardadas");
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
      // Si recibimos un objeto con datos de usuario en lugar de credenciales
      // (compatibilidad con el login local)
      if (credentials && credentials.email && !credentials.password && 
          (credentials.nombre_completo || credentials.name)) {
        console.log("Login con datos de usuario directos:", credentials);
        
        // Es un objeto de usuario, no credenciales - usar loginLocal
        loginLocal(credentials);
        return { user: credentials };
      }
      
      console.log("Enviando credenciales a la API:", credentials);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
      });
      
      // Leer la respuesta como texto primero para depuración
      const responseText = await response.text();
      console.log("Respuesta cruda de login:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Error al parsear respuesta JSON:", e);
        throw new Error("Error al procesar la respuesta del servidor");
      }
      
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'Error al iniciar sesión');
      }
      
      // Verificar que la respuesta contiene token y datos de usuario
      if (!data.token || !data.user) {
        console.error("Respuesta de login incompleta:", data);
        throw new Error("La respuesta del servidor no contiene los datos necesarios");
      }
      
      console.log("Login exitoso, datos recibidos:", data);
      
      // Asegurarse de que tengamos la estructura correcta (compatibilidad nombre_completo/name)
      const userDataFormatted = {
        ...data.user,
        nombre_completo: data.user.nombre_completo || data.user.name || "Usuario",
        name: data.user.name || data.user.nombre_completo || "Usuario"
      };
      
      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userDataFormatted));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Configurar el estado
      setIsAuthenticated(true);
      setUser(userDataFormatted);
      setIsAdmin(userDataFormatted.email === 'admin@hotmail.com'); // Ajustar lógica para admin
      
      return data;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };
  
  // Login local para compatibilidad y usuarios admin hardcodeados
  const loginLocal = (userData) => {
    console.log("Login local con:", userData);
    
    // Comprueba si es el admin
    if (userData.email === 'admin@hotmail.com' && (userData.password === 'admin123' || userData.role === 'admin')) {
      const admin = {
        id: 0, // ID ficticio para admin
        nombre_completo: 'Administrador',
        name: 'Administrador', // Para compatibilidad
        email: 'admin@hotmail.com',
        role: 'admin',
        numero_cliente: "",
        id_cliente: null
      };
      
      console.log("Login como administrador:", admin);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(admin));
      setIsAuthenticated(true);
      setUser(admin);
      setIsAdmin(true);
    } else {
      // Login de usuario normal
      const userFormatted = {
        ...userData,
        nombre_completo: userData.nombre_completo || userData.name || "Usuario",
        name: userData.name || userData.nombre_completo || "Usuario",
        role: userData.role || 'user'
      };
      
      console.log("Login como usuario normal:", userFormatted);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userFormatted));
      setIsAuthenticated(true);
      setUser(userFormatted);
      setIsAdmin(false);
    }
  };
  
  // Función para cerrar sesión
  const logout = () => {
    console.log("Cerrando sesión...");
    
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    
    console.log("Sesión cerrada correctamente");
  };
  
  const contextValue = {
    state, 
    setState, 
    isAuthenticated, 
    user, 
    isAdmin,
    loading,
    login, 
    loginLocal,
    logout
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};