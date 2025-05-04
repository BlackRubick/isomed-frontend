import React from "react";
import "./InfoBlock.css";

const InfoBlock = ({ title, content, ...props }) => {
  return (
    <div className="info-block" {...props}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

export default InfoBlock;
