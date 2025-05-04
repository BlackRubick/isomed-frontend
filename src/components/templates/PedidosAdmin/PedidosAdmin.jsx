// src/components/templates/PedidosAdmin/PedidosAdmin.jsx
import React, { useState, useEffect } from 'react';
import './PedidosAdmin.css';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  
  // Simulamos obtener pedidos (en una app real, esto vendría de una API)
  useEffect(() => {
    // Pedidos de ejemplo
    const pedidosEjemplo = [
      { id: 1, cliente: 'Juan Pérez', fecha: '2025-05-01', estado: 'Pendiente', total: 1500 },
      { id: 2, cliente: 'Maria González', fecha: '2025-05-02', estado: 'Completado', total: 2300 },
      { id: 3, cliente: 'Carlos Rodríguez', fecha: '2025-05-03', estado: 'En proceso', total: 1800 },
    ];
    
    setPedidos(pedidosEjemplo);
  }, []);
  
  return (
    <div className="pedidos-admin-page">
      <div className="container">
        <h1>Panel de Administración de Pedidos</h1>
        <p>Gestiona todos los pedidos de los clientes</p>
        
        <div className="pedidos-table-container">
          <table className="pedidos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>{pedido.fecha}</td>
                  <td>
                    <span className={`estado-badge ${pedido.estado.toLowerCase().replace(' ', '-')}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td>${pedido.total}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-view">Ver</button>
                      <button className="btn-edit">Editar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PedidosAdmin;