import { Button, Popconfirm, Space, Upload } from "antd";
import { CascaderComponentStyle, buttonStyles } from "../../styles";
import { cleanPromptAtom, downloadAtom } from "../../atoms/shaderAtoms";

import CascaderGeometrySelector from "./CascaderGeometrySelector";
import React from "react";
import { useAtomValue } from "jotai";

function ButtonComponent(props) {
  const downloadLink = useAtomValue(downloadAtom);
  let prompt = useAtomValue(cleanPromptAtom);
  const downloadFileName = `${prompt}.png`;
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
        Toggle UI
      </Button>
      <Button
        type="primary"
        href={downloadLink}
        download={downloadFileName}
        target={"_blank"}
        style={buttonStyles}
      >
        {downloadLink === "" ? "Click canvas to capture" : "Screenshot"}
      </Button>
      {/* <Button type="primary" style={buttonStyles} onClick={props.reseter(Math.random())}>
        Reset scene
      </Button> */}
    </Space>
  );
}

export default ButtonComponent;
