import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './GenerarOrden.css';

// URL de la API
const API_URL = 'https://www.isomed.com.mx/api';

// Token fijo para administrador
const ADMIN_FIXED_TOKEN = "admin_fixed_token_12345";

const GenerarOrden = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    cliente: '',
    estado: '1- PRECOTIZACION',
    items: [
      { tipo: 'INSUMO', descripcion: '', cantidad: 1, precio_unitario: 0, importe: 0 }
    ],
    observaciones: '',
    actualizaciones: ''
  });
  
  const { isAuthenticated, isAdmin } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Estados para la orden
  const ESTADOS_ORDEN = [
    '1- PRECOTIZACION',
    '2- COTIZACION',
    '3- AUTORIZACION',
    '4- SOLICITUD DE MATERIALES',
    '5- AGENDAR DE EJECUCION',
    '6- PRUEBA O TEST',
    '7- ENTREGA Y FIRMA DE CONFORMIDAD',
    '8- CIERRE'
  ];
  
  // Verificar si el usuario es admin y está autenticado
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Cargar clientes y productos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Cargando datos con token fijo...");
        
        // Cargar clientes
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
        
        // Cargar productos
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
        setClientes([
          { id: 1, nombre: 'HOSPITAL SAN LUCAS' },
          { id: 2, nombre: 'CENTRO MEDICO NEFROLOGO DE CHIAPAS' }
        ]);
        
        setProductos([
          { 
            id: 1, 
            tipo: 'INSUMO', 
            nombre: 'AGUJA MESOTERAPIA 32G (5MM) CAJA 100 PZAS', 
            precio: 517 
          },
          { 
            id: 2, 
            tipo: 'SERVICIO', 
            nombre: 'MANTENIMIENTO PREVENTIVO DE TRATAMIENTO DE AGUA DESINFECCION DE OSMOSIS Y DESNFECCION DE RED', 
            precio: 2900 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);
  
  // Manejar cambio en cliente
  const handleClienteChange = (e) => {
    setFormData({
      ...formData,
      cliente: e.target.value
    });
  };
  
  // Manejar cambio en estado
  const handleEstadoChange = (e) => {
    setFormData({
      ...formData,
      estado: e.target.value
    });
  };
  
  // Manejar cambio en cantidad de ítem
  const handleCantidadChange = (e, index) => {
    const nuevaCantidad = parseInt(e.target.value) || 0;
    const nuevosItems = [...formData.items];
    nuevosItems[index] = {
      ...nuevosItems[index],
      cantidad: nuevaCantidad,
      importe: nuevaCantidad * nuevosItems[index].precio_unitario
    };
    
    setFormData({
      ...formData,
      items: nuevosItems
    });
  };
  
  // Manejar cambio en descripción de ítem
  const handleDescripcionChange = (e, index) => {
    const nuevosItems = [...formData.items];
    nuevosItems[index] = {
      ...nuevosItems[index],
      descripcion: e.target.value
    };
    
    setFormData({
      ...formData,
      items: nuevosItems
    });
  };
  
  // Manejar cambio en precio unitario de ítem
  const handlePrecioChange = (e, index) => {
    const nuevoPrecio = parseFloat(e.target.value) || 0;
    const nuevosItems = [...formData.items];
    nuevosItems[index] = {
      ...nuevosItems[index],
      precio_unitario: nuevoPrecio,
      importe: nuevosItems[index].cantidad * nuevoPrecio
    };
    
    setFormData({
      ...formData,
      items: nuevosItems
    });
  };
  
  // Manejar cambio en los campos de texto
  const handleTextChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };
  
  // Agregar ítem
  const handleAgregarItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { tipo: 'INSUMO', descripcion: '', cantidad: 1, precio_unitario: 0, importe: 0 }]
    });
  };
  
  // Eliminar ítem
  const handleEliminarItem = (index) => {
    if (formData.items.length > 1) {
      const nuevosItems = [...formData.items];
      nuevosItems.splice(index, 1);
      
      setFormData({
        ...formData,
        items: nuevosItems
      });
    }
  };
  
  // Seleccionar producto
  const handleSeleccionarProducto = (producto, index) => {
    const nuevosItems = [...formData.items];
    nuevosItems[index] = {
      tipo: producto.tipo,
      descripcion: producto.nombre,
      cantidad: 1,
      precio_unitario: producto.precio,
      importe: producto.precio
    };
    
    setFormData({
      ...formData,
      items: nuevosItems
    });
  };
  
  // Calcular total
  const calcularTotal = () => {
    return formData.items.reduce((total, item) => total + item.importe, 0);
  };
  
  // Convertir número a letra
  const numeroALetras = (numero) => {
    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
    const especiales = {
      11: 'ONCE', 12: 'DOCE', 13: 'TRECE', 14: 'CATORCE', 15: 'QUINCE',
      16: 'DIECISEIS', 17: 'DIECISIETE', 18: 'DIECIOCHO', 19: 'DIECINUEVE',
      21: 'VEINTIUNO', 22: 'VEINTIDOS', 23: 'VEINTITRES', 24: 'VEINTICUATRO', 25: 'VEINTICINCO',
      26: 'VEINTISEIS', 27: 'VEINTISIETE', 28: 'VEINTIOCHO', 29: 'VEINTINUEVE'
    };
    
    if (numero === 0) return 'CERO';
    
    let resultado = '';
    
    // Para millares
    if (numero >= 1000) {
      if (Math.floor(numero / 1000) === 1) {
        resultado += 'MIL ';
      } else {
        resultado += numeroALetras(Math.floor(numero / 1000)) + ' MIL ';
      }
      numero %= 1000;
    }
    
    // Para centenas
    if (numero >= 100) {
      if (numero === 100) {
        resultado += 'CIEN ';
      } else {
        resultado += centenas[Math.floor(numero / 100)] + ' ';
      }
      numero %= 100;
    }
    
    // Para decenas y unidades
    if (numero > 0) {
      if (especiales[numero]) {
        resultado += especiales[numero] + ' ';
      } else if (numero < 10) {
        resultado += unidades[numero] + ' ';
      } else {
        resultado += decenas[Math.floor(numero / 10)];
        if (numero % 10 > 0) {
          resultado += ' Y ' + unidades[numero % 10] + ' ';
        } else {
          resultado += ' ';
        }
      }
    }
    
    return resultado.trim();
  };
  
  // Generar importe con letra
  const generarImporteConLetra = () => {
    const total = calcularTotal();
    const entero = Math.floor(total);
    const centavos = Math.round((total - entero) * 100);
    
    let resultado = numeroALetras(entero) + ' PESOS';
    if (centavos > 0) {
      resultado += ' ' + (centavos < 10 ? '0' + centavos : centavos) + '/100';
    } else {
      resultado += ' 00/100';
    }
    
    return resultado + ' M.N.';
  };
  
  // Guardar orden
  const handleGuardar = async () => {
    try {
      setError(null);
      
      // Validar datos
      if (!formData.cliente) {
        throw new Error('Debe seleccionar un cliente');
      }
      
      if (formData.items.some(item => !item.descripcion || item.cantidad <= 0)) {
        throw new Error('Verifique que todos los ítems tengan descripción y cantidad mayor a cero');
      }
      
      // Preparar datos para la API
      const ordenData = {
        id_cliente: formData.cliente,
        estado: formData.estado,
        items: formData.items,
        total: calcularTotal(),
        importe_con_letra: generarImporteConLetra(),
        observaciones: formData.observaciones,
        actualizaciones: formData.actualizaciones,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString()
      };
      
      console.log("Guardando nueva orden:", ordenData);
      
      // Usar la API para crear orden
      const response = await fetch(`${API_URL}/api/ordenes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ordenData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al crear orden: ${response.status}`);
      }
      
      const nuevaOrden = await response.json();
      console.log("Orden creada:", nuevaOrden);
      
      setSuccessMessage('Orden de trabajo creada correctamente');
      
      // Redirigir a la lista de órdenes después de 2 segundos
      setTimeout(() => {
        navigate('/admin/todas-ordenes');
      }, 2000);
      
    } catch (error) {
      console.error("Error al guardar orden:", error);
      setError(error.message || 'Error al guardar orden');
    }
  };
  
  // Cancelar
  const handleCancelar = () => {
    navigate('/admin/todas-ordenes');
  };
  
  if (loading) {
    return <div className="generar-orden-container loading">Cargando datos...</div>;
  }
  
  return (
    <div className="generar-orden-container">
      <h2>Generar Orden de Trabajo</h2>
      <p>Complete los datos para generar una nueva orden de trabajo.</p>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="fixed-token-info">
        <span className="badge">Acceso Admin</span>
        <p>Usando acceso administrador con token seguro</p>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="cliente">Cliente</label>
          <select
            id="cliente"
            value={formData.cliente}
            onChange={handleClienteChange}
            className="form-select"
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="estado">Estado de la orden</label>
          <select
            id="estado"
            value={formData.estado}
            onChange={handleEstadoChange}
            className="form-select"
          >
            {ESTADOS_ORDEN.map((estado, index) => (
              <option key={index} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="items-section">
        <h3>Ítems de la orden</h3>
        
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>+</th>
                <th>-</th>
                <th>Cantidad</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Precio Unitario</th>
                <th>Importe</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td className="btn-cell">
                    <button 
                      type="button"
                      className="btn-small btn-add"
                      onClick={handleAgregarItem}
                    >
                      +
                    </button>
                  </td>
                  <td className="btn-cell">
                    <button 
                      type="button"
                      className="btn-small btn-remove"
                      onClick={() => handleEliminarItem(index)}
                      disabled={formData.items.length <= 1}
                    >
                      -
                    </button>
                  </td>
                  <td className="cantidad-cell">
                    <input 
                      type="number" 
                      value={item.cantidad} 
                      onChange={(e) => handleCantidadChange(e, index)}
                      min="1"
                    />
                  </td>
                  <td>{item.tipo}</td>
                  <td className="descripcion-cell">
                    <div className="producto-selector">
                      <input 
                        type="text" 
                        value={item.descripcion} 
                        onChange={(e) => handleDescripcionChange(e, index)}
                        placeholder="Seleccione o escriba descripción"
                      />
                      <div className="productos-dropdown">
                        {productos
                          .filter(p => p.nombre.toLowerCase().includes(item.descripcion.toLowerCase()))
                          .slice(0, 5)
                          .map(producto => (
                            <div 
                              key={producto.id} 
                              className="producto-option"
                              onClick={() => handleSeleccionarProducto(producto, index)}
                            >
                              {producto.nombre} - ${producto.precio}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </td>
                  <td className="precio-cell">
                    <input 
                      type="number" 
                      value={item.precio_unitario} 
                      onChange={(e) => handlePrecioChange(e, index)}
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="importe-cell">
                    <input 
                      type="number" 
                      value={item.importe} 
                      disabled
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="total-container">
          <div className="total-label">Total</div>
          <div className="total-amount">
            <input 
              type="number" 
              value={calcularTotal()} 
              disabled
            />
          </div>
        </div>
        
        <div className="importe-letra-container">
          <div className="importe-letra-label">importe con letra</div>
          <input 
            type="text" 
            value={generarImporteConLetra()} 
            disabled
            className="importe-letra-input"
          />
        </div>
      </div>
      
      <div className="observaciones-container">
        <div className="observaciones-label">observaciones (500 char)</div>
        <textarea 
          value={formData.observaciones} 
          onChange={(e) => handleTextChange(e, 'observaciones')}
          className="observaciones-textarea"
          maxLength={500}
        ></textarea>
      </div>
      
      <div className="actualizaciones-container">
        <div className="actualizaciones-label">actualizaciones (1,000 char)</div>
        <textarea 
          value={formData.actualizaciones} 
          onChange={(e) => handleTextChange(e, 'actualizaciones')}
          className="actualizaciones-textarea"
          maxLength={1000}
        ></textarea>
      </div>
      
      <div className="fecha-actualizacion-container">
        <div className="fecha-actualizacion-label">Fecha de creación <span className="autogenerado">autogenerado</span></div>
        <input 
          type="text" 
          value={new Date().toLocaleString()}
          disabled
          className="fecha-actualizacion-input"
        />
      </div>
      
      <div className="botones-accion">
        <button className="btn-guardar" onClick={handleGuardar}>
          Guardar
        </button>
        <button className="btn-cancelar" onClick={handleCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default GenerarOrden;