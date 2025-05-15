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
import ListaFiguraFiscal from "./pages/ListaFiguraFiscal"; 
import ListaClientes from "./pages/ListaClientes";
import ListaProveedores from "./pages/ListaProveedores";
import ListaProductos from "./pages/ListaProductos";
import TodasOrdenes from "./pages/TodasOrdenes"; 
import GenerarOrden from "./pages/GenerarOrden"; 
import EstatusOT from "./pages/EstatusOT"; 
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
      
      {/* Ruta para figura fiscal */}
      <Route 
        path="/admin/figura-fiscal" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ListaFiguraFiscal />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas para clientes */}
      <Route 
        path="/admin/lista-clientes" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ListaClientes />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas para proveedores */}
      <Route 
        path="/admin/lista-proveedores" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ListaProveedores />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas para productos */}
      <Route 
        path="/admin/lista-productos" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ListaProductos />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas para órdenes de trabajo */}
      <Route 
        path="/admin/todas-ordenes" 
        element={
          <ProtectedRoute requiredRole="admin">
            <TodasOrdenes />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/generar-orden" 
        element={
          <ProtectedRoute requiredRole="admin">
            <GenerarOrden />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/estatus-ot" 
        element={
          <ProtectedRoute requiredRole="admin">
            <EstatusOT />
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