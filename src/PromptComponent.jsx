import React, { useState } from "react";
import { Input } from "antd";
import { useAtom } from "jotai";
import { promptAtom } from "./App";

const { TextArea } = Input;

function PromptComponent() {
  const [prompt, setPrompt] = useAtom(promptAtom);

  return (
    <div>
      {/* Textarea for entering the fragment shader code */}
      <TextArea
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
        autoSize={{ minRows: 1, maxRows: 2 }}
        bordered
        placeholder="Prompt..."
        style={{
          fontFamily: "helvetica",
          width: "100%",
          background: "rgba(111, 111, 111, 0.4)",
          color: "#ffeeee",
          fontWeight: "bold",
        }}
      ></TextArea>

      {/* Hidden div containing the fragment shader code */}
      <div id="prompt" style={{ display: "none" }}>
        {prompt}
      </div>
    </div>
  );
}

export default PromptComponent;
