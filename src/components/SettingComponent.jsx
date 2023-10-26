import { Button, Popover, Space } from "antd";

import React from "react";
import SettingContent from "./SettingContents";
import { buttonStyles } from "../styles";

const SettingComponent = () => {
  return (
    <>
      <Space wrap style={cornerStyle} split="|">
        <Popover
          content={<SettingContent />}
          className="setting-popover"
          id="setting-popover"
          title={"Options"}
          trigger={["click"]}
        >
          <Button type="primary" className="settingButton" style={buttonStyles}>
            More options
          </Button>
        </Popover>
      </Space>
    </>
  );
};

const cornerStyle = {
  position: "absolute",
  zIndex: "40",
  // right: "0",
  // top: "0rem",
  left: "0",
  bottom: "0rem",
};

const buttonStyle = {
  background: "rgba(232, 232, 232, 1)",
  border: "none",
  display: "block",
  fontFamily: "'Chakra Petch', sans-serif",
  fontWeight: "bold",
};

export default SettingComponent;
