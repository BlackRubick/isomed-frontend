import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './TodasOrdenes.css';

// URL de la API
const API_URL = 'https://www.isomed.com.mx/api';

// Token fijo para administrador
const ADMIN_FIXED_TOKEN = "admin_fixed_token_12345";

// Datos de ejemplo para órdenes de trabajo
const ORDENES_EJEMPLO = [
  {
    id: 1001,
    cliente: 'HOSPITAL SAN LUCAS',
    estado: '2- COTIZACION',
    fecha_creacion: '2025-04-05T10:15:00',
    fecha_actualizacion: '2025-04-08T09:07:52',
    items: [
      {
        id: 1,
        tipo: 'INSUMO',
        descripcion: 'AGUJA MESOTERAPIA 32G (5MM) CAJA 100 PZAS',
        cantidad: 1,
        precio_unitario: 517,
        importe: 517
      }
    ],
    total: 25400,
    importe_con_letra: 'VEINTICINCO MIL CUATROCIENTOS PESOS 00/100 M.N.',
    observaciones: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR, ADIPISCING ELIT NISI VULPUTATE VEL. CONVALLIS DICTUMST NISL PORTA, PELLENTESQUE NON ULTRICES ODIO AUCTOR NOSTRA FAUCIBUS LOBORTIS PHARETRA LAOREET POSUERE LECTUS CONSEQUAT RISUS, TEMPUS FERMENTUM SAPIEN LACUS CLASS NATOQUE NIBH VARIUS QUISQUE DIAM VIVERRA MI. TURPIS PHARETRA ETIAM IACULIS URNA LITORA CLASS QUISQUE NOSTRA, VENENATIS TEMPUS SEMPER QUIS RUTRUM LIBERO TACITI, FEUGIAT HAC SENECTUS TELLUS AUGUE',
    actualizaciones: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR, ADIPISCING ELIT NISI VULPUTATE VEL. CONVALLIS DICTUMST NISL PORTA, PELLENTESQUE NON ULTRICES ODIO AUCTOR NOSTRA FAUCIBUS LOBORTIS PHARETRA LAOREET POSUERE LECTUS CONSEQUAT RISUS, TEMPUS FERMENTUM SAPIEN LACUS CLASS NATOQUE NIBH VARIUS QUISQUE DIAM VIVERRA MI. TURPIS PHARETRA ETIAM IACULIS URNA LITORA CLASS QUISQUE NOSTRA, VENENATIS TEMPUS SEMPER QUIS RUTRUM LIBERO TACITI, FEUGIAT HAC SENECTUS TELLUS AUGUE LOREM IPSUM DOLOR SIT AMET CONSECTETUR, ADIPISCING ELIT NISI VULPUTATE VEL. CONVALLIS DICTUMST NISL PORTA, PELLENTESQUE NON ULTRICES ODIO AUCTOR NOSTRA FAUCIBUS LOBORTIS PHARETRA LAOREET POSUERE LECTUS CONSEQUAT RISUS,'
  },
  {
    id: 1002,
    cliente: 'CENTRO MEDICO NEFROLOGO DE CHIAPAS',
    estado: '5- AGENDAR DE EJECUCION',
    fecha_creacion: '2025-04-10T14:30:00',
    fecha_actualizacion: '2025-04-12T16:45:22',
    items: [
      {
        id: 1,
        tipo: 'SERVICIO',
        descripcion: 'MANTENIMIENTO PREVENTIVO DE TRATAMIENTO DE AGUA DESINFECCION DE OSMOSIS Y DESNFECCION DE RED',
        cantidad: 1,
        precio_unitario: 2900,
        importe: 2900
      }
    ],
    total: 2900,
    importe_con_letra: 'DOS MIL NOVECIENTOS PESOS 00/100 M.N.',
    observaciones: 'SERVICIO PROGRAMADO PARA EL 15 DE ABRIL',
    actualizaciones: 'SE RECIBE AUTORIZACIÓN DEL CLIENTE POR CORREO ELECTRÓNICO. SE AGENDA VISITA PARA EL DÍA 15 DE ABRIL A LAS 10:00 AM.'
  }
];

const TodasOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { isAuthenticated, isAdmin } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Verificar si el usuario es admin y está autenticado
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Cargar órdenes de trabajo
  useEffect(() => {
    const fetchOrdenes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Cargando órdenes de trabajo con token fijo...");
        
        // Intentar obtener órdenes desde la API
        const response = await fetch(`${API_URL}/api/ordenes`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al cargar órdenes: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Órdenes cargadas:", data);
        setOrdenes(data);
        
      } catch (error) {
        console.error("Error al cargar órdenes:", error);
        setError(error.message || 'Error al cargar órdenes');
        
        // Usar datos de ejemplo si falla la carga
        setOrdenes(ORDENES_EJEMPLO);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchOrdenes();
    }
  }, [isAuthenticated, isAdmin]);
  
  // Manejar clic en ver orden
  const handleVerOrden = (orden) => {
    setOrdenSeleccionada(orden);
    setEditando(false);
  };
  
  // Manejar clic en editar orden
  const handleEditarOrden = (orden) => {
    setOrdenSeleccionada(orden);
    setEditando(true);
  };
  
  // Manejar clic en generar nueva orden
  const handleNuevaOrden = () => {
    navigate('/admin/generar-orden');
  };
  
  // Manejar cambio en cantidad de ítem
  const handleCantidadChange = (e, index) => {
    if (ordenSeleccionada && editando) {
      const nuevaCantidad = parseInt(e.target.value) || 0;
      const nuevosItems = [...ordenSeleccionada.items];
      nuevosItems[index] = {
        ...nuevosItems[index],
        cantidad: nuevaCantidad,
        importe: nuevaCantidad * nuevosItems[index].precio_unitario
      };
      
      // Recalcular total
      const nuevoTotal = nuevosItems.reduce((sum, item) => sum + item.importe, 0);
      
      setOrdenSeleccionada({
        ...ordenSeleccionada,
        items: nuevosItems,
        total: nuevoTotal
      });
    }
  };
  
  // Manejar cambio en los campos de texto
  const handleTextChange = (e, field) => {
    if (ordenSeleccionada && editando) {
      setOrdenSeleccionada({
        ...ordenSeleccionada,
        [field]: e.target.value
      });
    }
  };
  
  // Guardar cambios en la orden
  const handleGuardarCambios = async () => {
    try {
      setError(null);
      
      console.log("Guardando cambios en orden:", ordenSeleccionada.id);
      
      // Usar la API para actualizar la orden
      const response = await fetch(`${API_URL}/api/ordenes/${ordenSeleccionada.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ordenSeleccionada)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al actualizar orden: ${response.status}`);
      }
      
      const updatedOrden = await response.json();
      console.log("Orden actualizada:", updatedOrden);
      
      // Actualizar la lista de órdenes
      const nuevasOrdenes = ordenes.map(orden => 
        orden.id === ordenSeleccionada.id ? updatedOrden : orden
      );
      
      setOrdenes(nuevasOrdenes);
      setEditando(false);
      setSuccessMessage('Orden actualizada correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setError(error.message || 'Error al guardar cambios');
    }
  };
  
  // Cancelar edición
  const handleCancelar = () => {
    // Si estamos editando, cancelar edición
    if (editando) {
      setEditando(false);
      // Recargar la orden original desde el array de órdenes
      const ordenOriginal = ordenes.find(o => o.id === ordenSeleccionada.id);
      setOrdenSeleccionada(ordenOriginal);
    } else {
      // Si solo estamos viendo, cerrar el detalle
      setOrdenSeleccionada(null);
    }
  };
  
  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return `${fecha.getDate().toString().padStart(2, '0')} ${['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][fecha.getMonth()]} ${fecha.getFullYear()} - ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}:${fecha.getSeconds().toString().padStart(2, '0')}`;
    } catch (e) {
      return fechaStr;
    }
  };
  
  if (loading) {
    return <div className="todas-ordenes-container loading">Cargando órdenes de trabajo...</div>;
  }
  
  // Si hay una orden seleccionada, mostrar su detalle
  if (ordenSeleccionada) {
    return (
      <div className="detalle-orden-container">
        <h2>Orden de Trabajo #{ordenSeleccionada.id}</h2>
        <p>Cliente: {ordenSeleccionada.cliente}</p>
        <p>Estado: {ordenSeleccionada.estado}</p>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        {/* Tabla de ítems */}
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
              {ordenSeleccionada.items.map((item, index) => (
                <tr key={index}>
                  <td className="btn-cell">
                    <button className="btn-small btn-add" disabled={!editando}>+</button>
                  </td>
                  <td className="btn-cell">
                    <button className="btn-small btn-remove" disabled={!editando || ordenSeleccionada.items.length <= 1}>-</button>
                  </td>
                  <td className="cantidad-cell">
                    <input 
                      type="number" 
                      value={item.cantidad} 
                      onChange={(e) => handleCantidadChange(e, index)}
                      disabled={!editando}
                    />
                  </td>
                  <td>{item.tipo}</td>
                  <td className="descripcion-cell">{item.descripcion}</td>
                  <td className="precio-cell">
                    <input 
                      type="number" 
                      value={item.precio_unitario} 
                      disabled={true}
                    />
                  </td>
                  <td className="importe-cell">
                    <input 
                      type="number" 
                      value={item.importe} 
                      disabled={true}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Total */}
        <div className="total-container">
          <div className="total-label">Total</div>
          <div className="total-amount">
            <input 
              type="number" 
              value={ordenSeleccionada.total} 
              disabled={true}
            />
          </div>
        </div>
        
        {/* Importe con letra */}
        <div className="importe-letra-container">
          <div className="importe-letra-label">importe con letra</div>
          <input 
            type="text" 
            value={ordenSeleccionada.importe_con_letra} 
            onChange={(e) => handleTextChange(e, 'importe_con_letra')}
            disabled={!editando}
            className="importe-letra-input"
          />
        </div>
        
        {/* Observaciones */}
        <div className="observaciones-container">
          <div className="observaciones-label">observaciones (500 char)</div>
          <textarea 
            value={ordenSeleccionada.observaciones} 
            onChange={(e) => handleTextChange(e, 'observaciones')}
            disabled={!editando}
            className="observaciones-textarea"
            maxLength={500}
          ></textarea>
        </div>
        
        {/* Actualizaciones */}
        <div className="actualizaciones-container">
          <div className="actualizaciones-label">actualizaciones (1,000 char)</div>
          <textarea 
            value={ordenSeleccionada.actualizaciones} 
            onChange={(e) => handleTextChange(e, 'actualizaciones')}
            disabled={!editando}
            className="actualizaciones-textarea"
            maxLength={1000}
          ></textarea>
        </div>
        
        {/* Fecha de última actualización */}
        <div className="fecha-actualizacion-container">
          <div className="fecha-actualizacion-label">Fecha de última actualización <span className="autogenerado">autogenerado</span></div>
          <input 
            type="text" 
            value={formatearFecha(ordenSeleccionada.fecha_actualizacion)}
            disabled={true}
            className="fecha-actualizacion-input"
          />
        </div>
        
        {/* Botones de acción */}
        <div className="botones-accion">
          <button className="btn-guardar" onClick={handleGuardarCambios} disabled={!editando}>
            Guardar
          </button>
          <button className="btn-cancelar" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }
  
  // Vista principal con lista de órdenes
  return (
    <div className="todas-ordenes-container">
      <h2>Órdenes de Trabajo</h2>
      <p>Administra las órdenes de trabajo del sistema.</p>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="fixed-token-info">
        <span className="badge">Acceso Admin</span>
        <p>Usando acceso administrador con token seguro</p>
      </div>
      
      <div className="action-bar">
        <button className="btn-nueva-orden" onClick={handleNuevaOrden}>
          + Generar orden de trabajo
        </button>
      </div>
      
      <div className="ordenes-table-container">
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Fecha de Creación</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No hay órdenes de trabajo disponibles</td>
              </tr>
            ) : (
              ordenes.map(orden => (
                <tr key={orden.id}>
                  <td>#{orden.id}</td>
                  <td>{orden.cliente}</td>
                  <td>{orden.estado}</td>
                  <td>{formatearFecha(orden.fecha_creacion)}</td>
                  <td>${orden.total}</td>
                  <td className="acciones-cell">
                    <button 
                      className="btn-ver" 
                      onClick={() => handleVerOrden(orden)}
                    >
                      Ver
                    </button>
                    <button 
                      className="btn-editar" 
                      onClick={() => handleEditarOrden(orden)}
                    >
                      Editar
                    </button>
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

export default TodasOrdenes;