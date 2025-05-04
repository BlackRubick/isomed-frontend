import React from 'react';
import './Card.css';

const Card = ({ icon, title, children }) => {
  return (
    <div className="card">
      {icon && (
        <div className="card-icon">
          <i className={icon}></i>
        </div>
      )}
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
