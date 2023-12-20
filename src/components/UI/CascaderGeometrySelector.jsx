import { Dropdown, Menu } from "antd";
import { useAtom, useSetAtom } from "jotai";

import { DownOutlined } from "@ant-design/icons";
import { DropdownItemStyle } from "../../styles";
import React from "react";
import { geometryAtom } from "../../atoms/shaderAtoms";

const items = [
  createDropdownItem("Plane", "PlaneGeometry"),
  createDropdownItem("Box", "BoxGeometry"),
  createDropdownItem("Sphere", "SphereGeometry"),
  createDropdownItem("Torus Knot", "TorusKnotGeometry"),
  createDropdownItem("Text 3D", "Text3DGeometry"),
];

function createDropdownItem(label, key) {
  return {
    label,
    key,
    style: DropdownItemStyle,
  };
}

const CascaderGeometrySelector = ({ onUserGeometryChange }) => {
  const setGeometry = useSetAtom(geometryAtom);

  const handleClick = (geoKey) => {
    setGeometry(geoKey.key);
  };

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
