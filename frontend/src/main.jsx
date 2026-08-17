import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import App from "./App";
import { SiteProvider } from "./context/SiteContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { EnrollmentProvider } from "./components/ui/EnrollmentModal";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SiteProvider>
          <ToastProvider>
            <AuthProvider>
              <EnrollmentProvider>
                <App />
              </EnrollmentProvider>
            </AuthProvider>
          </ToastProvider>
        </SiteProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
