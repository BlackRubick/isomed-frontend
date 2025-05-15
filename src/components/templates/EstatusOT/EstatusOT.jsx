import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './EstatusOT.css';

// URL de la API
const API_URL = 'https://www.isomed.com.mx/api';

// Token fijo para administrador
const ADMIN_FIXED_TOKEN = "admin_fixed_token_12345";

// Estados iniciales para órdenes de trabajo
const ESTADOS_OT_INICIALES = [
  { id: 2001, nombre: '01 - SOLICITUD DE SERVICIO', descripcion: 'Orden en fase inicial de cotización previa' },
  { id: 2002, nombre: '02 - CONTACTO O VISITA AL CLIENTE', descripcion: 'Cotización formal enviada al cliente' },
  { id: 2003, nombre: '03 - LEVANTAMIENTO DE INFORMACION', descripcion: 'Esperando autorización del cliente' },
  { id: 2004, nombre: '04 - PRECOTIZACION', descripcion: 'En proceso de adquisición de materiales' },
  { id: 2005, nombre: '05 - COTIZACION', descripcion: 'Programando fecha y hora de ejecución' },
  { id: 2006, nombre: '06 - AUTORIZACION DESDE CLIENTE', descripcion: 'En fase de pruebas o verificación' },
  { id: 2007, nombre: '07 - SOLICITUD DE PARTES', descripcion: 'Entregando al cliente y obteniendo firma' },
  { id: 2008, nombre: '08 - EJECUCION - INSTALACION', descripcion: 'Orden completada y cerrada' },
  { id: 2009, nombre: '09 - PRUEBAS', descripcion: 'Orden completada y cerrada' },
  { id: 2010, nombre: '10 - ENTREGA O RECEPCION', descripcion: 'Orden completada y cerrada' },
  { id: 2011, nombre: '11 - CONCLUSION O CIERRE', descripcion: 'Orden completada y cerrada' }
];

const EstatusOT = () => {
  const [estados, setEstados] = useState(ESTADOS_OT_INICIALES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  
  const { isAuthenticated, isAdmin } = useContext(AppContext) || { isAuthenticated: true, isAdmin: true };
  const navigate = useNavigate || (() => {});
  
  // Verificar si el usuario es admin y está autenticado
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate && navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Cargar estados desde la API (simulado)
  useEffect(() => {
    const fetchEstados = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Cargando estados de OT con token fijo...");
        
        // Simular carga desde API
        setTimeout(() => {
          setEstados(ESTADOS_OT_INICIALES);
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error("Error al cargar estados de OT:", error);
        setError("Error al cargar estados de OT");
        
        // Usar datos de ejemplo si falla la carga
        setEstados(ESTADOS_OT_INICIALES);
        setLoading(false);
      }
    };
    
    fetchEstados();
  }, []);
  
  // Agregar nuevo estado
  const agregarEstado = () => {
    if (!nuevoNombre.trim()) return;
    
    // Encontrar el próximo ID disponible
    const maxId = Math.max(...estados.map(estado => estado.id), 2000);
    const nuevoId = maxId + 1;
    
    const nuevoEstado = {
      id: nuevoId,
      nombre: nuevoNombre,
      descripcion: 'Nueva descripción'
    };
    
    setEstados([...estados, nuevoEstado]);
    setNuevoNombre('');
  };
  
  // Iniciar edición de un estado
  const iniciarEdicion = (id, nombre) => {
    setEditandoId(id);
    setNombreEditado(nombre);
  };
  
  // Guardar cambios de edición
  const guardarEdicion = (id) => {
    if (!nombreEditado.trim()) return;
    
    const estadosActualizados = estados.map(estado => 
      estado.id === id ? {...estado, nombre: nombreEditado} : estado
    );
    
    setEstados(estadosActualizados);
    setEditandoId(null);
    setNombreEditado('');
  };
  
  // Eliminar un estado
  const eliminarEstado = (id) => {
    const estadosActualizados = estados.filter(estado => estado.id !== id);
    setEstados(estadosActualizados);
  };
  
  if (loading) {
    return <div className="estatus-ot-loading">Cargando estados de órdenes de trabajo...</div>;
  }
  
  return (
    <div className="estatus-ot-vista">
      <h2>formStatus_OT_vista</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="agregar-estado">
        <input 
          type="text" 
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Escriba el nombre del status de orden de trabajo aquí"
        />
        <button onClick={agregarEstado}>+ agregar status de OT</button>
      </div>
      
      <table className="estados-table">
        <thead>
          <tr>
            <th>id status OT</th>
            <th>status de la OT (orden de trabajo)</th>
            <th colSpan="2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estados.map(estado => (
            <tr key={estado.id}>
              <td>{estado.id}</td>
              <td>
                {editandoId === estado.id ? (
                  <input 
                    type="text" 
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                  />
                ) : (
                  estado.nombre
                )}
              </td>
              <td>
                {editandoId === estado.id ? (
                  <button className="editar" onClick={() => guardarEdicion(estado.id)}>
                    guardar
                  </button>
                ) : (
                  <button className="editar" onClick={() => iniciarEdicion(estado.id, estado.nombre)}>
                    editar
                  </button>
                )}
              </td>
              <td>
                <button className="eliminar" onClick={() => eliminarEstado(estado.id)}>
                  eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EstatusOT;