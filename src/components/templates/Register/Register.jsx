import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

// URL base de la API - definida directamente sin usar process.env
const API_URL = 'http://34.232.185.39:8000';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    password: '',
    confirmPassword: ''
    // Eliminados todos los campos opcionales
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null); 
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setApiResponse(null);
    
    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden'); 
      return;
    }
    
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setLoading(true);
    
    // Crear objeto de datos para enviar a la API
    const dataToSend = {
      nombre_completo: formData.nombre_completo,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword // La API necesita este campo para validar
    };
    
    console.log('Enviando datos de registro:', JSON.stringify(dataToSend));
    
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(dataToSend),
      });
      
      console.log('Código de estado HTTP:', response.status);
      
      // Capturar la respuesta para depuración
      const responseText = await response.text();
      console.log('Respuesta completa de la API:', responseText);
      
      // Convertir a JSON si es posible
      let data;
      try {
        data = JSON.parse(responseText);
        setApiResponse(data);
      } catch (e) {
        console.error('Error al parsear JSON:', e);
        setApiResponse({ rawText: responseText });
      }
      
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'Error al registrarse');
      }
      
      // Registro exitoso
      console.log('Registro exitoso, redirigiendo a login');
      localStorage.setItem('userRegistered', 'true');
      
      // Redirigir al login con mensaje de éxito
      navigate('/login', { 
        state: { 
          message: 'Registro exitoso. Por favor inicia sesión con tus credenciales.' 
        } 
      });
    } catch (error) {
      console.error('Error completo en el registro:', error);
      setError(error.message || 'Error al conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Crear Cuenta</h2>
          <p>Únete a ISOMED para acceder a todos nuestros servicios</p>
        </div>
        
        {error && <div className="register-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre_completo">Nombre Completo</label>
              <input
                type="text"
                id="nombre_completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                placeholder="Ingresa tu nombre completo"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Ingresa tu email"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Crea una contraseña"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirma tu contraseña"
              />
            </div>
          </div>
          
          <div className="terms-policy">
            <input 
              type="checkbox" 
              id="terms" 
              required
            />
            <label htmlFor="terms">
              He leído y acepto los <Link to="/terms">Términos y Condiciones</Link> y la <Link to="/privacy">Política de Privacidad</Link>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link></p>
        </div>
        
        {/* Panel de depuración - Puedes quitar esto en producción */}
        {apiResponse && (
          <div className="debug-panel" style={{margin: '20px 0', padding: '10px', border: '1px solid #ddd', background: '#f9f9f9'}}>
            <h3>Respuesta de la API (Solo para depuración):</h3>
            <pre style={{whiteSpace: 'pre-wrap', overflow: 'auto'}}>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;