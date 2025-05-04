import React from "react";
import Button from "../../atoms/Button/Button";
import "./Contact.css";

const Contact = () => {
  return (
    <section className="contact">
      <div className="container">
        <h2>Contacto</h2>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensaje</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <Button type="submit">Enviar</Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
