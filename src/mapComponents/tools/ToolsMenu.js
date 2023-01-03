import React, { useState } from "react";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Resizable } from "re-resizable";
import { useTranslation } from "react-i18next";

export default function ToolsMenu(props) {
  const { t } = useTranslation("map");

  const [tools] = useState([
    {
      id: 1,
      icon: "",
      name: "compareLayers",
      tooltip: "mapToolsServices.compareLayers",
    },
    { id: 2, icon: "", name: "inquiry", tooltip: "mapToolsServices.inquiry" },
    {
      id: 3,
      icon: "",
      name: "googleMaps",
      tooltip: "mapToolsServices.googleMaps",
    },
    { id: 4, icon: "", name: "smallMap", tooltip: "mapToolsServices.smallMap" },
    {
      id: 5,
      icon: "",
      name: "layersMenu",
      tooltip: "mapToolsServices.layersMenu",
    },
  ]);
  return (
    <Fade left collapse>
      <Resizable
        className="leftToolMenu"
        defaultSize={{
          width: 400,
          height: "auto",
        }}
        maxWidth={800}
        maxHeight={600}
        bounds="window"
      >
        <span
          style={{
            width: "100%",
            float: "left",
            textAlign: "left",
            marginLeft: "5px",
          }}
        >
          <FontAwesomeIcon
            icon={faTimes}
            style={{ marginTop: "5px", marginRight: "5px", cursor: "pointer" }}
            onClick={props.closeToolsData}
          />
        </span>
        <ul style={{ height: "90%", overflow: "auto" }}>
          {tools.map((t) => (
            <li id={t.id}>{t.id} </li>
          ))}
        </ul>
      </Resizable>
    </Fade>
  );
}
