// src/pages/OrdenesTrabajoUsuario.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './OrdenesTrabajoUsuario.css';

const OrdenesTrabajoUsuario = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AppContext);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        setLoading(true);
        // Asumiendo que tienes un endpoint para obtener órdenes por cliente
        // y que tienes el ID del cliente en el objeto user
        const response = await fetch(`/api/ordenes/cliente/${user.id_cliente}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las órdenes de trabajo');
        }

        const data = await response.json();
        setOrdenes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (user && user.id_cliente) {
      fetchOrdenes();
    } else {
      setLoading(false);
      setError('No se encontró información del cliente asociado a su cuenta');
    }
  }, [user, token]);

  if (loading) {
    return <div className="loading">Cargando órdenes de trabajo...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="ordenes-trabajo-container">
      <h1>Mis Órdenes de Trabajo</h1>
      
      {ordenes.length === 0 ? (
        <p>No tiene órdenes de trabajo registradas.</p>
      ) : (
        <div className="ordenes-lista">
          {ordenes.map(orden => (
            <div key={orden.id} className="orden-card">
              <div className="orden-header">
                <h3>Orden #{orden.id}</h3>
                <span className={`estado ${orden.status}`}>{orden.status}</span>
              </div>
              <div className="orden-details">
                <p><strong>Fecha:</strong> {new Date(orden.fecha_mov).toLocaleDateString()}</p>
                <p><strong>Producto:</strong> {orden.id_producto}</p>
                <p><strong>Estado:</strong> {orden.status}</p>
              </div>
              <div className="orden-products">
                <h4>Productos:</h4>
                <ul>
                  {orden.lineas_producto.map((linea, index) => (
                    <li key={index}>
                      {linea.id_producto} x {linea.cantidad} - ${linea.precio_unitario * linea.cantidad}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="orden-total">
                <strong>Total:</strong> $
                {orden.lineas_producto.reduce(
                  (total, linea) => total + linea.precio_unitario * linea.cantidad, 
                  0
                ).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdenesTrabajoUsuario;