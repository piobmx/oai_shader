import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { inject } from "@vercel/analytics";
import { ConfigProvider } from "antd";

import "./index.css";

inject();
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ConfigProvider theme={{ hashed: false }}>
            <App />
        </ConfigProvider>
    </React.StrictMode>
);
