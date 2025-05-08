// src/pages/OrdenesTrabajoUsuario.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './OrdenesTrabajoUsuario.css';

const OrdenesTrabajoUsuario = () => {
  // Datos de ejemplo para probar la interfaz mientras el API se implementa
  const datosEjemplo = [
    {
      id: 1,
      id_cliente: 1,
      status: '2- COTIZACION',
      fecha_mov: new Date().toISOString(),
      lineas_producto: [
        { id_producto: 1, cantidad: 1, precio_unitario: 18500 },
        { id_producto: 2, cantidad: 3, precio_unitario: 2300 }
      ]
    },
    {
      id: 2,
      id_cliente: 1,
      status: '5- AGENDAR DE EJECUCION',
      fecha_mov: new Date(Date.now() - 86400000).toISOString(), // Ayer
      lineas_producto: [
        { id_producto: 3, cantidad: 2, precio_unitario: 517 }
      ]
    }
  ];

  const [ordenes, setOrdenes] = useState([]);
  const [ordenActual, setOrdenActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevaOrden, setNuevaOrden] = useState({
    folio: '',
    idCliente: '',
    estado: '1- PRECOTIZACION',
    lineasProducto: [
      { cantidad: 1, tipo: 'SERVICIO', descripcion: '', precioUnitario: 0 }
    ],
    observaciones: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usarDatosEjemplo, setUsarDatosEjemplo] = useState(false);
  
  const { user, token, logout } = useContext(AppContext);
  const navigate = useNavigate();
  
  const estados = [
    '1- PRECOTIZACION',
    '2- COTIZACION',
    '3- AUTORIZACION',
    '4- SOLICITUD DE MATERIALES',
    '5- AGENDAR DE EJECUCION',
    '6- PRUEBA O TEST',
    '7- ENTREGA Y FIRMA DE CONFORMIDAD',
    '8- CIERRE'
  ];
  
  const tiposProducto = ['SERVICIO', 'INSUMO', 'EQUIPO', 'REPUESTO'];

  // Función para manejar la sesión expirada
  const handleSessionExpired = () => {
    logout();
    navigate('/login');
  };

  // Función para activar el modo de datos de ejemplo
  const handleUsarDatosEjemplo = () => {
    setUsarDatosEjemplo(true);
    setOrdenes(datosEjemplo);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        setLoading(true);
        
        // Si ya elegimos usar datos de ejemplo, no hacemos la petición
        if (usarDatosEjemplo) {
          setLoading(false);
          return;
        }
        
        // Verificar si el usuario tiene id_cliente
        if (!user || !user.id_cliente) {
          setError('No hay información de cliente asociada a su cuenta. Contacte al administrador para vincular su cuenta a un cliente.');
          setLoading(false);
          return;
        }
        
        console.log("Buscando órdenes para cliente ID:", user.id_cliente);
        console.log("Token siendo utilizado:", token ? "Presente" : "Ausente"); // Sin mostrar todo el token
        
        // Verificar si hay token
        if (!token) {
          setError('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
          setLoading(false);
          return;
        }
        
        try {
          // Realizar la solicitud a la API
          const response = await fetch(`/api/ordenes/cliente/${user.id_cliente}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          // Registrar información de la respuesta para depuración
          console.log("Código de estado HTTP:", response.status);
          
          // Si la respuesta no es exitosa
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en respuesta:", errorText);
            
            // Mensaje diferente según el código de error
            if (response.status === 404) {
              // En este caso aún podemos continuar y permitir crear nuevas órdenes
              console.log("No se encontraron órdenes existentes");
              setOrdenes([]);
            } else if (response.status === 401) {
              setError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
            } else {
              setError(`Error al cargar las órdenes de trabajo: ${response.status}`);
            }
            setLoading(false);
            return;
          }

          const data = await response.json();
          console.log("Datos de órdenes recibidos:", data);
          setOrdenes(Array.isArray(data) ? data : []);
          setLoading(false);
        } catch (error) {
          console.error('Error en la petición:', error);
          setError(`Error al consultar órdenes: ${error.message}. El servidor podría no estar disponible.`);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error en la lógica de carga:', error);
        setError(`Error inesperado: ${error.message}`);
        setLoading(false);
      }
    };

    if (user && token) {
      fetchOrdenes();
    } else {
      setLoading(false);
      setError('Información de usuario no disponible. Por favor, inicie sesión.');
    }
  }, [user, token, navigate, usarDatosEjemplo]);

  // Función para calcular el importe de una línea
  const calcularImporte = (cantidad, precioUnitario) => {
    return cantidad * precioUnitario;
  };

  // Función para calcular el total de la orden
  const calcularTotal = (lineas) => {
    return lineas.reduce((total, linea) => {
      return total + calcularImporte(linea.cantidad, linea.precioUnitario || 0);
    }, 0);
  };

  // Función para agregar una nueva línea de producto
  const agregarLineaProducto = () => {
    setNuevaOrden({
      ...nuevaOrden,
      lineasProducto: [
        ...nuevaOrden.lineasProducto,
        { cantidad: 1, tipo: 'SERVICIO', descripcion: '', precioUnitario: 0 }
      ]
    });
  };

  // Función para eliminar una línea de producto
  const eliminarLineaProducto = (index) => {
    const nuevasLineas = [...nuevaOrden.lineasProducto];
    nuevasLineas.splice(index, 1);
    setNuevaOrden({
      ...nuevaOrden,
      lineasProducto: nuevasLineas
    });
  };

  // Función para actualizar una línea de producto
  const actualizarLineaProducto = (index, campo, valor) => {
    const nuevasLineas = [...nuevaOrden.lineasProducto];
    nuevasLineas[index] = {
      ...nuevasLineas[index],
      [campo]: valor
    };
    setNuevaOrden({
      ...nuevaOrden,
      lineasProducto: nuevasLineas
    });
  };

  // Función para actualizar el campo de la orden
  const handleOrdenChange = (campo, valor) => {
    setNuevaOrden({
      ...nuevaOrden,
      [campo]: valor
    });
  };

  // Función para crear una nueva orden
  const crearNuevaOrden = async () => {
    try {
      setLoading(true);
      
      // Verificar si los campos obligatorios están completos
      if (!nuevaOrden.lineasProducto.length) {
        setError('Por favor, añada al menos una línea de producto');
        setLoading(false);
        return;
      }
      
      // Verificar descripciones vacías
      const lineasVacias = nuevaOrden.lineasProducto.some(linea => !linea.descripcion.trim());
      if (lineasVacias) {
        setError('Por favor, complete todas las descripciones de productos');
        setLoading(false);
        return;
      }
      
      // Formatear los datos para el backend
      const datosOrden = {
        id_cliente: user.id_cliente,
        id_producto: 1, // Valor predeterminado, ajustar según tu API
        status: nuevaOrden.estado,
        lineas_producto: nuevaOrden.lineasProducto.map(linea => ({
          id_producto: 1, // Ajustar según tu modelo de datos
          cantidad: parseInt(linea.cantidad),
          precio_unitario: parseFloat(linea.precioUnitario)
        }))
      };
      
      console.log("Enviando datos de nueva orden:", datosOrden);
      
      // Si estamos usando datos de ejemplo, simular la creación de una orden
      if (usarDatosEjemplo) {
        const nuevaOrdenEjemplo = {
          id: Math.floor(Math.random() * 10000) + 100, // ID aleatorio
          id_cliente: user.id_cliente,
          status: nuevaOrden.estado,
          fecha_mov: new Date().toISOString(),
          lineas_producto: nuevaOrden.lineasProducto.map(linea => ({
            id_producto: Math.floor(Math.random() * 100) + 1, // ID aleatorio
            cantidad: parseInt(linea.cantidad),
            precio_unitario: parseFloat(linea.precioUnitario),
            descripcion: linea.descripcion  // Añadir descripción para mostrarla
          }))
        };
        
        // Actualizar la lista de órdenes con la nueva orden
        setOrdenes([...ordenes, nuevaOrdenEjemplo]);
        
        // Simular una pequeña demora
        setTimeout(() => {
          // Resetear el formulario
          setNuevaOrden({
            folio: '',
            idCliente: '',
            estado: '1- PRECOTIZACION',
            lineasProducto: [
              { cantidad: 1, tipo: 'SERVICIO', descripcion: '', precioUnitario: 0 }
            ],
            observaciones: ''
          });
          
          setModoEdicion(false);
          setLoading(false);
        }, 1000);
        
        return;
      }
      
      // Enviar la orden al backend
      const response = await fetch('/api/ordenes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosOrden)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear orden: ${errorText}`);
      }
      
      const ordenCreada = await response.json();
      console.log("Orden creada exitosamente:", ordenCreada);
      
      // Actualizar la lista de órdenes
      setOrdenes([...ordenes, ordenCreada]);
      
      // Resetear el formulario
      setNuevaOrden({
        folio: '',
        idCliente: '',
        estado: '1- PRECOTIZACION',
        lineasProducto: [
          { cantidad: 1, tipo: 'SERVICIO', descripcion: '', precioUnitario: 0 }
        ],
        observaciones: ''
      });
      
      setModoEdicion(false);
      setLoading(false);
      
    } catch (error) {
      console.error("Error al crear orden:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Mostrar un mensaje informativo si el usuario no tiene ID de cliente
  if (!user?.id_cliente && !loading && !usarDatosEjemplo) {
    return (
      <div className="ordenes-trabajo-container">
        <h1>Mis Órdenes de Trabajo</h1>
        <div className="no-client-message">
          <div className="icon">⚠️</div>
          <h2>Cuenta no vinculada</h2>
          <p>Su cuenta de usuario no está vinculada a ningún cliente en el sistema.</p>
          <p>Por favor, póngase en contacto con el administrador para vincular su cuenta a un cliente.</p>
          <p className="info">Información de usuario: {user?.email}</p>
          
          <div className="error-actions">
            <button className="continue-button" onClick={handleUsarDatosEjemplo}>
              Usar datos de ejemplo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !modoEdicion) {
    return (
      <div className="ordenes-trabajo-container">
        <h1>Mis Órdenes de Trabajo</h1>
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando órdenes de trabajo...</p>
        </div>
      </div>
    );
  }

  if (error && !modoEdicion && !usarDatosEjemplo) {
    return (
      <div className="ordenes-trabajo-container">
        <h1>Mis Órdenes de Trabajo</h1>
        <div className="error">
          <div className="icon">❌</div>
          <h2>Ha ocurrido un error</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button className="retry-button" onClick={() => window.location.reload()}>
              Intentar nuevamente
            </button>
            {error.includes('sesión') && (
              <button className="login-button" onClick={handleSessionExpired}>
                Volver a iniciar sesión
              </button>
            )}
            <button className="continue-button" onClick={handleUsarDatosEjemplo}>
              Usar datos de ejemplo
            </button>
            <button className="continue-button" onClick={() => setModoEdicion(true)}>
              Continuar de todos modos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ordenes-trabajo-container">
      <h1>Mis Órdenes de Trabajo</h1>
      
      {/* Botones de acción */}
      <div className="actions-container">
        <button 
          className="action-button new-order" 
          onClick={() => setModoEdicion(!modoEdicion)}
        >
          {modoEdicion ? 'Cancelar' : 'Nueva Orden de Trabajo'}
        </button>
        
        {ordenes.length > 0 && !modoEdicion && (
          <div className="orders-summary">
            <span>Total de órdenes: {ordenes.length}</span>
            {usarDatosEjemplo && (
              <span className="demo-badge">Modo de ejemplo</span>
            )}
          </div>
        )}
      </div>
      
      {/* Formulario de nueva orden */}
      {modoEdicion && (
        <div className="orden-form">
          <div className="form-header">
            <h2>Nueva Orden de Trabajo</h2>
            {usarDatosEjemplo && (
              <span className="demo-badge">Modo de ejemplo</span>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Folio de orden de trabajo</label>
              <input 
                type="text" 
                value={nuevaOrden.folio}
                onChange={(e) => handleOrdenChange('folio', e.target.value)}
                placeholder="Se generará automáticamente"
                disabled
              />
            </div>
            
            <div className="form-group">
              <label>ID Cliente</label>
              <input 
                type="text" 
                value={user?.nombre_completo || user?.name || 'Cliente'}
                placeholder="Cliente asociado a su cuenta"
                disabled
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Estado de la orden de trabajo</label>
              <select 
                value={nuevaOrden.estado}
                onChange={(e) => handleOrdenChange('estado', e.target.value)}
              >
                {estados.map((estado, index) => (
                  <option key={index} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Tabla de productos */}
          <div className="productos-table">
            <div className="table-header">
              <div className="cell actions-cell"></div>
              <div className="cell cantidad-cell">cantidad</div>
              <div className="cell tipo-cell">tipo de producto</div>
              <div className="cell descripcion-cell">descripción del producto</div>
              <div className="cell precio-cell">precio unitario</div>
              <div className="cell importe-cell">importe</div>
            </div>
            
            {nuevaOrden.lineasProducto.map((linea, index) => (
              <div className="table-row" key={index}>
                <div className="cell actions-cell">
                  <button 
                    className="action-icon add"
                    onClick={() => agregarLineaProducto()}
                    title="Agregar línea"
                  >+</button>
                  <button 
                    className="action-icon remove"
                    onClick={() => eliminarLineaProducto(index)}
                    title="Eliminar línea"
                    disabled={nuevaOrden.lineasProducto.length === 1}
                  >-</button>
                </div>
                <div className="cell cantidad-cell">
                  <input 
                    type="number" 
                    min="1"
                    value={linea.cantidad}
                    onChange={(e) => actualizarLineaProducto(index, 'cantidad', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="cell tipo-cell">
                  <select 
                    value={linea.tipo}
                    onChange={(e) => actualizarLineaProducto(index, 'tipo', e.target.value)}
                  >
                    {tiposProducto.map((tipo, i) => (
                      <option key={i} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                <div className="cell descripcion-cell">
                  <input 
                    type="text" 
                    value={linea.descripcion}
                    onChange={(e) => actualizarLineaProducto(index, 'descripcion', e.target.value)}
                    placeholder="Descripción del producto o servicio"
                  />
                </div>
                <div className="cell precio-cell">
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={linea.precioUnitario}
                    onChange={(e) => actualizarLineaProducto(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="cell importe-cell">
                  <input 
                    type="text" 
                    value={calcularImporte(linea.cantidad, linea.precioUnitario).toFixed(2)}
                    disabled
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="total-container">
            <label>Total</label>
            <input 
              type="text" 
              value={calcularTotal(nuevaOrden.lineasProducto).toFixed(2)}
              disabled
            />
          </div>
          
          {/* Observaciones */}
          <div className="form-group observaciones">
            <label>Observaciones</label>
            <textarea 
              rows="3"
              value={nuevaOrden.observaciones || ''}
              onChange={(e) => handleOrdenChange('observaciones', e.target.value)}
              placeholder="Observaciones adicionales para esta orden"
            ></textarea>
          </div>
          
          {/* Fecha de actualización */}
          <div className="fecha-actualizacion">
            <label>Fecha de última actualización</label>
            <input 
              type="text" 
              value={new Date().toLocaleString()}
              disabled
            />
          </div>
          
          {/* Botones de acción del formulario */}
          <div className="form-actions">
            <button 
              className="cancel-button"
              onClick={() => setModoEdicion(false)}
            >
              Cancelar
            </button>
            <button 
              className="save-button"
              onClick={crearNuevaOrden}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Orden'}
            </button>
          </div>
        </div>
      )}
      
      {/* Lista de órdenes existentes */}
      {!modoEdicion && ordenes.length === 0 ? (
        <div className="no-orders-message">
          <div className="icon">📋</div>
          <h2>No tiene órdenes de trabajo</h2>
          <p>Actualmente no hay órdenes de trabajo registradas para su cuenta.</p>
          <p>Puede crear una nueva orden haciendo clic en el botón "Nueva Orden de Trabajo".</p>
        </div>
      ) : !modoEdicion && (
        <div className="ordenes-lista">
          <table className="ordenes-table">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map(orden => (
                <tr key={orden.id}>
                  <td>{orden.id}</td>
                  <td>{user?.nombre_completo || user?.name || 'Cliente'}</td>
                  <td>{orden.status}</td>
                  <td>{new Date(orden.fecha_mov || Date.now()).toLocaleDateString()}</td>
                  <td>
                    ${orden.lineas_producto && orden.lineas_producto.length > 0
                      ? orden.lineas_producto.reduce(
                          (total, linea) => total + (linea.precio_unitario * linea.cantidad), 
                          0
                        ).toFixed(2)
                      : "0.00"}
                  </td>
                  <td>
                    <button 
                      className="view-button"
                      onClick={() => setOrdenActual(orden)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal de detalle de orden */}
      {ordenActual && (
        <div className="orden-modal-overlay" onClick={() => setOrdenActual(null)}>
          <div className="orden-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle de Orden #{ordenActual.id}</h2>
              <button className="close-button" onClick={() => setOrdenActual(null)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="orden-detail-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Folio de orden de trabajo</label>
                    <input type="text" value={ordenActual.id} disabled />
                  </div>
                  
                  <div className="form-group">
                    <label>ID Cliente</label>
                    <input type="text" value={user?.nombre_completo || user?.name || 'Cliente'} disabled />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Estado de la orden de trabajo</label>
                    <input type="text" value={ordenActual.status} disabled />
                  </div>
                </div>
                
                {/* Tabla de productos */}
                <div className="productos-table">
                  <div className="table-header">
                    <div className="cell cantidad-cell">cantidad</div>
                    <div className="cell tipo-cell">tipo de producto</div>
                    <div className="cell descripcion-cell">descripción del producto</div>
                    <div className="cell precio-cell">precio unitario</div>
                    <div className="cell importe-cell">importe</div>
                  </div>
                  
                  {ordenActual.lineas_producto && ordenActual.lineas_producto.map((linea, index) => (
                    <div className="table-row" key={index}>
                      <div className="cell cantidad-cell">
                        <input type="text" value={linea.cantidad} disabled />
                      </div>
                      <div className="cell tipo-cell">
                        <input type="text" value={linea.tipo || "SERVICIO"} disabled />
                      </div>
                      <div className="cell descripcion-cell">
                        <input 
                          type="text" 
                          value={linea.descripcion || `Producto/Servicio #${linea.id_producto}`} 
                          disabled 
                        />
                      </div>
                      <div className="cell precio-cell">
                        <input type="text" value={linea.precio_unitario.toFixed(2)} disabled />
                      </div>
                      <div className="cell importe-cell">
                        <input type="text" value={(linea.precio_unitario * linea.cantidad).toFixed(2)} disabled />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total */}
                <div className="total-container">
                  <label>Total</label>
                  <input 
                    type="text" 
                    value={
                      ordenActual.lineas_producto 
                        ? ordenActual.lineas_producto.reduce(
                            (total, linea) => total + (linea.precio_unitario * linea.cantidad), 
                            0
                          ).toFixed(2)
                        : "0.00"
                    }
                    disabled
                  />
                </div>
                
                {/* Observaciones - si existen */}
                {ordenActual.observaciones && (
                  <div className="form-group observaciones">
                    <label>Observaciones</label>
                    <textarea 
                      rows="3"
                      value={ordenActual.observaciones}
                      disabled
                    ></textarea>
                  </div>
                )}
                
                {/* Fecha de actualización */}
                <div className="fecha-actualizacion">
                  <label>Fecha de última actualización</label>
                  <input 
                    type="text" 
                    value={new Date(ordenActual.fecha_mov || Date.now()).toLocaleString()}
                    disabled
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="close-modal-button" onClick={() => setOrdenActual(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdenesTrabajoUsuario;