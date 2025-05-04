// src/components/templates/Login/Login.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './Login.css';

const API_URL = 'http://34.232.185.39:8000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AppContext);
  
  // Verificar si hay un mensaje de registro exitoso
  useEffect(() => {
    if (location.state && location.state.message) {
      // Mostrar mensaje de éxito
      console.log("Mensaje del estado:", location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo(null);
    setLoading(true);
    
    console.log(`Intentando login para el correo: ${email}`);
    console.log(`URL de la API: ${API_URL}/api/auth/login`);
    
    try {
      // Llamada a la API para autenticación
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log(`Código de estado de la respuesta: ${response.status}`);
      
      // Capturar la respuesta completa para depuración
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
      }
      
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'Credenciales incorrectas');
      }
      
      // Usar la función de login del contexto en lugar de guardar manualmente
      login(data.user);
      
      console.log('Login exitoso, redirigiendo...');
      
      // Redirigir al dashboard/inicio
      navigate('/');
    } catch (error) {
      console.error('Error completo en el login:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet o que el servidor esté en funcionamiento.');
      } else {
        setError(error.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resto del componente queda igual...
  return (
    <div className="login-container">
      {/* El resto del código del componente queda igual */}
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