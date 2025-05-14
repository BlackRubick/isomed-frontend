// src/routes.jsx
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Productos from "./pages/Productos";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PedidosAdmin from "./pages/PedidosAdmin"; 
import SolicitarPedido from "./pages/SolicitarPedido"; 
import AdminUsuarios from "./pages/AdminUsuarios"; 
import AdminProductos from "./pages/AdminProductos"; 
import OrdenesTrabajoUsuario from "./pages/OrdenesTrabajoUsuario"; 
import ListaTiposUsuario from "./pages/ListaTiposUsuario"; 
import { AppContext } from "./context/AppContext";

// Componente para rutas protegidas
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin } = useContext(AppContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/pedidos-admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <PedidosAdmin />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta para la administración de usuarios */}
      <Route 
        path="/admin/usuarios" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsuarios />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta para tipos de usuario */}
      <Route 
        path="/admin/tipos-usuario" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ListaTiposUsuario />
          </ProtectedRoute>
        } 
      />
      
      {/* Nueva ruta para la administración de productos */}
      <Route 
        path="/admin/productos" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminProductos />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/solicitar-pedido" 
        element={
          <ProtectedRoute>
            <SolicitarPedido />
          </ProtectedRoute>
        } 
      />
      
      {/* Nueva ruta para órdenes de trabajo de usuarios */}
      <Route 
        path="/ordenes-trabajo" 
        element={
          <ProtectedRoute>
            <OrdenesTrabajoUsuario />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;