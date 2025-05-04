import React from "react";
import Contact from "../../organisms/Contact/Contact";
import "./ContactoPage.css";

const ContactoPage = () => {
  return (
    <div className="contacto-template">
      <div className="container">
        <Contact />
        <div className="location">
          <h2>Nuestra Ubicación</h2>
          <div className="map">
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactoPage;
