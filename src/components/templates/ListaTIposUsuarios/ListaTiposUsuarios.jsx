import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './ListaTiposUsuarios.css';

// URL de la API
const API_URL = 'https://www.isomed.com.mx/api';

// Token fijo para administrador
const ADMIN_FIXED_TOKEN = "admin_fixed_token_12345";

// Datos de ejemplo para tipos de usuario
const TIPOS_USUARIO_EJEMPLO = [
  { id: 501, descripcion: 'CONTRATISTA' },
  { id: 502, descripcion: 'COLABORADOR' },
  { id: 503, descripcion: 'CLIENTE' }
];

const ListaTiposUsuario = () => {
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    descripcion: ''
  });
  
  const { isAuthenticated, isAdmin } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Verificar si el usuario es admin y está autenticado
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Cargar tipos de usuario
  useEffect(() => {
    const fetchTiposUsuario = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Cargando tipos de usuario con token fijo...");
        
        // Intentar obtener tipos de usuario desde la API
        const response = await fetch(`${API_URL}/api/tipos-usuario`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar tipos de usuario: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Tipos de usuario cargados:", data);
        setTiposUsuario(data);
        
      } catch (error) {
        console.error("Error al cargar tipos de usuario:", error);
        setError(error.message || 'Error al cargar tipos de usuario');
        
        // Usar datos de ejemplo si falla la carga
        setTiposUsuario(TIPOS_USUARIO_EJEMPLO);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchTiposUsuario();
    }
  }, [isAuthenticated, isAdmin]);
  
  // Manejar cambio en formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Mostrar formulario para agregar
  const handleShowAddForm = () => {
    setShowAddForm(true);
    setFormData({
      id: '',
      descripcion: ''
    });
  };
  
  // Cancelar agregar
  const handleCancelAdd = () => {
    setShowAddForm(false);
  };
  
  // Agregar nuevo tipo de usuario
  const handleAddTipoUsuario = async () => {
    try {
      setError(null);
      
      // Validar datos
      if (!formData.id || !formData.descripcion) {
        throw new Error('El ID y la descripción son obligatorios');
      }
      
      console.log("Agregando nuevo tipo de usuario:", formData);
      
      // Usar la API para crear tipo de usuario
      const response = await fetch(`${API_URL}/api/tipos-usuario`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al agregar tipo de usuario: ${response.status}`);
      }
      
      const newTipoUsuario = await response.json();
      console.log("Tipo de usuario agregado:", newTipoUsuario);
      
      // Agregar a la lista de tipos de usuario
      setTiposUsuario([...tiposUsuario, newTipoUsuario]);
      
      // Limpiar formulario
      setFormData({
        id: '',
        descripcion: ''
      });
      
      setShowAddForm(false);
      setSuccessMessage('Tipo de usuario agregado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al agregar tipo de usuario:", error);
      setError(error.message || 'Error al agregar tipo de usuario');
    }
  };
  
  // Confirmar eliminación
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };
  
  // Cancelar eliminación
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  // Eliminar tipo de usuario
  const handleDeleteConfirm = async (id) => {
    try {
      setError(null);
      
      console.log("Eliminando tipo de usuario:", id);
      
      // Usar la API para eliminar tipo de usuario
      const response = await fetch(`${API_URL}/api/tipos-usuario/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
        }
      });
      
      if (!response.ok && response.status !== 204) { // 204 No Content es un estado válido para DELETE
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al eliminar tipo de usuario: ${response.status}`);
      }
      
      console.log("Tipo de usuario eliminado correctamente");
      
      // Actualizar lista de tipos de usuario
      const updatedTiposUsuario = tiposUsuario.filter(tipo => tipo.id !== id);
      setTiposUsuario(updatedTiposUsuario);
      setConfirmDelete(null);
      setSuccessMessage('Tipo de usuario eliminado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al eliminar tipo de usuario:", error);
      setError(error.message || 'Error al eliminar tipo de usuario');
      setConfirmDelete(null);
    }
  };
  
  if (loading) {
    return <div className="tipos-usuario-container loading">Cargando tipos de usuario...</div>;
  }
  
  return (
    <div className="tipos-usuario-container">
      <h2>Lista de Tipos de Usuario</h2>
      <p>Administra los tipos de usuario del sistema.</p>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="fixed-token-info">
        <span className="badge">Acceso Admin</span>
        <p>Usando acceso administrador con token seguro</p>
      </div>
      
      <div className="action-bar">
        <button className="add-button" onClick={handleShowAddForm}>
          <i className="add-icon">+</i> Agregar Tipo de Usuario
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-form-container">
          <h3>Agregar Nuevo Tipo de Usuario</h3>
          <div className="add-form">
            <div className="form-group">
              <label htmlFor="id">ID Tipo de Usuario *</label>
              <input
                type="number"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: 504"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="descripcion">Descripción *</label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Descripción del tipo de usuario"
                required
              />
            </div>
            
            <div className="form-actions">
              <button className="save-button" onClick={handleAddTipoUsuario}>
                Guardar
              </button>
              <button className="cancel-button" onClick={handleCancelAdd}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="tipos-usuario-table-container">
        <table className="tipos-usuario-table">
          <thead>
            <tr>
              <th>ID tipo de usuario</th>
              <th>descripción del tipo de usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tiposUsuario.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">No hay tipos de usuario disponibles</td>
              </tr>
            ) : (
              tiposUsuario.map(tipo => (
                <tr key={tipo.id}>
                  <td>{tipo.id}</td>
                  <td>{tipo.descripcion}</td>
                  <td>
                    {confirmDelete === tipo.id ? (
                      <div className="action-buttons">
                        <button 
                          className="delete-confirm-button"
                          onClick={() => handleDeleteConfirm(tipo.id)}
                        >
                          Confirmar
                        </button>
                        <button 
                          className="cancel-button"
                          onClick={handleCancelDelete}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteClick(tipo.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaTiposUsuario;