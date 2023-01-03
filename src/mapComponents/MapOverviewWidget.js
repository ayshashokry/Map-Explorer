import React, { Component } from "react";

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";



import * as watchUtils from "@arcgis/core/core/watchUtils";

class MapOverviewWidget extends Component {
  map = null;

  constructor(props) {
    super(props);
  }

  dragElement(elmnt) {
    let self = this;
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      var northLocation = self.map.view.toMap({
        x: elmnt.offsetLeft - pos1,
        y: elmnt.offsetTop - pos2,
      });
      // self.map.view.goTo(northLocation);

      self.props.mainMap.view.goTo(northLocation);
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;

      elmnt.style.top = "35%";
      elmnt.style.left = "45%";
    }
  }

  componentDidMount() {
    this.dragElement(document.getElementById("mapOverviewDragDiv"));
    const graphicLayersIds = [];

    let view;

    this.map = new Map({
      basemap: "satellite",
    });

     ;
    view = new MapView({
      container: "mapOverviewDiv",
      map: this.map,
      constraints: {
        minZoom: 2,
      },
      ui: {
        components: ["attribution"],
      },
      extent: window.fullExtent,
      zoom: this.props.mainMap.view.zoom - 4,
    });

    view.ui._removeComponents(["attribution"]);
    this.map.view = view;
    view.on(
      ["click", "drag", "double-click", "mouse-wheel", "hold"],
      function (event) {
        event.stopPropagation();
      }
    );

    graphicLayersIds.forEach((graphicLayerId) => {
      var graphicLayer = new GraphicsLayer({
        id: graphicLayerId,
      });
      this.map.layers.add(graphicLayer);
    });

    view.ui._removeComponents(["attribution"]);

    watchUtils.whenTrue(this.props.mainMap.view, "ready", () => {
      watchUtils.whenOnce(this.props.mainMap.view, "extent", () => {
        watchUtils.when(this.props.mainMap.view, "stationary", (evt) => {
          if (evt) {
            view.goTo({
              extent: this.props.mainMap.view.extent,
              zoom: this.props.mainMap.view.zoom - 4,
            });
          }
        });
      });
    });
  }

  render() {
    return (
      <div
        style={{
          height: "93%",
        }}
      >
        <div
          id="mapOverviewDiv"
          style={{
            height: "100%",
          }}
        ></div>
        <div id="mapOverviewDragDiv" className="mapOverviewDrag" />
      </div>
    );
  }
}

export default MapOverviewWidget;
