import { Button, Checkbox, Divider, Input, Select, Space } from "antd";
import { cameraAtom, geometryAtom, text3dAtom } from "../App";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import CascaderGeometrySelector from "./UI/CascaderGeometrySelector";
import React from "react";

const SettingContent = () => {
  const [text, setText] = useAtom(text3dAtom);
  const [textInput, setTextInput] = useState(text);
  const [cameraOn, setCameraOn] = useAtom(cameraAtom);
  const geometry = useAtomValue(geometryAtom);
  const [apiBoxContent, setApiBoxContent] = useState("");
  const [modelX, setModelX] = useState("gpt-3.5-turbo");

  const [currentAPI, setCurrentAPI] = useState({
    apiKey: localStorage.getItem("api-key"),
    model: localStorage.getItem("model"),
  });
  useEffect(() => {
    setCurrentAPI({
      apiKey: localStorage.getItem("api-key"),
      model: localStorage.getItem("model"),
    });
  }, [localStorage.getItem("api-key"), localStorage.getItem("model")]);

  return (
    <Space
      direction="vertical"
      size="small"
      style={{ display: "block", color: "black" }}
    >
      <Checkbox onChange={() => setCameraOn(!cameraOn)}>
        <div className="option-item">Show camera controleler</div>
      </Checkbox>
      <Space split={":"}>
        <div>
          <p>Choose geometry</p>
        </div>
        <CascaderGeometrySelector />
      </Space>

      {geometry === "Text3DGeometry" ? (
        <Space.Compact size="small" style={{ display: "block" }}>
          <div className="hyphenate">Text for text geometries</div>
          <Space direction="horizontal" size="small">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{
                borderRadius: "0px",
                background: "#3344cc",
                color: "#eee",
                border: "none",
              }}
            ></Input>
            <Button type="primary" onClick={setText(textInput)}>
              Confirm
            </Button>
          </Space>
        </Space.Compact>
      ) : (
        <></>
      )}

      <Divider style={{ margin: "0px" }} />
      {/* <div>History</div> */}
      <Divider style={{ margin: "0px" }} />

      <Space wrap>
        <div>
          Use your own OpenAI API key:
          <Input
            placeholder="sk-"
            onChange={(e) => setApiBoxContent(e.target.value)}
            style={{
              borderRadius: "0px",
              background: "#eee",
              color: "#123",
              border: "none",
            }}
            onPressEnter={(e) => {
              setCurrentAPI({
                ...currentAPI,
                apiKey: e.target.value,
              });
              localStorage.setItem("api-key", apiBoxContent);
            }}
          ></Input>
          <Select
            defaultValue="gpt-3.5-turbo"
            style={{
              width: 150,
            }}
            onChange={(modelValue) => {
              setCurrentAPI({
                ...currentAPI,
                model: modelValue,
              });
              setModelX(modelValue);
              localStorage.setItem("model", modelValue);
            }}
            options={[
              {
                value: "gpt-3.5-turbo",
                label: "gpt-3.5-turbo",
              },
              {
                value: "gpt-4",
                label: "gpt-4",
              },
            ]}
          />
          <Button
            type="primary"
            style={{ borderRadius: "0px", margin: "0px" }}
            onClick={() => {
              setCurrentAPI({
                ...currentAPI,
                model: modelX,
              });
              localStorage.setItem("api-key", apiBoxContent);
              localStorage.setItem("model", modelX);
            }}
          >
            Confirm
          </Button>
          {localStorage.getItem("api-key") !== null &&
          localStorage.getItem("model") !== null ? (
            <div style={{ maxWidth: "240px", overflowWrap: "break-word" }}>
              <span>API set!</span>
              <br></br>
              <span>Current key: {localStorage.getItem("api-key")}</span>
              <br></br>
              <span>Current model: {localStorage.getItem("model")}</span>
            </div>
          ) : (
            <></>
          )}
          <b>
            <span style={{ fontSize: "0.8rem", color: "#993333" }}>
              This website is open-source. Your API key is never stored and is
              used only locally on your device.
            </span>
          </b>
        </div>
      </Space>
    </Space>
  );
};

export default SettingContent;
