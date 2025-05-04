import React from 'react';
import Header from '../../organisms/Header/Header';
import Footer from '../../organisms/Footer/Footer';
import './ServiciosPage.css';

const ServiciosPage = () => {
  return (
    <div className="servicios-page">
      
      <main className="main-content">
        <section className="hero-section">
          <div className="container">
            <h1>Nuestros Servicios</h1>
            <p>Soluciones especializadas para el sector médico</p>
          </div>
        </section>
        
        <section className="servicios-section">
          <div className="container">
            <div className="servicios-content">
              <div className="servicios-list">
                <div className="servicio-item">
                  <div className="servicio-image">
                    <img src="/assets/images/tratamiento2.jpeg" alt="Tratamiento de Agua" />
                  </div>
                  <div className="servicio-details">
                    <h2>Diseño de Tratamientos de Agua</h2>
                    <p>Especializada por Osmosis Inversa para Hemodiálisis Centrales y Portátiles.</p>
                  </div>
                </div>
                
                <div className="servicio-item">
                  <div className="servicio-image">
                    <img src="/assets/images/venta.jpeg" alt="Plantas de Tratamiento" />
                  </div>
                  <div className="servicio-details">
                    <h2>Venta de Plantas de Tratamiento de agua</h2>
                    <p>Para Hemodiálisis con Estructura de Acero Inoxidable Centrales y Portátiles.</p>
                  </div>
                </div>
                
                <div className="servicio-item">
                  <div className="servicio-image">
                    <img src="/assets/images/mantenimiento.jpeg" alt="Mantenimiento de Equipos" />
                  </div>
                  <div className="servicio-details">
                    <h2>Mantenimiento de Equipos</h2>
                    <p>Servicio especializado para equipos de hemodiálisis de diferentes marcas.</p>
                  </div>
                </div>
                
                <div className="servicio-item">
                  <div className="servicio-image">
                    <img src="/assets/images/insumos.jpeg" alt="Insumos Médicos" />
                  </div>
                  <div className="servicio-details">
                    <h2>Insumos Médicos</h2>
                    <p>Venta de línea arterial venosa, filtros, hemofiltros, bicarbonatos y ácidos.</p>
                  </div>
                </div>
              </div>
              
              <div className="servicios-sidebar">
                <div className="contact-card">
                  <h3>¿Desea que le atendamos?</h3>
                  <p>Déjenos en mensaje en <a href="mailto:jdnucamendi@isomed.com.mx">jdnucamendi@isomed.com.mx</a></p>
                  <p>Con gusto le contactaremos.</p>
                  <div className="contact-info">
                    <p>Ing. David Nucamendi Nuriculu</p>
                    <p>Móvil: <a href="tel:+529611313493">961 131 3493</a></p>
                  </div>
                </div>
                
                <div className="related-articles">
                  <h3>Artículos relacionados</h3>
                  <ul>
                    <li>
                      <a href="https://www.iso.org" target="_blank" rel="noopener noreferrer">
                        ISO - International Organization for Standardization
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        NOM-003-SSA3-2018
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Catálogo de agua por se requiere en un hospital
                      </a>
                    </li>
                    <li>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        25 mejores Máquinas de hemodiálisis en 2024
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="cta-section">
          <div className="container">
            <h2>¿Necesitas nuestros servicios?</h2>
            <p>Estamos listos para ayudarte con tus necesidades de equipos médicos</p>
            <a 
              href="https://wa.me/529611313493?text=Hola%20ISOMED%2C%20estoy%20interesado%20en%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-secondary whatsapp-btn"
            >
              <i className="icon-whatsapp"></i> Contáctanos por WhatsApp
            </a>
          </div>
        </section>
      </main>
      
    </div>
  );
};

export default ServiciosPage;