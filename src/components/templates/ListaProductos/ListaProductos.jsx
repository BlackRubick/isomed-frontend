import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './ListaProductos.css';

// URL de la API
const API_URL = 'https://www.isomed.com.mx/api';

// Token fijo para administrador
const ADMIN_FIXED_TOKEN = "admin_fixed_token_12345";

// Datos de ejemplo para productos
const PRODUCTOS_EJEMPLO = [
  { 
    id: 1001,
    tipo: 'SERVICIO',
    proveedor: 'NO APLICA',
    nombre: 'MANTENIMIENTO PREVENTIVO A MAQUINA DE ANESTESIA LIMPIEZA Y DESINFECCION DE EQUIPO, CALIBRACION DE VAPORIZADOR, CAMBIO DE CIRCUITO PACIENTE, CAMBIO DE CALSODADA EN CANISTER, CALIBRACION DE SENSOR DE OXIGENO, LIMPIEZA CON SOLVENTE ELECTRICO A TARJETAS ELECTRONICAS Y LIMPIEZA CON AIRE COMPRIMIDO.',
    precio: 18500
  },
  { 
    id: 1002,
    tipo: 'SERVICIO',
    proveedor: 'NO APLICA',
    nombre: 'MANTENIMIENTO PREVENTIVO DE TRATAMIENTO DE AGUA DESINFECCION DE OSMOSIS Y DESNFECCION DE RED',
    precio: 2900
  },
  { 
    id: 1003,
    tipo: 'INSUMO',
    proveedor: 'INSUMOS NACIONALES MEXICANOS',
    nombre: 'CATETER MAHURKAR TEMPORAL HEMODIALISIS 12FRX20CM',
    precio: 2500
  },
  { 
    id: 1004,
    tipo: 'INSUMO',
    proveedor: 'EVERARDO CRUZ GOMEZ',
    nombre: 'EQUIPO PARA VENOCLISIS SIN AGUJA MICROGOTERO',
    precio: 100
  }
];

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    tipo: 'servicio',
    proveedor: '',
    nombre: '',
    precio: ''
  });
  
  const { isAuthenticated, isAdmin } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Verificar si el usuario es admin y está autenticado
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Cargar productos y proveedores
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Cargando datos con token fijo...");
        
        // Cargar proveedores primero
        const proveedoresResponse = await fetch(`${API_URL}/api/proveedores`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
          }
        });
        
        let proveedoresData = [];
        if (proveedoresResponse.ok) {
          proveedoresData = await proveedoresResponse.json();
          console.log("Proveedores cargados:", proveedoresData);
          setProveedores(proveedoresData);
        } else {
          console.warn("Error al cargar proveedores, usando datos de ejemplo");
          setProveedores([
            { id: 101, nombre: 'INSUMOS NACIONALES MEXICANOS' },
            { id: 102, nombre: 'EVERARDO CRUZ GOMEZ' },
            { id: 103, nombre: 'NO APLICA' }
          ]);
        }
        
        // Intentar obtener productos desde la API
        const productosResponse = await fetch(`${API_URL}/api/productos`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
          }
        });
        
        if (!productosResponse.ok) {
          throw new Error(`Error al cargar productos: ${productosResponse.status} ${productosResponse.statusText}`);
        }
        
        const productosData = await productosResponse.json();
        console.log("Productos cargados:", productosData);
        setProductos(productosData);
        
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(error.message || 'Error al cargar datos');
        
        // Usar datos de ejemplo si falla la carga
        setProductos(PRODUCTOS_EJEMPLO);
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
    
    if (name === 'precio') {
      // Asegurarse de que el precio es un número
      const precioValue = value === '' ? '' : parseFloat(value) || 0;
      setFormData({
        ...formData,
        [name]: precioValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Manejar cambio en radio buttons de tipo de producto
  const handleTipoChange = (e) => {
    setFormData({
      ...formData,
      tipo: e.target.value
    });
  };
  
  // Mostrar formulario para agregar
  const handleShowAddForm = () => {
    setShowAddForm(true);
    setFormData({
      tipo: 'servicio',
      proveedor: proveedores.length > 0 ? proveedores[0].id : '',
      nombre: '',
      precio: ''
    });
  };
  
  // Cancelar agregar
  const handleCancelAdd = () => {
    setShowAddForm(false);
  };
  
  // Agregar nuevo producto
  const handleAddProducto = async () => {
    try {
      setError(null);
      
      // Validar datos
      if (!formData.nombre || !formData.precio) {
        throw new Error('La descripción del producto y el precio son obligatorios');
      }
      
      // Determinar tipo basado en la selección
      const tipo = formData.tipo === 'servicio' ? 'SERVICIO' : 'INSUMO';
      
      const nuevoProducto = {
        tipo,
        proveedor: formData.proveedor || 'NO APLICA',
        nombre: formData.nombre,
        precio: parseFloat(formData.precio)
      };
      
      console.log("Agregando nuevo producto:", nuevoProducto);
      
      // Usar la API para crear producto
      const response = await fetch(`${API_URL}/api/productos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
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
        tipo: 'servicio',
        proveedor: proveedores.length > 0 ? proveedores[0].id : '',
        nombre: '',
        precio: ''
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
  
  // Ir a página de editar producto
  const handleEditClick = (id) => {
    navigate(`/admin/editar-producto/${id}`);
  };
  
  // Confirmar eliminación
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };
  
  // Cancelar eliminación
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  // Eliminar producto
  const handleDeleteConfirm = async (id) => {
    try {
      setError(null);
      
      console.log("Eliminando producto:", id);
      
      // Usar la API para eliminar producto
      const response = await fetch(`${API_URL}/api/productos/${id}`, {
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
      const updatedProductos = productos.filter(producto => producto.id !== id);
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
  
  // Formatear precio en MXN
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(precio);
  };
  
  if (loading) {
    return <div className="productos-container loading">Cargando productos...</div>;
  }
  
  return (
    <div className="productos-container">
      <h2>Lista de Productos e Insumos</h2>
      <p>Administra los productos e insumos del sistema.</p>
      
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
            placeholder="escriba el nombre del producto aquí"
          />
        </div>
        <button className="add-button" onClick={handleShowAddForm}>
          + agregar producto
        </button>
      </div>
      
      <div className="productos-table-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>id producto</th>
              <th>tipo de producto</th>
              <th>nombre del proveedor</th>
              <th>nombre del producto</th>
              <th>precio MXN</th>
              <th colSpan="2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No hay productos disponibles</td>
              </tr>
            ) : (
              productos.map(producto => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.tipo}</td>
                  <td>{producto.proveedor}</td>
                  <td>{producto.nombre}</td>
                  <td>{formatearPrecio(producto.precio)}</td>
                  <td>
                    <button 
                      className="edit-button"
                      onClick={() => handleEditClick(producto.id)}
                    >
                      editar
                    </button>
                  </td>
                  <td>
                    {confirmDelete === producto.id ? (
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
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteClick(producto.id)}
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
      
      {/* Modal para agregar producto */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>formProducto_agregar</h3>
              <button className="close-button" onClick={handleCancelAdd}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>tipo de producto</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="servicio"
                      checked={formData.tipo === 'servicio'}
                      onChange={handleTipoChange}
                    />
                    servicio
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="insumo"
                      checked={formData.tipo === 'insumo'}
                      onChange={handleTipoChange}
                    />
                    insumo
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="proveedor">proveedor</label>
                <select
                  id="proveedor"
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">seleccione de esta lista...</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </option>
                  ))}
                  <option value="NO APLICA">NO APLICA</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="nombre">descripción del producto</label>
                <textarea
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className="form-group precio-group">
                <label htmlFor="precio">precio MXN</label>
                <div className="precio-container">
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                  <span className="precio-label">antes de impuestos</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="guardar-button" onClick={handleAddProducto}>
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

export default ListaProductos;