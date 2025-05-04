import React from "react";
import "./Paragraph.css";

const Paragraph = ({ children, ...props }) => {
  return <p className="paragraph" {...props}>{children}</p>;
};

export default Paragraph;
