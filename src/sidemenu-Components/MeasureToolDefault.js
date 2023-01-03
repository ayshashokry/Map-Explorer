import React, { useEffect, useState } from "react";
import Measurement from "@arcgis/core/widgets/Measurement";

export default function MeasureToolDefault(props) {

  useEffect(() => {
    let measurmentTool = new Measurement({
      view: props.map.view,
      activeTool: "area",
      container: document.getElementById("measurmentTool"),
    });
  },[]);

  return (
    <div id="measurmentTool" style={{'textAlign':'right'}}></div>
  );
}
