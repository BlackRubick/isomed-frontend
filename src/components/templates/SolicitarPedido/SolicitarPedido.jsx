// src/components/templates/SolicitarPedido/SolicitarPedido.jsx
import React, { useState } from 'react';
import './SolicitarPedido.css';

const SolicitarPedido = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    producto: '',
    cantidad: '',
    comentarios: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del pedido:', formData);
    
    // Aquí normalmente enviarías los datos a tu API
    // Pero para este ejemplo, solo simulamos un envío exitoso
    setTimeout(() => {
      setSubmitted(true);
    }, 1500);
  };
  
  return (
    <div className="solicitar-pedido-page">
      <div className="container">
        <h1>Solicitar Pedido</h1>
        <p>Complete el formulario a continuación para solicitar su pedido</p>
        
        {submitted ? (
          <div className="success-message">
            <div className="icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>¡Pedido enviado con éxito!</h2>
            <p>Gracias por su solicitud. Nos pondremos en contacto con usted lo antes posible.</p>
            <button className="btn-primary" onClick={() => setSubmitted(false)}>Hacer otro pedido</button>
          </div>
        ) : (
          <div className="pedido-form-container">
            <form className="pedido-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Información de Contacto</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="direccion">Dirección de Entrega</label>
                  <textarea
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Detalles del Pedido</h3>
                <div className="form-group">
                  <label htmlFor="producto">Producto</label>
                  <select
                    id="producto"
                    name="producto"
                    value={formData.producto}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un producto</option>
                    <option value="sistema-osmosis">Sistema Portátil de Ósmosis Inversa</option>
                    <option value="sistema-industrial">Sistema Industrial de Tratamiento de Agua</option>
                    <option value="filtros">Filtros y Repuestos</option>
                    <option value="insumos">Insumos Médicos</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cantidad">Cantidad</label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="comentarios">Comentarios Adicionales</label>
                  <textarea
                    id="comentarios"
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleChange}
                    rows="4"
                  ></textarea>
                </div>
              </div>
              
              <button type="submit" className="btn-submit">Enviar Pedido</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitarPedido;