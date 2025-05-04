import React from "react";
import Historia from "../../organisms/Historia/Historia";
import "./NosotrosPage.css";

const NosotrosPage = () => {
  return (
    <div className="nosotros-template">
      <div className="container">
        <Historia />
        <section className="team">
          <div className="team-grid">
          </div>
        </section>
      </div>
    </div>
  );
};

export default NosotrosPage;
