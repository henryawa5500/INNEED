import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { JobsProvider } from "./context/JobsContext";
import { WorkersProvider } from "./context/WorkersContext";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <WorkersProvider>
        <JobsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </JobsProvider>
      </WorkersProvider>
    </AuthProvider>
  </React.StrictMode>
);
