import React, { useState } from "react";
import { Input, Space, Button } from "antd";
import { useAtom, useAtomValue } from "jotai";
import { promptAtom, loadingAtom, cleanPromptAtom} from "../../App";

function PromptComponent(props) {
    const [prompt, setPrompt] = useAtom(promptAtom);
    const [loading, setLoading] = useAtom(loadingAtom);

    return (
        <div>
            {/* Textarea for entering the fragment shader code */}
            <Space.Compact
                style={{
                    width: "100%",
                }}
            >
                <Input
                    className="prompt-input"
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                    }}
                    onPressEnter={() => {
                        setLoading(true);
                        props
                            .generateShader()
                            .then((streamed) => props.validator(streamed));
                    }}
                    bordered={false}
                    placeholder="Prompt..."
                    style={promptInputStyle}
                />
                <Button
                    loading={loading}
                    type="primary"
                    style={promptButtonStyles}
                    onClick={() => {
                        if (!loading) {
                            setLoading(true);
                        }
                        props
                            .generateShader()
                            .then((streamed) => props.validator(streamed));
                    }}
                >
                    Generate
                </Button>
            </Space.Compact>
            <div id="prompt" style={{ display: "none" }}>
                {prompt}
            </div>
        </div>
    );
}

const promptButtonStyles = {
    marginTop: "0.4rem",
    fontWeight: "500",
    fontFamily: "'Chakra Petch', sans-serif",
    borderRadius: "0px",
    backgroundColor: "rgba(40, 40, 240, 1)",
};

const promptInputStyle = {
    backgroundColor: "rgba(100, 100, 100, 0.3)",
    marginTop: "0.4rem",
    fontWeight: "500",
    fontFamily: "'Montserrat', sans-serif",
    borderRadius: "0px",
    boxShadow: "-1em 0 .4em rgb(0, 64, 0), -1em 0 .4em rgb(0, 0, 255)",
};

export default PromptComponent;
