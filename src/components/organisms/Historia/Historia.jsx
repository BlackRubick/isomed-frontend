import React from 'react';
import './Historia.css';

const Historia = () => {
  return (
    <section className="historia-section">
      <div className="container">
        <div className="historia-content">
          <div className="historia-text">
            <h2>Nuestra Historia</h2>
            <p>
              Estamos constituidos desde 2014 en el estado de Chiapas, trabajando para clientes del sector público y privado. Hemos instalado muchos sistemas de tratamientos de agua para hemodiálisis en clínicas y hospitales en Chiapas y Tabasco. También hemos reacondicionado sistemas completos donde ha sido necesario.
            </p>
            <p>
              Realizamos mantenimiento a equipos de hemodiálisis de diferentes marcas. Conseguimos refacciones y partes tanto nacionales como extranjeras. También vendemos insumos tales como línea arterial venosa, filtros, hemofiltros, bicarbonatos y ácidos.
            </p>
            <p>
              Estamos debidamente registrados ante el SAT. En ISOMED nos gusta lo que hacemos y estaremos contentos de hacer negocios con usted.
            </p>
            <div className="director-info">
              <p className="director-name">Ing. David Nucamendi Nuriculu</p>
              <p className="director-title">DIRECTOR</p>
            </div>
          </div>
          <div className="historia-image">
            <img src="src/assets/images/dialisis.jpg" alt="Equipo de hemodiálisis" />
            <div className="image-caption">
              <span>ISOMED - Servicio, calidad y profesionalismo en el sector médico</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Historia;