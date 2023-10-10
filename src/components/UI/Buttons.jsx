import React from "react";
import { Button, Popconfirm, Space, Upload } from "antd";
import { loadingAtom, downloadAtom } from "../../App";
import { useAtom } from "jotai";
import { CascaderComponentStyle, buttonStyles } from "../../styles";
import CascaderGeometrySelector from "./CascaderGeometrySelector";

function UIComponents(props) {
    const [loading, setLoading] = useAtom(loadingAtom);
    const [downloadLink, setDL] = useAtom(downloadAtom);
    return (
        <Space style={{ display: 'flex' }}>
            <Button
                type="primary"
                onClick={props.toggleInputVisibility}
                style={{
                    ...buttonStyles,
                    backgroundColor: "#ef12ef",
                    // background: "rgba(200, 0, 0, 1)",
                }}
            >
                ToggleUI
            </Button>
            {/* <Button
                loading={loading}
                type="primary"
                onClick={() => {
                    if (!loading) {
                        setLoading(true);
                    }
                    props
                        .generateShader()
                        .then((streamed) => props.validator(streamed));
                }}
                style={buttonStyles}
            >
                Generate!
            </Button> */}
            <Button type="primary" style={buttonStyles}>
                <a href={downloadLink} download="shader.png" target="_blank">
                    {downloadLink === ""
                        ? "Click anywhere to Capture"
                        : "Download"}
                </a>
            </Button>
            <CascaderGeometrySelector />
        </Space>
    );
}

export default UIComponents;
