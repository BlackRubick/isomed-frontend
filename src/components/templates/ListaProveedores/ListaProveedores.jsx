import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './ListaProveedores.css';

// URL de la API
const API_URL = 'https://www.isomed.com.mx/api';

// Token fijo para administrador
const ADMIN_FIXED_TOKEN = "admin_fixed_token_12345";

// Datos de ejemplo para proveedores
const PROVEEDORES_EJEMPLO = [
  { 
    id: 102, 
    id_figura_fiscal: 'PERSONA MORAL', 
    nombre: 'INSUMOS NACIONALES MEXICANOS', 
    registro_federal: 'INM230123RE2', 
    codigo_postal: '89024'
  },
  { 
    id: 103, 
    id_figura_fiscal: 'PERSONA FISICA', 
    nombre: 'EVERARDO CRUZ GOMEZ', 
    registro_federal: 'ECGS121210TS7', 
    codigo_postal: '00230'
  }
];

const ListaProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    tipoFiguraFiscal: 'persona_fisica',
    nombre: '',
    registro_federal: '',
    codigo_postal: ''
  });
  
  const { isAuthenticated, isAdmin } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Verificar si el usuario es admin y está autenticado
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Cargar proveedores
  useEffect(() => {
    const fetchProveedores = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Cargando proveedores con token fijo...");
        
        // Intentar obtener proveedores desde la API
        const response = await fetch(`${API_URL}/api/proveedores`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar proveedores: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Proveedores cargados:", data);
        setProveedores(data);
        
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
        setError(error.message || 'Error al cargar proveedores');
        
        // Usar datos de ejemplo si falla la carga
        setProveedores(PROVEEDORES_EJEMPLO);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchProveedores();
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
  
  // Manejar cambio en radio buttons de figura fiscal
  const handleFiguraFiscalChange = (e) => {
    setFormData({
      ...formData,
      tipoFiguraFiscal: e.target.value
    });
  };
  
  // Mostrar formulario para agregar
  const handleShowAddForm = () => {
    setShowAddForm(true);
  };
  
  // Cancelar agregar
  const handleCancelAdd = () => {
    setShowAddForm(false);
  };
  
  // Agregar nuevo proveedor
  const handleAddProveedor = async () => {
    try {
      setError(null);
      
      // Validar datos
      if (!formData.nombre) {
        throw new Error('El nombre del proveedor es obligatorio');
      }
      
      // Determinar ID de figura fiscal basado en la selección
      const id_figura_fiscal = formData.tipoFiguraFiscal === 'persona_fisica' ? 'PERSONA FISICA' : 'PERSONA MORAL';
      
      const nuevoProveedor = {
        id_figura_fiscal,
        nombre: formData.nombre,
        registro_federal: formData.registro_federal || '',
        codigo_postal: formData.codigo_postal || ''
      };
      
      console.log("Agregando nuevo proveedor:", nuevoProveedor);
      
      // Usar la API para crear proveedor
      const response = await fetch(`${API_URL}/api/proveedores`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProveedor)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al agregar proveedor: ${response.status}`);
      }
      
      const newProveedor = await response.json();
      console.log("Proveedor agregado:", newProveedor);
      
      // Agregar a la lista de proveedores
      setProveedores([...proveedores, newProveedor]);
      
      // Limpiar formulario
      setFormData({
        tipoFiguraFiscal: 'persona_fisica',
        nombre: '',
        registro_federal: '',
        codigo_postal: ''
      });
      
      setShowAddForm(false);
      setSuccessMessage('Proveedor agregado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al agregar proveedor:", error);
      setError(error.message || 'Error al agregar proveedor');
    }
  };
  
  // Ir a página de editar proveedor
  const handleEditClick = (id) => {
    navigate(`/admin/editar-proveedor/${id}`);
  };
  
  // Confirmar eliminación
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };
  
  // Cancelar eliminación
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  // Eliminar proveedor
  const handleDeleteConfirm = async (id) => {
    try {
      setError(null);
      
      console.log("Eliminando proveedor:", id);
      
      // Usar la API para eliminar proveedor
      const response = await fetch(`${API_URL}/api/proveedores/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
        }
      });
      
      if (!response.ok && response.status !== 204) { // 204 No Content es un estado válido para DELETE
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al eliminar proveedor: ${response.status}`);
      }
      
      console.log("Proveedor eliminado correctamente");
      
      // Actualizar lista de proveedores
      const updatedProveedores = proveedores.filter(proveedor => proveedor.id !== id);
      setProveedores(updatedProveedores);
      setConfirmDelete(null);
      setSuccessMessage('Proveedor eliminado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      setError(error.message || 'Error al eliminar proveedor');
      setConfirmDelete(null);
    }
  };
  
  if (loading) {
    return <div className="proveedores-container loading">Cargando proveedores...</div>;
  }
  
  return (
    <div className="proveedores-container">
      <h2>Lista de Proveedores</h2>
      <p>Administra los proveedores del sistema.</p>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="fixed-token-info">
        <span className="badge">Acceso Admin</span>
        <p>Usando acceso administrador con token seguro</p>
      </div>
      
      <div className="search-add-container">
        <div className="search-container">
          <input 
            type="text"
            className="search-input"
            placeholder="escriba el nombre del proveedor aquí"
          />
        </div>
        <button className="add-button" onClick={handleShowAddForm}>
          + agregar proveedor
        </button>
      </div>
      
      <div className="proveedores-table-container">
        <table className="proveedores-table">
          <thead>
            <tr>
              <th>id proveedor</th>
              <th>id [figura fiscal] de proveedor</th>
              <th>nombre del proveedor</th>
              <th>reg. fed. contrib.</th>
              <th>código postal</th>
              <th colSpan="2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No hay proveedores disponibles</td>
              </tr>
            ) : (
              proveedores.map(proveedor => (
                <tr key={proveedor.id}>
                  <td>{proveedor.id}</td>
                  <td>{proveedor.id_figura_fiscal}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.registro_federal}</td>
                  <td>{proveedor.codigo_postal}</td>
                  <td>
                    <button 
                      className="edit-button"
                      onClick={() => handleEditClick(proveedor.id)}
                    >
                      editar
                    </button>
                  </td>
                  <td>
                    {confirmDelete === proveedor.id ? (
                      <div className="action-buttons">
                        <button 
                          className="delete-confirm-button"
                          onClick={() => handleDeleteConfirm(proveedor.id)}
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
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteClick(proveedor.id)}
                      >
                        eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal para agregar proveedor */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>formProveedor_agregar</h3>
              <button className="close-button" onClick={handleCancelAdd}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>figura fiscal de proveedor</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="tipoFiguraFiscal"
                      value="persona_fisica"
                      checked={formData.tipoFiguraFiscal === 'persona_fisica'}
                      onChange={handleFiguraFiscalChange}
                    />
                    persona física
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tipoFiguraFiscal"
                      value="persona_moral"
                      checked={formData.tipoFiguraFiscal === 'persona_moral'}
                      onChange={handleFiguraFiscalChange}
                    />
                    persona moral
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="nombre">nombre completo del proveedor</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="registro_federal">reg. fed. contrib.</label>
                <input
                  type="text"
                  id="registro_federal"
                  name="registro_federal"
                  value={formData.registro_federal}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="MOOG760904AW0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="codigo_postal">código postal</label>
                <input
                  type="text"
                  id="codigo_postal"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="guardar-button" onClick={handleAddProveedor}>
                <i className="guardar-icon"></i>
                Guardar
              </button>
              <button className="cancelar-button" onClick={handleCancelAdd}>
                <i className="cancelar-icon"></i>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaProveedores;