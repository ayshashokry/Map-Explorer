import React from "react";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TocComponent from "./TocComponent";
export default function LayersMenu(props) {
  return (
    <Fade left collapse>
      <div className="toolsMenu inquiryTool layersMenu">
      <span
          style={{
            width: "100%",
            float: "left",
            textAlign: "left",
            marginLeft: "5px",
          }}
        >  <FontAwesomeIcon
          icon={faTimes}
          style={{ marginTop: "5px", marginRight: "5px", cursor: "pointer" }}
          onClick={props.closeToolsData}
        /></span>
        <TocComponent 
              languageState={props.languageState}

          mainData={props.mainData}
        map={props.map} />
      </div>
    </Fade>
  );
}
