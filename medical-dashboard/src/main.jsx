import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Import App from the correct file
import "./index.css"; // Import global CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
