import React from "react";
import { createRoot } from "react-dom/client";  // Import createRoot
import App from "./App";
import { TransactionProvider } from "./context/TransactionContext";
import "./index.css";

const root = createRoot(document.getElementById("root")); // Use createRoot

root.render(
  <TransactionProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </TransactionProvider>
);
