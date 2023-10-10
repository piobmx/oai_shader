import React from "react";
import { Button, Popconfirm, Space, Upload } from "antd";
import { loadingAtom, promptAtom, fragAtom } from "../../App";
import { useAtom } from "jotai";
import CascaderGeometrySelector from "./CascaderGeometrySelector";
import { buttonStyles } from "../../styles";

function UIComponents(props) {
    const [loading, setLoading] = useAtom(loadingAtom);
    return (
        <Space>
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
            <Button
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
            </Button>
        </Space>
    );
}

export default UIComponents;
