import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Navbar from "./components/navbar/Navbar";
import FooterWithSocialLinks from "./components/footer/Footer";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <App />
      <FooterWithSocialLinks />
    </BrowserRouter>
  </React.StrictMode>
);
