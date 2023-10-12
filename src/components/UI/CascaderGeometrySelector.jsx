import { Dropdown, Menu } from "antd";

import { CascaderComponentStyle } from "../../styles";
import { DownOutlined } from "@ant-design/icons";
import { DropdownItemStyle } from "../../styles";
import React from "react";
import { geometryAtom } from "../../App";
import { useAtom } from "jotai";

const CascaderGeometrySelector = ({ onUserGeometryChange }) => {
  const [geometry, setGeometry] = useAtom(geometryAtom);

  const handleClick = (geoKey) => {
    setGeometry(geoKey.key);
  };

  const items = [
    {
      label: "Plane",
      key: "PlaneGeometry",
      style: DropdownItemStyle,
    },
    {
      label: "Box",
      key: "BoxGeometry",
      style: DropdownItemStyle,
    },
    {
      label: "Sphere",
      key: "SphereGeometry",
      style: DropdownItemStyle,
    },
    {
      label: "Torus Knot",
      key: "TorusKnotGeometry",
      style: DropdownItemStyle,
    },
    {
      label: "Text 3D",
      key: "Text3DGeometry",
      style: DropdownItemStyle,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{
          onClick: handleClick,
          items: items,
        }}
        trigger={["click"]}
        overlayClassName="overlay"
        overlayStyle={{}}
      >
        <a
          className="antd-dropdown-link"
          onClick={(e) => e.preventDefault()}
          style={{
            color: "white",
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingRight: "10px",
            paddingLeft: "10px",
            marginLeft: "10px",
            fontWeight: "500",
            fontFamily: "'Chakra Petch', sans-serif",
            backgroundColor: "rgba(40, 40, 240, 0.9)",
          }}
        >
          Geometry
          <DownOutlined />
        </a>
      </Dropdown>
    </>
  );
};

export default CascaderGeometrySelector;
