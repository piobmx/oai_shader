import { Button, Dropdown, Input, Popover, Space } from "antd";
import { loadingAtom, promptAtom } from "../../atoms/shaderAtoms";

import { DropdownItemStyle } from "../../styles";
import React from "react";
import { RightSquareOutlined } from "@ant-design/icons";
import { useAtom } from "jotai";

const promptTipsItems = [
  {
    label: "Simple Noise",
    key: "Simple Noise",
    style: DropdownItemStyle,
  },
  {
    label: "A sine wave",
    key: "A sine wave",
    style: DropdownItemStyle,
  },
  {
    label: "A circular pattern",
    key: "A circular pattern",
    style: DropdownItemStyle,
  },
  {
    label: "Create a fractal",
    key: "Fractal",
    style: DropdownItemStyle,
  },
  {
    label: "Surprise me",
    key: "Surprise me",
    style: DropdownItemStyle,
  },
];

function PromptComponent(props) {
  const [prompt, setPrompt] = useAtom(promptAtom);
  const [loading, setLoading] = useAtom(loadingAtom);

  const handleClick = (promptItem) => {
    setPrompt(promptItem.key);
  };

  return (
    <div>
      <Space.Compact
        style={{
          width: "100%",
        }}
      >
        <Input
          className="prompt-input"
          value={prompt}
          prefix={
            <Dropdown
              menu={{
                items: promptTipsItems,
                onClick: handleClick,
              }}
              trigger={["hover"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>Tip?</Space>
              </a>
            </Dropdown>
          }
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
          <RightSquareOutlined />
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
  fontWeight: "bold",
  //   fontFamily: "'', sans-serif",
  borderRadius: "0px",
  boxShadow: "-1em 0 .4em rgb(0, 64, 0), -1em 0 .4em rgb(0, 0, 255)",
};

export default PromptComponent;
