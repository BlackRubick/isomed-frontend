import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './AdminUsuarios.css';

// URL de la API
const API_URL = 'http://34.232.185.39:8000';

// Token fijo para administrador (debe coincidir con el token configurado en el backend)
const ADMIN_FIXED_TOKEN = "admin_fixed_token_12345";

// Lista de clientes/empresas de la base de datos
const EMPRESAS_REALES = [
  { id: 1, nombre: 'HOSPITAL SAN LUCAS' },
  { id: 2, nombre: 'JORGE PASTRANA DE PEDRERO' },
  { id: 3, nombre: 'REMOLQUES DEL SURESTE S.A DE C.V.' },
  { id: 4, nombre: 'CENTRO MEDICO NEFROLOGO DE CHIAPAS' },
  { id: 5, nombre: 'CENTRO RADIOLOGICO DEL SURESTE' },
  { id: 6, nombre: 'BANCO DE ALIMENTOS DEL CENTRO DE CHIAPAS AC' },
  { id: 7, nombre: 'ROXANA SOLIS SOLIS' },
  { id: 8, nombre: 'JUAN CARLOS DE LEON BETANZOS' },
  { id: 9, nombre: 'ANA CHRISTINA ORANTES GOMEZ' },
  { id: 10, nombre: 'HORACIO MARTINEZ PUON' },
  { id: 11, nombre: 'CESAR EDUARDO NUCAMENDI GONZALEZ' },
  { id: 12, nombre: 'CONECTIA INTERNET A UN SOLO CLICK' },
  { id: 13, nombre: 'MEDICA DEL SURESTE' },
  { id: 14, nombre: 'HOSPITAL DE LAS CULTURAS DE CHIAPAS' },
  { id: 15, nombre: 'HOSPITAL BASICO COMUNITARIO DE CHAMULA' },
  { id: 16, nombre: 'PIXMA TRABAJOS DE SERIGRAFIA' },
  { id: 17, nombre: 'OVILLA Y ASOCIADOS FIRMA JURIDICA' }
];

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
  const [confirmDelete, setConfirmDelete] = useState(null);
  
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
        console.log("Iniciando carga de datos con token fijo de administrador");
        
        // Obtener usuarios con el token fijo de administrador
        const usuariosResponse = await fetch(`${API_URL}/api/admin-fixed/usuarios`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
          }
        });
        
        if (!usuariosResponse.ok) {
          throw new Error(`Error al cargar usuarios: ${usuariosResponse.status} ${usuariosResponse.statusText}`);
        }
        
        const usuariosData = await usuariosResponse.json();
        console.log("Usuarios cargados:", usuariosData);
        setUsuarios(usuariosData);
        
        // Cargar clientes de la API
        try {
          const clientesResponse = await fetch(`${API_URL}/api/clientes`, {
            headers: {
              'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
            }
          });
          
          if (clientesResponse.ok) {
            const clientesData = await clientesResponse.json();
            console.log("Clientes cargados desde API:", clientesData);
            setClientes(clientesData);
          } else {
            console.warn("Error al cargar clientes desde API, usando datos locales");
            // Usar las empresas reales definidas anteriormente
            setClientes(EMPRESAS_REALES);
          }
        } catch (clienteError) {
          console.warn("Error al cargar clientes:", clienteError);
          // Usar las empresas reales definidas anteriormente
          setClientes(EMPRESAS_REALES);
        }
        
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(error.message || 'Error al cargar datos');
        
        // Si hay error al cargar usuarios, al menos mostrar la lista de empresas
        setClientes(EMPRESAS_REALES);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);
  
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
    
    // Si el cambio es en el id_cliente, podemos generar un número de cliente predeterminado
    if (name === 'id_cliente' && value) {
      // Crear un número de cliente basado en el ID de la empresa
      // Por ejemplo: "C-001" para la empresa con ID 1
      const clienteId = parseInt(value);
      const numeroClienteFormateado = `C-${clienteId.toString().padStart(3, '0')}`;
      
      setFormData({
        ...formData,
        [name]: value,
        numero_cliente: numeroClienteFormateado
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Guardar cambios
  const handleSaveChanges = async (usuarioId) => {
    try {
      setError(null);
      
      // Validar que id_cliente sea un número válido o null
      const id_cliente = formData.id_cliente === '' ? null : parseInt(formData.id_cliente);
      
      console.log("Guardando cambios para usuario:", usuarioId);
      console.log("Datos a actualizar:", {
        id_cliente: id_cliente,
        numero_cliente: formData.numero_cliente
      });
      
      // Usar el token fijo para la actualización
      const response = await fetch(`${API_URL}/api/admin-fixed/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_cliente: id_cliente,
          numero_cliente: formData.numero_cliente
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al actualizar usuario: ${response.status}`);
      }
      
      const updatedUsuario = await response.json();
      console.log("Usuario actualizado:", updatedUsuario);
      
      // Actualizar lista de usuarios
      const updatedUsuarios = usuarios.map(usuario => {
        if (usuario.id === usuarioId) {
          return {
            ...usuario,
            id_cliente: updatedUsuario.id_cliente,
            numero_cliente: updatedUsuario.numero_cliente
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
  
  // Confirmar eliminación
  const handleDeleteClick = (usuarioId) => {
    setConfirmDelete(usuarioId);
  };
  
  // Cancelar eliminación
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  // Eliminar usuario
  const handleDeleteConfirm = async (usuarioId) => {
    try {
      setError(null);
      
      console.log("Eliminando usuario:", usuarioId);
      
      // Usar el token fijo para la eliminación
      const response = await fetch(`${API_URL}/api/admin-fixed/usuarios/${usuarioId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_FIXED_TOKEN}`
        }
      });
      
      if (!response.ok && response.status !== 204) { // 204 No Content es un estado válido para DELETE
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al eliminar usuario: ${response.status}`);
      }
      
      console.log("Usuario eliminado correctamente");
      
      // Actualizar lista de usuarios
      const updatedUsuarios = usuarios.filter(usuario => usuario.id !== usuarioId);
      setUsuarios(updatedUsuarios);
      setConfirmDelete(null);
      setSuccessMessage('Usuario eliminado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setError(error.message || 'Error al eliminar usuario');
      setConfirmDelete(null);
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
      <p>Asigna clientes a los usuarios registrados en el sistema o elimina usuarios.</p>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="fixed-token-info">
        <span className="badge">Acceso Admin</span>
        <p>Usando acceso administrador con token seguro</p>
      </div>
      
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
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No hay usuarios disponibles</td>
              </tr>
            ) : (
              usuarios.map(usuario => (
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
                        placeholder="Número de cliente"
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
                    ) : confirmDelete === usuario.id ? (
                      <div className="action-buttons">
                        <button 
                          className="delete-confirm-button"
                          onClick={() => handleDeleteConfirm(usuario.id)}
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
                          onClick={() => handleEditClick(usuario)}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteClick(usuario.id)}
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

export default AdminUsuarios;