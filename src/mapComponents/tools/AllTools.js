import React from "react";
import GoogleMaps from "./GoogleMaps";
import InquiryTool from "./InquiryTool";
import LayersMenu from "./LayersMenu";
import SmallMap from "./SmallMap";
import Traffic from "./Traffic";
import ToolsMenu from "./ToolsMenu";
// import TocComponent from "./TocComponent/index"

export default function AllTools(props) {
  return (
    <div className="allToolsPage">
      {props.activeTool === "menu" ? (
        <ToolsMenu
          activeTool={props.activeTool}
          closeToolsData={props.closeToolsData}
          openToolsData={props.openToolsData}
          openToolData={props.openToolData}
        />
      ) : props.activeTool === "inquiry" ? (
        props.map && <InquiryTool
          map={props.map}
          mainData={props.mainData}
          languageState={props.languageState}
          setPopupInfo={props.setPopupInfo}
          popupInfo={props.popupInfo}
          activeTool={props.activeTool}
          closeToolsData={props.closeToolsData}
          openToolsData={props.openToolsData}
          openToolData={props.openToolData}
        />
      ) : props.activeTool === "smallMap" ? (
        <SmallMap
          map={props.map}
          activeTool={props.activeTool}
          closeToolsData={props.closeToolsData}
          openToolsData={props.openToolsData}
          openToolData={props.openToolData}
        />
      ) : props.activeTool === "layersMenu" ? (
        <LayersMenu
        languageState={props.languageState}

        mainData={props.mainData}
          map={props.map}
          activeTool={props.activeTool}
          closeToolsData={props.closeToolsData}
          openToolsData={props.openToolsData}
          openToolData={props.openToolData}
        />
      ) : props.activeTool === "googleMaps" ? (
        <GoogleMaps
          map={props.map}
          activeTool={props.activeTool}
          closeToolsData={props.closeToolsData}
          openToolsData={props.openToolsData}
          openToolData={props.openToolData}
        />
      ) : props.activeTool === "traffic" ? (
        <Traffic
          map={props.map}
          activeTool={props.activeTool}
          closeToolsData={props.closeToolsData}
          openToolsData={props.openToolsData}
          openToolData={props.openToolData}
        />
      ) : null}
    </div>
  );
}
