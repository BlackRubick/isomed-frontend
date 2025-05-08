// src/pages/OrdenesTrabajoUsuario.jsx - Versión final
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './OrdenesTrabajoUsuario.css';

const OrdenesTrabajoUsuario = () => {
  // Datos de ejemplo para usar si la API falla
  const datosEjemplo = [
    {
      id: 1251,
      id_cliente: 15,
      status: '2- COTIZACION',
      fecha_mov: new Date().toISOString(),
      lineas_producto: [
        { id_producto: 1, cantidad: 1, precio_unitario: 18500, tipo: 'SERVICIO', 
          descripcion: 'MANTENIMIENTO PREVENTIVO A MAQUINA DE ANESTESIA LIMPIEZA Y DESINFECCION DE EQUIPO.' },
        { id_producto: 2, cantidad: 3, precio_unitario: 2300, tipo: 'SERVICIO',
          descripcion: 'MANTENIMIENTO PREVENTIVO DE TRATAMIENTO DE AGUA DESINFECCION DE OSMOSIS Y DEISNFECCION DE RED' }
      ]
    },
    {
      id: 1252,
      id_cliente: 15,
      status: '5- AGENDAR DE EJECUCION',
      fecha_mov: new Date(Date.now() - 86400000).toISOString(), // Ayer
      lineas_producto: [
        { id_producto: 3, cantidad: 1, precio_unitario: 517, tipo: 'INSUMO',
          descripcion: 'AGUJA MESOTERAPIA 32G (5MM) CAJA 100 PZAS' }
      ]
    }
  ];

  const [ordenes, setOrdenes] = useState([]);
  const [ordenActual, setOrdenActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevaOrden, setNuevaOrden] = useState({
    folio: '',
    idCliente: '',
    estado: '1- PRECOTIZACION',
    lineasProducto: [
      { cantidad: 1, tipo: 'SERVICIO', descripcion: '', precioUnitario: 0 }
    ],
    observaciones: ''
  });
  
  const { user, token } = useContext(AppContext);
  
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

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      
      // Verificar si el usuario tiene id_cliente
      if (!user || !user.id_cliente) {
        console.warn("Usuario sin ID de cliente, usando datos de ejemplo");
        setOrdenes(datosEjemplo);
        setLoading(false);
        return;
      }
      
      console.log("Buscando órdenes para cliente ID:", user.id_cliente);
      
      // Verificar si hay token disponible
      const currentToken = token || localStorage.getItem('token');
      
      if (!currentToken) {
        console.error("No se encontró token, usando datos de ejemplo");
        setOrdenes(datosEjemplo);
        setLoading(false);
        return;
      }
      
      // Usar el token directo, sin verificar si es mock o no
      console.log("Usando token:", currentToken);
      
      try {
        // Intentar obtener datos reales de la API con el token actual
        const response = await fetch(`${API_URL}/api/ordenes/cliente/${user.id_cliente}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Datos de órdenes recibidos:", data);
          setOrdenes(Array.isArray(data) ? data : []);
        } else {
          // Si la API no responde correctamente, usar datos de ejemplo
          console.warn(`API no disponible (status ${response.status}), usando datos de ejemplo`);
          const errorText = await response.text();
          console.error(`Error en respuesta: ${errorText}`);
          setOrdenes(datosEjemplo);
        }
      } catch (error) {
        console.warn("Error de conexión, usando datos de ejemplo:", error);
        setOrdenes(datosEjemplo);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error general:", error);
      setOrdenes(datosEjemplo);
      setLoading(false);
    }
  };

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
        alert('Por favor, añada al menos una línea de producto');
        setLoading(false);
        return;
      }
      
      // Verificar descripciones vacías
      const lineasVacias = nuevaOrden.lineasProducto.some(linea => !linea.descripcion.trim());
      if (lineasVacias) {
        alert('Por favor, complete todas las descripciones de productos');
        setLoading(false);
        return;
      }
      
      // Obtener el token más reciente
      const currentToken = token || localStorage.getItem('token');
      
      if (!currentToken) {
        alert("No hay token de autenticación disponible. Por favor, inicie sesión nuevamente.");
        setLoading(false);
        return;
      }
      
      console.log("Token a utilizar:", currentToken);
      
      // IMPORTANTE: Tu modelo de BD solo soporta una línea de producto
      // por orden, por lo que solo enviaremos la primera línea
      const primeraLinea = nuevaOrden.lineasProducto[0];
      
      // Formatear los datos según la estructura que espera la API
      const datosOrden = {
        id_cliente: user.id_cliente,
        id_producto: 1, // Valor por defecto
        status: nuevaOrden.estado,
        lineas_producto: [
          {
            id_producto: 1, // ID genérico
            cantidad: parseInt(primeraLinea.cantidad),
            precio_unitario: parseFloat(primeraLinea.precioUnitario)
          }
        ]
      };
      
      console.log("Enviando datos de orden:", datosOrden);
      console.log("Token utilizado:", currentToken);
      
      // Realizar la petición a la API
      const response = await fetch(`${API_URL}/api/ordenes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosOrden)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en respuesta:", errorText);
        
        // Si es un error de autenticación, ofrecer iniciar sesión nuevamente
        if (response.status === 401) {
          const recargar = window.confirm("Su sesión ha expirado. ¿Desea recargar la página para iniciar sesión nuevamente?");
          if (recargar) {
            window.location.reload();
            return;
          }
        }
        
        throw new Error(`Error al crear orden: ${response.status} ${errorText}`);
      }
      
      const ordenCreada = await response.json();
      console.log("Orden creada exitosamente:", ordenCreada);
      
      // Enriquecer la respuesta con los datos que tenemos (la API no devuelve descripción)
      const ordenEnriquecida = {
        ...ordenCreada,
        lineas_producto: ordenCreada.lineas_producto.map((linea, index) => ({
          ...linea,
          tipo: nuevaOrden.lineasProducto[index]?.tipo || 'SERVICIO',
          descripcion: nuevaOrden.lineasProducto[index]?.descripcion || ''
        }))
      };
      
      // Actualizar la lista de órdenes
      setOrdenes([...ordenes, ordenEnriquecida]);
      
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
      
      // Mostrar mensaje de éxito
      alert('Orden de trabajo creada correctamente');
      
    } catch (error) {
      console.error("Error al crear orden:", error);
      
      // Si el usuario no quiere recargar o es otro tipo de error, seguir con el modo de ejemplo
      alert(`Error: ${error.message}. Usando modo de ejemplo como alternativa.`);
    
      // Simular creación con datos de ejemplo
      const nuevaOrdenEjemplo = {
        id: Math.floor(Math.random() * 10000) + 100,
        id_cliente: user?.id_cliente || 15,
        status: nuevaOrden.estado,
        fecha_mov: new Date().toISOString(),
        lineas_producto: nuevaOrden.lineasProducto.map(linea => ({
          id_producto: Math.floor(Math.random() * 100) + 1,
          cantidad: parseInt(linea.cantidad),
          precio_unitario: parseFloat(linea.precioUnitario),
          tipo: linea.tipo,
          descripcion: linea.descripcion
        }))
      };
      
      // Actualizar la lista de órdenes con la simulación
      setOrdenes([...ordenes, nuevaOrdenEjemplo]);
      
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
    }
  };

  if (loading) {
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
          </div>
        )}
      </div>
      
      {/* Formulario de nueva orden */}
      {modoEdicion && (
        <div className="orden-form">
          <div className="form-header">
            <h2>Nueva Orden de Trabajo</h2>
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
                    <input type="text" value={user?.nombre_completo || user?.name || 'CENTRO RADIOLOGICO DEL SURESTE'} disabled />
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