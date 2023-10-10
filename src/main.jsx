import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import { Analytics } from "@vercel/analytics/react";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ConfigProvider theme={{ hashed: false }}>
            <App />
        </ConfigProvider>
        <Analytics />
    </React.StrictMode>
);
