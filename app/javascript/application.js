// Entry point for the build script in your package.json
import "@hotwired/turbo-rails";
import "./controllers";
import * as bootstrap from "bootstrap";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./src/components/App";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);

// const dotenv = require("dotenv");
// dotenv.config();
