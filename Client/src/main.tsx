import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext"; // ✅ Make sure this path is correct

const root = createRoot(document.getElementById("root")!);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
