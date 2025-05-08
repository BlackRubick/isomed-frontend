// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Define la URL base de la API - Asegúrate de que esta URL sea correcta
const API_URL = 'https://www.isomed.com.mx';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(''); // Estado para token

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      // Verificar si hay token en localStorage
      const storedToken = localStorage.getItem('token');
      
      // Verificar si hay usuario guardado en localStorage
      const savedUser = localStorage.getItem('user');
      const isAuthenticatedLocal = localStorage.getItem('isAuthenticated');
      
      if (storedToken) {
        // Actualizar el estado del token inmediatamente
        setToken(storedToken);
        
        try {
          // Verificar si es un token mock para admin o usuario
          if (storedToken.startsWith('admin_token_') || storedToken.startsWith('admin_mock_token_')) {
            console.log("Token de admin detectado, usando datos guardados");
            if (savedUser) {
              const userData = JSON.parse(savedUser);
              setIsAuthenticated(true);
              setUser(userData);
              setIsAdmin(true);
              setLoading(false);
              return;
            }
          }
          
          // Intentar obtener datos del usuario desde la API usando el token
          console.log("Verificando token con la API...");
          console.log("Usando token:", storedToken);
          
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log("Datos de usuario obtenidos de la API:", userData);
            
            // Asegurarse de que tengamos la estructura correcta
            const userDataFormatted = {
              ...userData,
              nombre_completo: userData.nombre_completo || userData.name || "Usuario",
              name: userData.name || userData.nombre_completo || "Usuario",
              token: storedToken // Incluir el token en el objeto usuario
            };
            
            // Determinar si es admin
            const userIsAdmin = 
              userDataFormatted.role === 'admin' || 
              userDataFormatted.email === 'admin@hotmail.com';
            
            setIsAuthenticated(true);
            setUser(userDataFormatted);
            setIsAdmin(userIsAdmin);
            
            console.log("Usuario cargado desde API:", userDataFormatted);
            console.log("Es admin:", userIsAdmin);
            
            // Actualizar localStorage con datos frescos
            localStorage.setItem('user', JSON.stringify(userDataFormatted));
            localStorage.setItem('isAuthenticated', 'true');
          } else {
            console.warn("Token inválido o expirado, eliminando credenciales...");
            // Si la respuesta no es ok, limpiar token
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            setToken('');
            setIsAuthenticated(false);
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error al verificar autenticación:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('user');
          setToken('');
          setIsAuthenticated(false);
          setUser(null);
          setIsAdmin(false);
        }
      } else if (savedUser && isAuthenticatedLocal === 'true') {
        // Compatibilidad con el sistema anterior si no hay token pero sí hay usuario guardado
        try {
          const userData = JSON.parse(savedUser);
          console.log("Usando datos de usuario guardados en localStorage:", userData);
          
          // Determinar qué tipo de token mock generar
          const isAdminUser = userData.role === 'admin' || userData.email === 'admin@hotmail.com';
          const newMockToken = isAdminUser 
            ? `admin_token_${Date.now()}` 
            : `user_token_${Date.now()}`;
          
          console.log("Generando nuevo token:", newMockToken);
          localStorage.setItem('token', newMockToken);
          setToken(newMockToken);
          
          // Asegurarse de que tengamos la estructura correcta
          const userDataFormatted = {
            ...userData,
            nombre_completo: userData.nombre_completo || userData.name || "Usuario",
            name: userData.name || userData.nombre_completo || "Usuario",
            token: newMockToken
          };
          
          setIsAuthenticated(true);
          setUser(userDataFormatted);
          setIsAdmin(isAdminUser);
          
          console.log("Usuario cargado desde localStorage:", userDataFormatted);
          console.log("Es admin:", isAdminUser);
          
          // Actualizar localStorage con el token
          localStorage.setItem('user', JSON.stringify(userDataFormatted));
        } catch (error) {
          console.error("Error al procesar datos de usuario guardados:", error);
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('user');
          setToken('');
          setIsAuthenticated(false);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        // No hay credenciales guardadas
        console.log("No hay credenciales guardadas");
        setToken('');
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
      // CASO ESPECIAL: Si llega un objeto con token ya incluido, usarlo directamente
      if (credentials && credentials.token) {
        console.log("Login con objeto que ya incluye token:", credentials);
        
        const tokenValue = credentials.token;
        
        // Asegurarse de que tengamos la estructura correcta
        const userDataFormatted = {
          ...credentials,
          nombre_completo: credentials.nombre_completo || credentials.name || "Usuario",
          name: credentials.name || credentials.nombre_completo || "Usuario"
        };
        
        // Determinar si es admin
        const userIsAdmin = 
          userDataFormatted.role === 'admin' || 
          userDataFormatted.email === 'admin@hotmail.com';
        
        // Guardar token en localStorage
        localStorage.setItem('token', tokenValue);
        localStorage.setItem('user', JSON.stringify(userDataFormatted));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Configurar el estado
        setToken(tokenValue);
        setIsAuthenticated(true);
        setUser(userDataFormatted);
        setIsAdmin(userIsAdmin);
        
        console.log("Autenticación directa completada:", {
          isAuthenticated: true,
          user: userDataFormatted,
          isAdmin: userIsAdmin,
          token: tokenValue
        });
        
        return { user: userDataFormatted, token: tokenValue };
      }
      
      // CASO ADMIN MOCK: Admin hardcodeado sin usar API
      if (credentials && credentials.email === 'admin@hotmail.com' && credentials.password === 'admin123') {
        console.log("Login como admin hardcodeado");
        
        // Crear usuario admin
        const adminUser = {
          id: 999, // ID ficticio para admin
          nombre_completo: 'Administrador',
          name: 'Administrador',
          email: 'admin@hotmail.com',
          role: 'admin',
        };
        
        // Generar token mock para admin
        const adminToken = `admin_token_${Date.now()}`;
        
        // Guardar en localStorage
        localStorage.setItem('token', adminToken);
        localStorage.setItem('user', JSON.stringify({...adminUser, token: adminToken}));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Actualizar estado
        setToken(adminToken);
        setIsAuthenticated(true);
        setUser({...adminUser, token: adminToken});
        setIsAdmin(true);
        
        console.log("Login admin completado con token:", adminToken);
        
        return { user: adminUser, token: adminToken };
      }
      
      // CASO NORMAL: Llamada a la API con credenciales
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
      
      // Extraer el token en formato correcto (eliminar "Bearer " si existe)
      const tokenValue = data.token.startsWith('Bearer ') ? 
        data.token.substring(7) : data.token;
      
      console.log("Token JWT extraído:", tokenValue);
      
      // Asegurarse de que tengamos la estructura correcta
      const userDataFormatted = {
        ...data.user,
        nombre_completo: data.user.nombre_completo || data.user.name || "Usuario",
        name: data.user.name || data.user.nombre_completo || "Usuario",
        token: tokenValue // Incluir el token en los datos del usuario
      };
      
      // Determinar si es admin
      const userIsAdmin = 
        userDataFormatted.role === 'admin' || 
        userDataFormatted.email === 'admin@hotmail.com';
      
      // Guardar token en localStorage
      localStorage.setItem('token', tokenValue);
      localStorage.setItem('user', JSON.stringify(userDataFormatted));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Configurar el estado
      setToken(tokenValue);
      setIsAuthenticated(true);
      setUser(userDataFormatted);
      setIsAdmin(userIsAdmin);
      
      console.log("Estado actualizado después de login API:", {
        isAuthenticated: true,
        user: userDataFormatted,
        isAdmin: userIsAdmin,
        token: tokenValue
      });
      
      return { user: userDataFormatted, token: tokenValue };
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };
  
  // Login local para compatibilidad y usuarios admin hardcodeados
  const loginLocal = (userData) => {
    console.log("Login local con:", userData);
    
    // Verificación más clara para admin
    const isAdminUser = 
      userData.email === 'admin@hotmail.com' || 
      userData.role === 'admin';
    
    if (isAdminUser) {
      console.log("Detectado usuario admin");
      
      const admin = {
        id: 0, // ID ficticio para admin
        nombre_completo: 'Administrador',
        name: 'Administrador', // Para compatibilidad
        email: 'admin@hotmail.com',
        role: 'admin',
        numero_cliente: "",
        id_cliente: null
      };
      
      // Generar token mock para admin
      const adminMockToken = `admin_token_${Date.now()}`;
      localStorage.setItem('token', adminMockToken);
      console.log("Token mock para admin guardado:", adminMockToken);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({...admin, token: adminMockToken}));
      
      // Establecer explícitamente como admin
      setToken(adminMockToken);
      setIsAuthenticated(true);
      setUser({...admin, token: adminMockToken});
      setIsAdmin(true);
      
      console.log("Estado actualizado - isAdmin:", true);
    } else {
      // Login de usuario normal
      const userFormatted = {
        ...userData,
        nombre_completo: userData.nombre_completo || userData.name || "Usuario",
        name: userData.name || userData.nombre_completo || "Usuario",
        role: userData.role || 'user'
      };
      
      // Usar token existente o generar uno nuevo
      const userToken = userData.token || `user_token_${Date.now()}`;
      localStorage.setItem('token', userToken);
      console.log("Token para usuario guardado:", userToken);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({...userFormatted, token: userToken}));
      
      setToken(userToken);
      setIsAuthenticated(true);
      setUser({...userFormatted, token: userToken});
      setIsAdmin(false);
      
      console.log("Estado actualizado - usuario normal:", {
        isAuthenticated: true,
        user: userFormatted,
        isAdmin: false,
        token: userToken
      });
    }
  };
  
  // Función para cerrar sesión
  const logout = () => {
    console.log("Cerrando sesión...");
    
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    setToken('');
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    
    console.log("Sesión cerrada correctamente");
  };
  
  // Función para realizar peticiones autenticadas a la API
  const authFetch = async (url, options = {}) => {
    try {
      // Obtener token actualizado del estado o localStorage
      const currentToken = token || localStorage.getItem('token');
      
      if (!currentToken) {
        console.error("No hay token disponible para la petición autenticada");
        throw new Error('No hay sesión activa');
      }
      
      // Configurar headers con token de autenticación
      const headers = {
        ...options.headers,
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': options.headers?.['Content-Type'] || 'application/json'
      };
      
      // Realizar la petición
      console.log(`Realizando petición autenticada a: ${url}`);
      console.log(`Token utilizado: ${currentToken}`);
      
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      // Si la respuesta es 401 (Unauthorized), manejar la sesión expirada
      if (response.status === 401) {
        console.error('Error de autenticación en la petición a la API');
        const responseText = await response.text();
        console.error(`Respuesta de error: ${responseText}`);
        
        // Si es un token mock, podemos intentar generar uno nuevo
        if (currentToken.includes('token_') && user) {
          console.log("Intentando regenerar token mock...");
          
          const newMockToken = user.email === 'admin@hotmail.com' ? 
            `admin_token_${Date.now()}` : 
            `user_token_${Date.now()}`;
            
          console.log("Nuevo token mock generado:", newMockToken);
          localStorage.setItem('token', newMockToken);
          setToken(newMockToken);
          
          // Actualizar el usuario con el nuevo token
          const updatedUser = {...user, token: newMockToken};
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          
          // Reintentar la petición con el nuevo token
          return authFetch(url, options);
        }
        
        // Si no es un token mock o no se puede regenerar, cerrar sesión
        logout();
        throw new Error('Sesión expirada, por favor inicie sesión nuevamente');
      }
      
      return response;
    } catch (error) {
      console.error('Error en authFetch:', error);
      throw error;
    }
  };
  
  const contextValue = {
    state, 
    setState, 
    isAuthenticated, 
    user, 
    isAdmin,
    loading,
    token, // Exponemos el token
    login, 
    loginLocal,
    logout,
    authFetch, // Exponemos la función authFetch
    setToken, // Exponemos setToken para componentes que necesiten actualizar el token
    setUser,
    setIsAuthenticated,
    setIsAdmin
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};