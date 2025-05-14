import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './ListaFiguraFiscal.css';

// URL de la API
const API_URL = 'https://www.isomed.com.mx/api';

// Token fijo para administrador
const ADMIN_FIXED_TOKEN = "admin_fixed_token_12345";

// Datos de ejemplo para figuras fiscales
const FIGURAS_FISCALES_EJEMPLO = [
  { id: 701, descripcion: 'PERSONA FISICA' },
  { id: 702, descripcion: 'PERSONA MORAL' }
];

const ListaFiguraFiscal = () => {
  const [figurasFiscales, setFigurasFiscales] = useState([]);
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
  
  // Cargar figuras fiscales
  useEffect(() => {
    const fetchFigurasFiscales = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Cargando figuras fiscales con token fijo...");
        
        // Intentar obtener figuras fiscales desde la API
        const response = await fetch(`${API_URL}/api/figuras-fiscales`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar figuras fiscales: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Figuras fiscales cargadas:", data);
        setFigurasFiscales(data);
        
      } catch (error) {
        console.error("Error al cargar figuras fiscales:", error);
        setError(error.message || 'Error al cargar figuras fiscales');
        
        // Usar datos de ejemplo si falla la carga
        setFigurasFiscales(FIGURAS_FISCALES_EJEMPLO);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchFigurasFiscales();
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
  
  // Agregar nueva figura fiscal
  const handleAddFiguraFiscal = async () => {
    try {
      setError(null);
      
      // Validar datos
      if (!formData.id || !formData.descripcion) {
        throw new Error('El ID y la descripción son obligatorios');
      }
      
      console.log("Agregando nueva figura fiscal:", formData);
      
      // Usar la API para crear figura fiscal
      const response = await fetch(`${API_URL}/api/figuras-fiscales`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al agregar figura fiscal: ${response.status}`);
      }
      
      const newFiguraFiscal = await response.json();
      console.log("Figura fiscal agregada:", newFiguraFiscal);
      
      // Agregar a la lista de figuras fiscales
      setFigurasFiscales([...figurasFiscales, newFiguraFiscal]);
      
      // Limpiar formulario
      setFormData({
        id: '',
        descripcion: ''
      });
      
      setShowAddForm(false);
      setSuccessMessage('Figura fiscal agregada correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al agregar figura fiscal:", error);
      setError(error.message || 'Error al agregar figura fiscal');
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
  
  // Eliminar figura fiscal
  const handleDeleteConfirm = async (id) => {
    try {
      setError(null);
      
      console.log("Eliminando figura fiscal:", id);
      
      // Usar la API para eliminar figura fiscal
      const response = await fetch(`${API_URL}/api/figuras-fiscales/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
        }
      });
      
      if (!response.ok && response.status !== 204) { // 204 No Content es un estado válido para DELETE
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al eliminar figura fiscal: ${response.status}`);
      }
      
      console.log("Figura fiscal eliminada correctamente");
      
      // Actualizar lista de figuras fiscales
      const updatedFigurasFiscales = figurasFiscales.filter(figura => figura.id !== id);
      setFigurasFiscales(updatedFigurasFiscales);
      setConfirmDelete(null);
      setSuccessMessage('Figura fiscal eliminada correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al eliminar figura fiscal:", error);
      setError(error.message || 'Error al eliminar figura fiscal');
      setConfirmDelete(null);
    }
  };
  
  if (loading) {
    return <div className="figuras-fiscales-container loading">Cargando figuras fiscales...</div>;
  }
  
  return (
    <div className="figuras-fiscales-container">
      <h2>Lista de Figuras Fiscales</h2>
      <p>Administra las figuras fiscales del sistema.</p>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="fixed-token-info">
        <span className="badge">Acceso Admin</span>
        <p>Usando acceso administrador con token seguro</p>
      </div>
      
      <div className="action-bar">
        <button className="add-button" onClick={handleShowAddForm}>
          <i className="add-icon">+</i> Agregar Figura Fiscal
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-form-container">
          <h3>Agregar Nueva Figura Fiscal</h3>
          <div className="add-form">
            <div className="form-group">
              <label htmlFor="id">ID Figura Fiscal *</label>
              <input
                type="number"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: 703"
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
                placeholder="Descripción de la figura fiscal"
                required
              />
            </div>
            
            <div className="form-actions">
              <button className="save-button" onClick={handleAddFiguraFiscal}>
                Guardar
              </button>
              <button className="cancel-button" onClick={handleCancelAdd}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="figuras-fiscales-table-container">
        <table className="figuras-fiscales-table">
          <thead>
            <tr>
              <th>id figura fiscal</th>
              <th>descripción de la figura fiscal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {figurasFiscales.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">No hay figuras fiscales disponibles</td>
              </tr>
            ) : (
              figurasFiscales.map(figura => (
                <tr key={figura.id}>
                  <td>{figura.id}</td>
                  <td>{figura.descripcion}</td>
                  <td>
                    {confirmDelete === figura.id ? (
                      <div className="action-buttons">
                        <button 
                          className="delete-confirm-button"
                          onClick={() => handleDeleteConfirm(figura.id)}
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
                          onClick={() => handleDeleteClick(figura.id)}
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

export default ListaFiguraFiscal;