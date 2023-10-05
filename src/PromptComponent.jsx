import React, { useState } from "react";
import { Input } from "antd";
import { useAtom } from "jotai";
import { promptAtom, loadingAtom } from "./App";

function PromptComponent(props) {
    const [prompt, setPrompt] = useAtom(promptAtom);
    const [loading, setLoading] = useAtom(loadingAtom);

    return (
        <div>
            {/* Textarea for entering the fragment shader code */}
            <Input
                className="prompt-input"
                value={prompt}
                onChange={(e) => {
                    setPrompt(e.target.value);
                }}
                onPressEnter={() => {
                    setLoading(true);
                    props
                        .getShader()
                        .then((streamed) => props.validator(streamed));
                }}
                bordered={false}
                placeholder="Prompt..."
                style={promptInputStyle}
            />

            <div id="prompt" style={{ display: "none" }}>
                {prompt}
            </div>
        </div>
    );
}

const promptInputStyle = {
    backgroundColor: "rgba(100, 100, 100, 0.3)",
    marginTop: "0.4rem",
    fontWeight: "500",
    fontFamily: "'Montserrat', sans-serif",
    borderRadius: "0px",
    boxShadow: "-1em 0 .4em rgb(0, 64, 0), -1em 0 .4em rgb(0, 0, 255)",
};

export default PromptComponent;
