import { Button, Checkbox, Divider, Input, Select, Space } from "antd";
import {
  enableLevaAtom,
  geometryAtom,
  pivotAxesAtom,
  statsAtom,
  text3dAtom,
} from "../atoms/shaderAtoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import CascaderGeometrySelector from "./UI/CascaderGeometrySelector";
import React from "react";
import { authenticateOpenaiAPI } from "../utils/BetaOpenaiAPI";

const SettingContent = () => {
  const [text, setText] = useAtom(text3dAtom);
  const [textInput, setTextInput] = useState(text);
  const [pivotAxes, setPivotAxes] = useAtom(pivotAxesAtom);
  const [statsOn, setStatsOn] = useAtom(statsAtom);
  const setEnableLeva = useSetAtom(enableLevaAtom);
  const geometry = useAtomValue(geometryAtom);
  const [apiBoxContent, setApiBoxContent] = useState("");
  const [modelX, setModelX] = useState("gpt-3.5-turbo");
  const [apiErrorMsg, setApiErrorMsg] = useState("");
  const [apiIsValid, setApiIsValid] = useState(null);

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
      <Checkbox checked={statsOn} onChange={() => setStatsOn(!statsOn)}>
        <div className="option-item">Toggle Stats</div>
      </Checkbox>
      <Checkbox checked={pivotAxes} onChange={() => setPivotAxes(!pivotAxes)}>
        <div className="option-item">Toggle pivot controller and axes</div>
      </Checkbox>
      <Divider style={{ backgroundColor: "#331", margin: "0px" }} />
      <Space split={":"}>
        <div>
          <p>Choose geometry</p>
        </div>
        <CascaderGeometrySelector />
      </Space>
      <Divider style={{ backgroundColor: "#331", margin: "0px" }} />

      {geometry === "Text3DGeometry" ? (
        <Space.Compact size="small" style={{ display: "block" }}>
          <div className="hyphenate">Text for text geometries</div>
          <Space direction="horizontal" size="none">
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
            <Button
              style={{ borderRadius: "0px", margin: "0px" }}
              type="primary"
              onClick={setText(textInput)}
            >
              Confirm
            </Button>
          </Space>
        </Space.Compact>
      ) : (
        <></>
      )}

      <Divider style={{ backgroundColor: "#331", margin: "0px" }} />
      {/* <div>History</div> */}

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
            className="select"
            rootClassName="root-select"
            popupClassName="popup-select"
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
              authenticateOpenaiAPI()
                .then((availableModels) => {
                  console.log("Available models:", availableModels);
                  setApiErrorMsg("API is correct.");
                  setApiIsValid(true);
                })
                .catch((error) => {
                  const msg = error.message;
                  console.log(msg);
                  setApiErrorMsg(msg);
                  setApiIsValid(false);
                });
            }}
          >
            Confirm
          </Button>
          {localStorage.getItem("api-key") !== null &&
          localStorage.getItem("model") !== null ? (
            <div style={{ maxWidth: "240px", overflowWrap: "break-word" }}>
              {/* <span>API set!</span> */}
              <span>Current key: {localStorage.getItem("api-key")}</span>
              <br></br>
              <span>Current model: {localStorage.getItem("model")}</span>
            </div>
          ) : (
            <></>
          )}
          <span>
            {apiIsValid === null ? (
              <></>
            ) : apiIsValid ? (
              "Your API key is valid"
            ) : (
              "Invalid API key. Please check and try again."
            )}
          </span>
          <br />
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
