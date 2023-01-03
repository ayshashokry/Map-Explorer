import React from "react";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import MapOverviewWidget from "../MapOverviewWidget";
import { Resizable } from "re-resizable";

export default function SmallMap(props) {
  return (
    <Fade left collapse>
      <Resizable
        className="leftToolMenu"
        defaultSize={{
          width: 400,
          height: "300",
        }}
        // minHeight={300}
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
          {" "}
          <FontAwesomeIcon
            icon={faTimes}
            style={{ marginTop: "5px", marginRight: "5px", cursor: "pointer" }}
            onClick={props.closeToolsData}
          />
        </span>
        <MapOverviewWidget mainMap={props.map} />
      </Resizable>
    </Fade>
  );
}
