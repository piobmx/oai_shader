import "./index.css";

import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { Stats } from "@react-three/drei";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={{ hashed: false }}>
      <App />
      {/* <Stats /> */}
    </ConfigProvider>
    <Analytics />
  </React.StrictMode>
);
