// Entry point for the build script in your package.json
import "./controllers";
import * as bootstrap from "bootstrap";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./src/components/App";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
