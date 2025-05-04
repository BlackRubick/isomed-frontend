import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import Header from "./components/organisms/Header/Header";
import Footer from "./components/organisms/Footer/Footer";
import { AppProvider } from "./context/AppContext";
import "./styles/global.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
