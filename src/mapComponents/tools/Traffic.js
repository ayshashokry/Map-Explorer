import React from "react";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function Traffic(props) {
  const { t } = useTranslation("map");

  const closeTool = () => {
    props.map.remove(props.map.findLayerById("trafficLayerId"));
    props.closeToolsData();
  };

  return (
    <Fade left collapse>
      <div className="toolsMenu trafficMenu">
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
            onClick={closeTool}
          />
        </span>
        <ul>
          <li>{t("mapToolsServices.slow")}</li> <li className="darkRed"></li>
          <li className="red"></li> <li className="orange"></li>
          <li className="green"></li> <li>{t("mapToolsServices.fast")}</li>
        </ul>
      </div>
    </Fade>
  );
}
