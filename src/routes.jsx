import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Productos from "./pages/Productos";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Register from "./pages/Register";
//import Profile from "./pages/Profile";
//import ProtectedRoute from "./components/auth/ProtectedRoute";
//import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>

    </Routes>
      
      /* Rutas de autenticación 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      Rutas protegidas 
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta para páginas no encontradas 
      <Route path="*" element={<NotFound />} />*/
    
  );
};

export default AppRoutes;