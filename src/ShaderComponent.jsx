import React, { useState } from "react";
import { Button, Input } from "antd";
import { useAtom } from "jotai";
import { promptAtom, fragAtom } from "./App";

const { TextArea } = Input;
const apiUrl = "http://127.0.0.1:3000/v1/api";

function ShaderComponent() {
  const [fragCode, setFragCode] = useAtom(fragAtom);
  const [prompt, setPrompt] = useAtom(promptAtom);
  const [result, setResult] = useState("");
  const [inputVisible, setInputVisible] = useState(true);

  const postPrompt = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const content = data["ai"];
      //   content = JSON.stringify(data["ai"], null, 2).replace(/\n/g, "");
      //   content = content.replace("```", "");
      //   content = content.replace("glsl", "");
      console.log(data);

      setResult(content);
      setFragCode(content);
    } catch (error) {
      console.error("Error:", error);
    }
  };

    const processResult = (result) => {

    }

  return (
    <div
      style={{
        position: "absolute",
        zIndex: "10",
        width: "50%",
        left: "4rem",
        top: "4rem",
        whiteSpace: "pre-line",
        fontFamily: "monospace",
      }}
    >
      {/* Textarea for entering the fragment shader code */}
      <Button
        onClick={() => {
          setInputVisible(!inputVisible);
        }}
      >
        Toggle Box
      </Button>
      <Button
        onClick={() => {
          console.log(prompt);
          postPrompt();
        }}
      >
        Chat...
      </Button>
      <Button
        onClick={() => {
          setResult("");
        }}
      >
        Clear Results
      </Button>

      {inputVisible ? (
        <>
          {" "}
          <TextArea
            value={fragCode}
            onChange={(e) => {
              setFragCode(e.target.value);
            }}
            bordered
            rows={40}
            placeholder="Enter your fragment shader code here..."
            style={{
              zIndex: "10",
              height: "40vh",
              background: "rgba(111, 111, 80, 0.5)",
              color: "rgba(255 ,250, 250, 1)",
              fontFamily: "monospace",
              borderRadius: "15px",
              boxShadow: "2px 4px 3px #999",
              fontWeight: "bold",
            }}
          ></TextArea>
          <TextArea
            value={result}
            onChange={(e) => {}}
            rows={50}
            bordered
            placeholder="Results from ChatGPT"
            style={{
              zIndex: "10",
              background: "rgba(111, 111, 80, 0.5)",
              color: "rgba(255 ,250, 250, 1)",
              fontFamily: "monospace",
              borderRadius: "15px",
              boxShadow: "2px 4px 3px #999",
              fontWeight: "bold",
            }}
          />
        </>
      ) : (
        <></>
      )}
      {/* Hidden div containing the fragment shader code */}
      <div id="fragmentShader" style={{ display: "none" }}>
        {fragCode}
      </div>
    </div>
  );
}

export default ShaderComponent;
