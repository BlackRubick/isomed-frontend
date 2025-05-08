// src/components/templates/AdminUsuarios/AdminUsuarios.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './AdminUsuarios.css';

const API_URL = 'http://34.232.185.39:8000';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    id_cliente: '',
    numero_cliente: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  
  const { isAuthenticated, isAdmin, user } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Verificar si el usuario es admin y está autenticado
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Cargar usuarios y clientes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Obtener token para autenticación
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No hay token de autenticación');
        }
        
        // Cargar usuarios
        const usuariosResponse = await fetch(`${API_URL}/api/admin/usuarios`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!usuariosResponse.ok) {
          throw new Error('Error al cargar usuarios');
        }
        
        const usuariosData = await usuariosResponse.json();
        setUsuarios(usuariosData);
        
        // Cargar clientes
        const clientesResponse = await fetch(`${API_URL}/api/clientes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!clientesResponse.ok) {
          throw new Error('Error al cargar clientes');
        }
        
        const clientesData = await clientesResponse.json();
        setClientes(clientesData);
        
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(error.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);
  
  // Si no hay API implementada, usar datos de prueba
  useEffect(() => {
    // Simular datos si la API no está disponible
    if (loading && !error) {
      // Datos de prueba para usuarios
      const mockUsuarios = [
        { id: 1, nombre_completo: 'Juan Pérez', email: 'juan@example.com', numero_cliente: '001', id_cliente: null },
        { id: 2, nombre_completo: 'María García', email: 'maria@example.com', numero_cliente: '002', id_cliente: 1 },
        { id: 3, nombre_completo: 'Carlos López', email: 'carlos@example.com', numero_cliente: '', id_cliente: null },
      ];
      
      // Datos de prueba para clientes
      const mockClientes = [
        { id: 1, nombre: 'Empresa A' },
        { id: 2, nombre: 'Empresa B' },
        { id: 3, nombre: 'Empresa C' },
      ];
      
      setUsuarios(mockUsuarios);
      setClientes(mockClientes);
      setLoading(false);
    }
  }, [loading, error]);
  
  // Manejar click para editar
  const handleEditClick = (usuario) => {
    setEditingUserId(usuario.id);
    setFormData({
      id_cliente: usuario.id_cliente || '',
      numero_cliente: usuario.numero_cliente || ''
    });
  };
  
  // Manejar cambio en formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Guardar cambios
  const handleSaveChanges = async (usuarioId) => {
    try {
      setError(null);
      
      // Validar que id_cliente sea un número válido o null
      const id_cliente = formData.id_cliente === '' ? null : parseInt(formData.id_cliente);
      
      // Obtener token para autenticación
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      // Enviar datos actualizados a la API
      const response = await fetch(`${API_URL}/api/admin/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_cliente: id_cliente,
          numero_cliente: formData.numero_cliente
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }
      
      // Simulación de actualización local (para desarrollo)
      const updatedUsuarios = usuarios.map(usuario => {
        if (usuario.id === usuarioId) {
          return {
            ...usuario,
            id_cliente: id_cliente,
            numero_cliente: formData.numero_cliente
          };
        }
        return usuario;
      });
      
      setUsuarios(updatedUsuarios);
      setEditingUserId(null);
      setSuccessMessage('Usuario actualizado correctamente');
      
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
  const handleCancelEdit = () => {
    setEditingUserId(null);
  };
  
  // Obtener nombre de cliente por ID
  const getClienteName = (clienteId) => {
    if (!clienteId) return 'No asignado';
    
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Cliente desconocido';
  };
  
  if (loading) {
    return <div className="admin-usuarios-container loading">Cargando usuarios...</div>;
  }
  
  return (
    <div className="admin-usuarios-container">
      <h2>Administración de Usuarios</h2>
      <p>Asigna clientes a los usuarios registrados en el sistema.</p>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Número de Cliente</th>
              <th>Cliente/Empresa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre_completo}</td>
                <td>{usuario.email}</td>
                <td>
                  {editingUserId === usuario.id ? (
                    <input
                      type="text"
                      name="numero_cliente"
                      value={formData.numero_cliente}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    usuario.numero_cliente || '-'
                  )}
                </td>
                <td>
                  {editingUserId === usuario.id ? (
                    <select
                      name="id_cliente"
                      value={formData.id_cliente}
                      onChange={handleInputChange}
                      className="edit-select"
                    >
                      <option value="">Sin cliente</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    getClienteName(usuario.id_cliente)
                  )}
                </td>
                <td>
                  {editingUserId === usuario.id ? (
                    <div className="action-buttons">
                      <button 
                        className="save-button"
                        onClick={() => handleSaveChanges(usuario.id)}
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
                  ) : (
                    <button 
                      className="edit-button"
                      onClick={() => handleEditClick(usuario)}
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsuarios;