import React from "react";
import "./Heading.css";

const Heading = ({ level = 1, children, ...props }) => {
  const Tag = `h${level}`;
  return <Tag className="heading" {...props}>{children}</Tag>;
};

export default Heading;
