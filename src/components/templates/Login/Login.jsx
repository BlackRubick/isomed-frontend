// src/components/templates/Login/Login.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './Login.css';

const API_URL = 'https://www.isomed.com.mx/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setIsAuthenticated, setUser, setIsAdmin, setToken } = useContext(AppContext);
  
  // Verificar si hay un mensaje de registro exitoso
  useEffect(() => {
    if (location.state && location.state.message) {
      console.log("Mensaje del estado:", location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo(null);
    setLoading(true);
    
    // Verificar si es el usuario admin
    if (email === 'admin@isomed.com.mx' && password === 'admin123') {
      console.log("Iniciando sesión como administrador");
      const adminUser = {
        email,
        nombre_completo: 'Administrador',
        role: 'admin',
        token: `admin_token_${Date.now()}` // Generar un token único para admin
      };
      
      // Guardar datos en localStorage
      localStorage.setItem('token', adminUser.token);
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Actualizar el contexto
      if (setIsAuthenticated) setIsAuthenticated(true);
      if (setUser) setUser(adminUser);
      if (setIsAdmin) setIsAdmin(true);
      if (setToken) setToken(adminUser.token);
      
      // No llames a login() aquí, ya que generará un token mock
      // En lugar de eso, navega directamente
      console.log('Login de admin exitoso, redirigiendo...');
      navigate('/');
      return;
    }
    
    console.log(`Intentando login para el correo: ${email}`);
    console.log(`URL de la API: ${API_URL}/api/auth/login`);
    
    try {
      // Crear objeto con los datos exactos que espera la API
      const loginData = {
        email: email,
        password: password
      };
      
      console.log('Datos enviados:', loginData);
      
      // Llamada a la API para autenticación
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData),
      });
      
      console.log(`Código de estado de la respuesta: ${response.status}`);
      
      // Obtener la respuesta como texto primero para depuración
      const responseText = await response.text();
      console.log(`Respuesta completa: ${responseText}`);
      
      // Intentar parsear la respuesta como JSON
      let data;
      try {
        data = JSON.parse(responseText);
        setDebugInfo(data);
      } catch (e) {
        console.error("Error al parsear respuesta JSON:", e);
        setDebugInfo({ raw: responseText });
        throw new Error("Error al procesar la respuesta del servidor");
      }
      
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'Credenciales incorrectas');
      }
      
      console.log('Datos de usuario recibidos:', data.user);
      
      // Verificar que el objeto user contiene los datos esperados
      if (!data.user || !data.token) {
        console.error('Respuesta incompleta de la API:', data);
        throw new Error('Respuesta del servidor incompleta');
      }
      
      // Preparar el token JWT (eliminar prefijo Bearer si existe)
      const jwtToken = data.token.startsWith('Bearer ') ? data.token.substring(7) : data.token;
      console.log('Token JWT extraído:', jwtToken);
      
      // Preparar los datos del usuario e incluir el token
      const userData = {
        ...data.user,
        token: jwtToken // Incluir el token JWT real en el objeto usuario
      };
      
      // Determinar si es admin
      const userIsAdmin = userData.role === 'admin';
      
      // Guardar token y datos del usuario en localStorage
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Actualizar el contexto directamente, sin llamar a login()
      console.log('Actualizando estado directamente con token JWT real');
      setToken(jwtToken);
      setIsAuthenticated(true);
      setUser(userData);
      setIsAdmin(userIsAdmin);
      
      console.log('Login exitoso, redirigiendo...');
      navigate('/');
    } catch (error) {
      console.error('Error completo en el login:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet o que el servidor esté en funcionamiento.');
      } else {
        setError(error.message || 'Error al iniciar sesión');
      }
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta de ISOMED</p>
        </div>
        
        {location.state?.message && (
          <div className="login-success" style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px',
            border: '1px solid #c3e6cb'
          }}>
            {location.state.message}
          </div>
        )}
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Ingresa tu email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>¿No tienes una cuenta? <Link to="/register">Registrarse</Link></p>
          <p><Link to="/forgot-password">¿Olvidaste tu contraseña?</Link></p>
        </div>
        
        {debugInfo && (
          <div className="debug-info" style={{
            margin: '20px 0',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }}>
            <h3>Información de depuración:</h3>
            <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;