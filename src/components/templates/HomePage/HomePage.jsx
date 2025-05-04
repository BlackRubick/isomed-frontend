import React from 'react';
import Header from '../../organisms/Header/Header';
import Footer from '../../organisms/Footer/Footer';
import './HomePage.css';

const RelatedArticles = ({ articles }) => {
  return (
    <div className="related-articles">
      <h3>Artículos relacionados</h3>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HomePage = () => {
  const relatedArticles = [
    {
      title: 'ISO - International Organization for Standardization',
      url: 'https://www.iso.org'
    },
    {
      title: 'NOM-003-SSA3-2018',
      url: '#'
    },
    {
      title: 'Catálogo de agua que se requiere en un hospital',
      url: '#'
    },
    {
      title: '25 mejores Máquinas de hemodiálisis en 2024',
      url: '#'
    }
  ];
  
  const newsItems = [
    {
      title: 'Con servicio especializado de hemodiálisis se transforma calidad de vida de pacientes: Dr. Pepe Cruz',
      url: '#'
    },
    {
      title: 'https://www.fedialisis.com/noticias',
      url: 'https://www.fedialisis.com/noticias'
    }
  ];
  
  return (
    <div className="home-page">
      
      <main className="main-content">
        <section className="hero-section">
          <div className="container">
            <h1>INGENIERÍA EN SOLUCIONES MÉDICAS</h1>
            <p>Especialistas en sistemas de tratamiento de agua para hemodiálisis</p>
          </div>
        </section>

        <section className="welcome-section">
          <div className="container">
            <div className="welcome-content">
              <div className="welcome-text">
                <h2>Bienvenido a ISOMED - Ingeniería en soluciones médicas</h2>
                <p>
                  Diseñamos soluciones para equipos de tratamiento de agua y 
                  hemodiálisis para clínicas, hospitales y particulares que requieren 
                  un tratamiento confiable y de calidad para el buen funcionamiento de sus 
                  equipos de hemodiálisis. Contamos con los conocimientos necesarios 
                  para ser altamente competitivos y su opción Num di Uno en esta 
                  rama.
                </p>
                <p>
                  Nuestro equipo de personal atiende a todo el estado y circunvecinos 
                  confiable. Llámenos, estaremos encantados de atenderle.
                </p>
              </div>
              <div className="welcome-sidebar">
                <RelatedArticles articles={relatedArticles} />
              </div>
            </div>
          </div>
        </section>

        <section className="services-preview">
          <div className="container">
            <h2>Nuestros Servicios</h2>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </div>
                <h3>Mantenimiento de Equipos</h3>
                <p>Servicio especializado para equipos de hemodiálisis de diferentes marcas</p>
              </div>
              
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
                <h3>Refacciones y Partes</h3>
                <p>Conseguimos refacciones tanto nacionales como extranjeras</p>
              </div>
              
              <div className="service-card">
                <div className="service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h3>Insumos Médicos</h3>
                <p>Línea arterial venosa, filtros, hemofiltros, bicarbonatos y ácidos</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="nephrology-section">
          <div className="container">
            <div className="nephrology-content">
              <div className="nephrology-text">
                <h2>El tratamiento de agua para nefrología</h2>
                <p>
                  El tratamiento de agua para nefrología es un proceso crucial, 
                  especialmente para pacientes que requieren diálisis. Aquí 
                  explicamos los pasos principales de este proceso:
                </p>
                <p>
                  El tratamiento de agua para nefrología comienza con la 
                  captación de agua, seguida de una filtración inicial para 
                  eliminar sedimentos. Luego, se aplica un tratamiento específico 
                  para desinfectar y eliminar impurezas. A continuación, el agua 
                  pasa por un proceso de ósmosis inversa, que elimina 
                  contaminantes y sales. Después, se realiza una desinfección 
                  final, y el agua tratada se almacena en condiciones controladas. 
                  Finalmente, se realizan pruebas de calidad antes de su 
                  distribución a las máquinas de diálisis.
                </p>
                <p>
                  Este proceso es fundamental para garantizar la seguridad y 
                  eficacia del tratamiento en pacientes con enfermedades renales. 
                  Si tiene más preguntas o necesita más detalles, estaremos 
                  encantados de ayudarle!
                </p>
              </div>
              
              <div className="news-sidebar">
                <div className="news-section">
                  <h3>NOTICIAS AL DÍA</h3>
                  <ul className="news-list">
                    {newsItems.map((news, index) => (
                      <li key={index}>
                        <a href={news.url} target="_blank" rel="noopener noreferrer">
                          {news.title}
                        </a>
                      </li>
                    ))}
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
              Contáctanos por WhatsApp
            </a>
          </div>
        </section>
      </main>
      
    </div>
  );
};

export default HomePage;