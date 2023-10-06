import React from "react";
import { Menu, Dropdown } from "antd";
import { useAtom } from "jotai";
import { DownOutlined } from "@ant-design/icons";
import { CascaderComponentStyle } from "./styles";
import { geometryAtom } from "./App";

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
                overlayStyle={{
                    // color: "red",
                    // backgroundColor: "blue",
                }}
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

const DropdownItemStyle = {
    fontFamily: "'Chakra Petch', sans-serif",
    backgroundColor: "rgba(59, 57, 160)",
    color: "#def",
};

export default CascaderGeometrySelector;
