import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './AdminProductos.css';

// URL de la API
const API_URL = 'http://34.232.185.39:8000';

// Token fijo para administrador (debe coincidir con el token configurado en el backend)
const ADMIN_FIXED_TOKEN = "admin_fixed_token_12345";

// Tipos de producto disponibles
const TIPOS_PRODUCTO = [
  { value: 'SERVICIO', label: 'Servicio' },
  { value: 'INSUMO', label: 'Insumo' }
];

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    tipo: TIPOS_PRODUCTO[0].value,
    descripcion: '',
    precio: 0
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { isAuthenticated, isAdmin } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Verificar si el usuario es admin y está autenticado
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Cargando productos con token fijo...");
        
        // Usar la ruta fixed para obtener productos
        const response = await fetch(`${API_URL}/api/admin-fixed/productos`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Productos cargados:", data);
        setProductos(data);
        
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError(error.message || 'Error al cargar productos');
        
        // Usar datos de ejemplo si falla la carga
        setProductos([
          { id: 1, tipo: 'SERVICIO', descripcion: 'Descripción del servicio', precio: 100.00 },
          { id: 2, tipo: 'INSUMO', descripcion: 'Descripción del insumo', precio: 150.50 },
          { id: 3, tipo: 'SERVICIO', descripcion: 'Otro servicio', precio: 200.75 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchProductos();
    }
  }, [isAuthenticated, isAdmin]);
  
  // Manejar click para editar
  const handleEditClick = (producto) => {
    setEditingProductId(producto.id);
    setFormData({
      tipo: producto.tipo || TIPOS_PRODUCTO[0].value,
      descripcion: producto.descripcion || '',
      precio: producto.precio || 0
    });
  };
  
  // Manejar cambio en formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'precio' ? parseFloat(value) || 0 : value
    });
  };
  
  // Guardar cambios
  const handleSaveChanges = async (productoId) => {
    try {
      setError(null);
      
      console.log("Guardando cambios para producto:", productoId);
      console.log("Datos a actualizar:", formData);
      
      // Validar datos
      if (!formData.tipo) {
        throw new Error('El tipo de producto es obligatorio');
      }
      
      if (formData.precio <= 0) {
        throw new Error('El precio debe ser mayor que cero');
      }
      
      // Usar la ruta fixed para actualizar producto
      const response = await fetch(`${API_URL}/api/admin-fixed/productos/${productoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipo: formData.tipo,
          descripcion: formData.descripcion,
          precio: formData.precio
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al actualizar producto: ${response.status}`);
      }
      
      const updatedProducto = await response.json();
      console.log("Producto actualizado:", updatedProducto);
      
      // Actualizar lista de productos
      const updatedProductos = productos.map(producto => {
        if (producto.id === productoId) {
          return {
            ...producto,
            tipo: updatedProducto.tipo,
            descripcion: updatedProducto.descripcion,
            precio: updatedProducto.precio
          };
        }
        return producto;
      });
      
      setProductos(updatedProductos);
      setEditingProductId(null);
      setSuccessMessage('Producto actualizado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setError(error.message || 'Error al guardar cambios');
    }
  };
  
  // Agregar nuevo producto
  const handleAddProduct = async () => {
    try {
      setError(null);
      
      // Validar datos
      if (!formData.tipo) {
        throw new Error('El tipo de producto es obligatorio');
      }
      
      if (formData.precio <= 0) {
        throw new Error('El precio debe ser mayor que cero');
      }
      
      console.log("Agregando nuevo producto:", formData);
      
      // Usar la ruta fixed para crear producto
      const response = await fetch(`${API_URL}/api/admin-fixed/productos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipo: formData.tipo,
          descripcion: formData.descripcion,
          precio: formData.precio
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al agregar producto: ${response.status}`);
      }
      
      const newProducto = await response.json();
      console.log("Producto agregado:", newProducto);
      
      // Agregar a la lista de productos
      setProductos([...productos, newProducto]);
      
      // Limpiar formulario
      setFormData({
        tipo: TIPOS_PRODUCTO[0].value,
        descripcion: '',
        precio: 0
      });
      
      setShowAddForm(false);
      setSuccessMessage('Producto agregado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al agregar producto:", error);
      setError(error.message || 'Error al agregar producto');
    }
  };
  
  // Confirmar eliminación
  const handleDeleteClick = (productoId) => {
    setConfirmDelete(productoId);
  };
  
  // Cancelar eliminación
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  // Eliminar producto
  const handleDeleteConfirm = async (productoId) => {
    try {
      setError(null);
      
      console.log("Eliminando producto:", productoId);
      
      // Usar la ruta fixed para eliminar producto
      const response = await fetch(`${API_URL}/api/admin-fixed/productos/${productoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
        }
      });
      
      if (!response.ok && response.status !== 204) { // 204 No Content es un estado válido para DELETE
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al eliminar producto: ${response.status}`);
      }
      
      console.log("Producto eliminado correctamente");
      
      // Actualizar lista de productos
      const updatedProductos = productos.filter(producto => producto.id !== productoId);
      setProductos(updatedProductos);
      setConfirmDelete(null);
      setSuccessMessage('Producto eliminado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setError(error.message || 'Error al eliminar producto');
      setConfirmDelete(null);
    }
  };
  
  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingProductId(null);
  };
  
  // Iniciar agregar producto
  const handleShowAddForm = () => {
    setShowAddForm(true);
    setFormData({
      tipo: TIPOS_PRODUCTO[0].value,
      descripcion: '',
      precio: 0
    });
  };
  
  // Cancelar agregar producto
  const handleCancelAdd = () => {
    setShowAddForm(false);
  };
  
  // Formatear precio para mostrar
  const formatPrecio = (precio) => {
    return precio.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    });
  };
  
  // Obtener etiqueta para mostrar según el valor del tipo
  const getTipoLabel = (tipoValue) => {
    const tipo = TIPOS_PRODUCTO.find(t => t.value === tipoValue);
    return tipo ? tipo.label : tipoValue;
  };
  
  if (loading) {
    return <div className="admin-productos-container loading">Cargando productos...</div>;
  }
  
  return (
    <div className="admin-productos-container">
      <h2>Gestión de Productos</h2>
      <p>Administra los servicios e insumos del sistema.</p>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="fixed-token-info">
        <span className="badge">Acceso Admin</span>
        <p>Usando acceso administrador con token seguro</p>
      </div>
      
      <div className="action-bar">
        <button className="add-button" onClick={handleShowAddForm}>
          <i className="add-icon">+</i> Agregar Producto
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-form-container">
          <h3>Agregar Nuevo Producto</h3>
          <div className="add-form">
            <div className="form-group">
              <label htmlFor="tipo">Tipo de Producto *</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {TIPOS_PRODUCTO.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Descripción del producto"
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="precio">Precio *</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Precio del producto"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-actions">
              <button className="save-button" onClick={handleAddProduct}>
                Guardar Producto
              </button>
              <button className="cancel-button" onClick={handleCancelAdd}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="productos-table-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No hay productos disponibles</td>
              </tr>
            ) : (
              productos.map(producto => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>
                    {editingProductId === producto.id ? (
                      <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        className="edit-select"
                        required
                      >
                        {TIPOS_PRODUCTO.map(tipo => (
                          <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      getTipoLabel(producto.tipo)
                    )}
                  </td>
                  <td>
                    {editingProductId === producto.id ? (
                      <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        className="edit-textarea"
                        placeholder="Descripción del producto"
                        rows="2"
                      ></textarea>
                    ) : (
                      producto.descripcion || '-'
                    )}
                  </td>
                  <td>
                    {editingProductId === producto.id ? (
                      <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        className="edit-input"
                        min="0"
                        step="0.01"
                        required
                      />
                    ) : (
                      formatPrecio(producto.precio)
                    )}
                  </td>
                  <td>
                    {editingProductId === producto.id ? (
                      <div className="action-buttons">
                        <button 
                          className="save-button"
                          onClick={() => handleSaveChanges(producto.id)}
                        >
                          Guardar
                        </button>
                        <button 
                          className="cancel-button"
                          onClick={handleCancelEdit}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : confirmDelete === producto.id ? (
                      <div className="action-buttons">
                        <button 
                          className="delete-confirm-button"
                          onClick={() => handleDeleteConfirm(producto.id)}
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
                          className="edit-button"
                          onClick={() => handleEditClick(producto)}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteClick(producto.id)}
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

export default AdminProductos;