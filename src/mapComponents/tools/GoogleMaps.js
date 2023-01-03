import React, { Component, useEffect, useState } from "react";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import * as watchUtils from "@arcgis/core/core/watchUtils";
import { Resizable } from "re-resizable";

class GoogleMaps extends Component {
  state = {
    loc:
      this.props.map.view.extent.center.latitude +
      "," +
      this.props.map.view.extent.center.longitude,
    zoom: this.props.map.view.zoom,
  };

  componentDidMount() {
    watchUtils.whenTrue(this.props.map.view, "ready", () => {
      watchUtils.whenOnce(this.props.map.view, "extent", () => {
        watchUtils.when(this.props.map.view, "stationary", (evt) => {
          if (evt) {
            let point = this.props.map.view.extent.center;
            //latitude:
            //longitude:
            this.setState({
              loc: point.latitude + "," + point.longitude,
              zoom: this.props.map.view.zoom,
            });
          }
        });
      });
    });
  }
  render() {
    return (
      <Fade left collapse>
        <Resizable
          className="leftToolMenu"
          defaultSize={{
            width: 400,
            height: "auto",
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
            <FontAwesomeIcon
              icon={faTimes}
              style={{
                marginTop: "5px",
                marginRight: "5px",
                cursor: "pointer",
              }}
              onClick={this.props.closeToolsData}
            />
          </span>
          <iframe
            src={
              "https://www.google.com/maps/embed/v1/place?q=" +
              this.state.loc +
              "&zoom=" +
              this.state.zoom +
              "&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            }
            style={{ width: "100%", height: "93%", border: "0" }}
            title="mapExplorer"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </Resizable>
        {/* <div className=" inquiryTool">
         
        </div> */}
      </Fade>
    );
  }
}
export default GoogleMaps;
