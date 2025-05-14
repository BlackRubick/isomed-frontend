import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './ListaClientes.css';

// URL de la API
const API_URL = 'https://www.isomed.com.mx/api';

// Token fijo para administrador
const ADMIN_FIXED_TOKEN = "admin_fixed_token_12345";

// Datos de ejemplo para clientes
const CLIENTES_EJEMPLO = [
  { 
    id: 102, 
    id_figura_fiscal: 'PERSONA MORAL', 
    nombre: 'CENTRO MEDICO NEFROLOGO DE CHIAPAS', 
    registro_federal: 'CMS120321TY8', 
    codigo_postal: '29010'
  },
  { 
    id: 103, 
    id_figura_fiscal: 'PERSONA FISICA', 
    nombre: 'ROXANA SOLIS LOPEZ', 
    registro_federal: 'RSL761220RS9', 
    codigo_postal: '29000'
  }
];

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [figurasFiscales, setFigurasFiscales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    id_figura_fiscal: '',
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
  
  // Cargar clientes y figuras fiscales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Cargando datos con token fijo...");
        
        // Cargar figuras fiscales primero
        const figurasFiscalesResponse = await fetch(`${API_URL}/api/figuras-fiscales`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
          }
        });
        
        let figurasFiscalesData = [];
        if (figurasFiscalesResponse.ok) {
          figurasFiscalesData = await figurasFiscalesResponse.json();
          console.log("Figuras fiscales cargadas:", figurasFiscalesData);
          setFigurasFiscales(figurasFiscalesData);
        } else {
          console.warn("Error al cargar figuras fiscales, usando datos de ejemplo");
          setFigurasFiscales([
            { id: 701, descripcion: 'PERSONA FISICA' },
            { id: 702, descripcion: 'PERSONA MORAL' }
          ]);
        }
        
        // Intentar obtener clientes desde la API
        const clientesResponse = await fetch(`${API_URL}/api/clientes`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
          }
        });
        
        if (!clientesResponse.ok) {
          throw new Error(`Error al cargar clientes: ${clientesResponse.status} ${clientesResponse.statusText}`);
        }
        
        const clientesData = await clientesResponse.json();
        console.log("Clientes cargados:", clientesData);
        setClientes(clientesData);
        
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(error.message || 'Error al cargar datos');
        
        // Usar datos de ejemplo si falla la carga
        setClientes(CLIENTES_EJEMPLO);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchData();
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
      id_figura_fiscal: figurasFiscales.length > 0 ? figurasFiscales[0].id : '',
      nombre: '',
      registro_federal: '',
      codigo_postal: ''
    });
  };
  
  // Cancelar agregar
  const handleCancelAdd = () => {
    setShowAddForm(false);
  };
  
  // Agregar nuevo cliente
  const handleAddCliente = async () => {
    try {
      setError(null);
      
      // Validar datos
      if (!formData.nombre || !formData.id_figura_fiscal) {
        throw new Error('El nombre y la figura fiscal son obligatorios');
      }
      
      console.log("Agregando nuevo cliente:", formData);
      
      // Usar la API para crear cliente
      const response = await fetch(`${API_URL}/api/clientes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al agregar cliente: ${response.status}`);
      }
      
      const newCliente = await response.json();
      console.log("Cliente agregado:", newCliente);
      
      // Agregar a la lista de clientes
      setClientes([...clientes, newCliente]);
      
      // Limpiar formulario
      setFormData({
        id: '',
        id_figura_fiscal: figurasFiscales.length > 0 ? figurasFiscales[0].id : '',
        nombre: '',
        registro_federal: '',
        codigo_postal: ''
      });
      
      setShowAddForm(false);
      setSuccessMessage('Cliente agregado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      setError(error.message || 'Error al agregar cliente');
    }
  };
  
  // Ir a página de editar cliente
  const handleEditClick = (id) => {
    navigate(`/admin/editar-cliente/${id}`);
  };
  
  // Confirmar eliminación
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };
  
  // Cancelar eliminación
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  // Eliminar cliente
  const handleDeleteConfirm = async (id) => {
    try {
      setError(null);
      
      console.log("Eliminando cliente:", id);
      
      // Usar la API para eliminar cliente
      const response = await fetch(`${API_URL}/api/clientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
        }
      });
      
      if (!response.ok && response.status !== 204) { // 204 No Content es un estado válido para DELETE
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al eliminar cliente: ${response.status}`);
      }
      
      console.log("Cliente eliminado correctamente");
      
      // Actualizar lista de clientes
      const updatedClientes = clientes.filter(cliente => cliente.id !== id);
      setClientes(updatedClientes);
      setConfirmDelete(null);
      setSuccessMessage('Cliente eliminado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      setError(error.message || 'Error al eliminar cliente');
      setConfirmDelete(null);
    }
  };
  
  // Buscar descripción de figura fiscal
  const getFiguraFiscalDescripcion = (id) => {
    const figura = figurasFiscales.find(f => f.id === id);
    return figura ? figura.descripcion : id.toString();
  };
  
  if (loading) {
    return <div className="clientes-container loading">Cargando clientes...</div>;
  }
  
  return (
    <div className="clientes-container">
      <h2>Lista de Clientes</h2>
      <p>Administra los clientes del sistema.</p>
      
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
            placeholder="escriba el nombre del cliente aquí"
          />
        </div>
        <button className="add-button" onClick={handleShowAddForm}>
          + agregar cliente
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-form-container">
          <h3>Agregar Nuevo Cliente</h3>
          <div className="add-form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del cliente *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nombre del cliente"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="id_figura_fiscal">Figura Fiscal *</label>
              <select
                id="id_figura_fiscal"
                name="id_figura_fiscal"
                value={formData.id_figura_fiscal}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccione una figura fiscal</option>
                {figurasFiscales.map(figura => (
                  <option key={figura.id} value={figura.id}>
                    {figura.descripcion}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="registro_federal">Registro Federal de Contribuyentes</label>
              <input
                type="text"
                id="registro_federal"
                name="registro_federal"
                value={formData.registro_federal}
                onChange={handleInputChange}
                className="form-input"
                placeholder="RFC"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="codigo_postal">Código Postal</label>
              <input
                type="text"
                id="codigo_postal"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleInputChange}
                className="form-input"
                placeholder="CP"
              />
            </div>
            
            <div className="form-actions">
              <button className="save-button" onClick={handleAddCliente}>
                Guardar
              </button>
              <button className="cancel-button" onClick={handleCancelAdd}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="clientes-table-container">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>id cliente</th>
              <th>id [figura fiscal] de cliente</th>
              <th>nombre del cliente</th>
              <th>reg. fed. contrib.</th>
              <th>código postal</th>
              <th colSpan="2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No hay clientes disponibles</td>
              </tr>
            ) : (
              clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.id_figura_fiscal}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.registro_federal}</td>
                  <td>{cliente.codigo_postal}</td>
                  <td>
                    <button 
                      className="edit-button"
                      onClick={() => handleEditClick(cliente.id)}
                    >
                      editar
                    </button>
                  </td>
                  <td>
                    {confirmDelete === cliente.id ? (
                      <div className="action-buttons">
                        <button 
                          className="delete-confirm-button"
                          onClick={() => handleDeleteConfirm(cliente.id)}
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
                        onClick={() => handleDeleteClick(cliente.id)}
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
    </div>
  );
};

export default ListaClientes;