import { Button, Popconfirm, Space, Upload } from "antd";
import { CascaderComponentStyle, buttonStyles } from "../../styles";
import { downloadAtom, loadingAtom } from "../../atoms/shaderAtoms";

import CascaderGeometrySelector from "./CascaderGeometrySelector";
import React from "react";
import { useAtomValue } from "jotai";

function ButtonComponent(props) {
  const downloadLink = useAtomValue(downloadAtom);
  return (
    <Space style={{ display: "flex" }}>
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
      <Button type="primary" style={buttonStyles}>
        <a href={downloadLink} download="shader.png" target="_blank">
          {downloadLink === "" ? "Capture" : "Download"}
        </a>
      </Button>
      {/* <Button type="primary" style={buttonStyles} onClick={props.reseter(Math.random())}>
        Reset scene
      </Button> */}
      {/* <CascaderGeometrySelector /> */}
    </Space>
  );
}

export default ButtonComponent;
