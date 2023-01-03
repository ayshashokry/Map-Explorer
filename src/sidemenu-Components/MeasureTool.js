import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Button } from "antd";
import measure1 from "../assets/images/measure1.png";
import measure2 from "../assets/images/measure2.png";
import measure3 from "../assets/images/measure3.png";
import esriGreen from "../assets/images/esriGreen.png";
import esriCursor from "../assets/images/esriCursor.png";
import { Tooltip } from "@mui/material";
import { Table, Container } from "react-bootstrap";
import Measurement from "@arcgis/core/widgets/Measurement";
import { addPictureSymbol } from "../helper/common_func";
import { useTranslation } from "react-i18next";

export default function MeasureTool(props) {
  const [measureType, setMeasureType] = useState("spaceMeasure");
  const { t } = useTranslation("common");

  const [mousePoint, setMousePoint] = useState(null);
  const [mouseGreenPoint, setMouseGreenPoint] = useState(null);

  const componentRef = useRef({});
  const { current: measurmentTool } = componentRef;

  useEffect(() => {
    measurmentTool.current = new Measurement({
      view: props.map.view,
      activeTool: "area",
      container: document.getElementById("measurmentTool"),
    });

    props.map.view.on("pointer-move", (event) => {
      if (!measurmentTool.current.activeTool) {
        let point = props.map.view.toMap({ x: event.x, y: event.y });
        setMousePoint(point);
      }
    });

    props.map.view.on("click", (event) => {
      if (!measurmentTool.current.activeTool) {
        setMouseGreenPoint(event.mapPoint);

        props.map.findLayerById("identifyGraphicLayer").removeAll();
        addPictureSymbol(
          event.mapPoint,
          esriGreen,
          "identifyGraphicLayer",
          props.map,
          16,
          26
        );
      }
    });
  }, []);

  const distanceMeasure = (e) => {
    props.map.findLayerById("identifyGraphicLayer").removeAll();
    setMeasureType("distanceMeasure");
    measurmentTool.current.activeTool = "distance";
  };
  const spaceMeasure = (e) => {
    props.map.findLayerById("identifyGraphicLayer").removeAll();
    setMeasureType("spaceMeasure");
    measurmentTool.current.activeTool = "area";
  };
  const CoordinateMeasure = (e) => {
    setMeasureType("CoordinateMeasure");
    measurmentTool.current.clear();
  };

  const getFlooredFixed = (v, d) => {
    return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
  };

  return (
    <div>
      <Container fluid className="coordinates mt-2 measurePage">
        <Row justify="center">
          <Col span={8}>
            <Tooltip
              placement="top"
              title={t("areaCalc")}
              className="MuiTooltipStyle"
            >
              <Button
                className="spaceMeasureBtn"
                onClick={spaceMeasure}
                id={measureType === "spaceMeasure" ? "activeSpaceBtn" : ""}
              >
                <img src={measure1} alt="spaceMeasure" />
              </Button>
            </Tooltip>
            <Tooltip placement="top" title={t("measureDisLength")}>
              <Button
                className="distanceMeasureBtn"
                onClick={distanceMeasure}
                id={
                  measureType === "distanceMeasure" ? "activeDistanceBtn" : ""
                }
              >
                <img src={measure2} alt="CoordinateMeasure" />
              </Button>
            </Tooltip>
            <Tooltip placement="top" title={t("locationCoord")}>
              <Button
                className="CoordinateMeasureBtn"
                onClick={CoordinateMeasure}
                id={measureType === "CoordinateMeasure" ? "activeCooBtn" : ""}
              >
                <img src={measure3} alt="CoordinateMeasure" />
              </Button>
            </Tooltip>
          </Col>
        </Row>

        <div
          id="measurmentTool"
          style={
            measureType != "CoordinateMeasure"
              ? { display: "block", textAlign: "right" }
              : { display: "none", textAlign: "right" }
          }
        ></div>

        {measureType === "CoordinateMeasure" && (
          <div style={{ margin: "10px" }}>
            <Table className="table table-bordered">
              <tbody>
                <tr>
                  <td></td>
                  <td style={{ textAlign: "center" }}>
                    <span>{t("longitude")}</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span>{t("Latitude")}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img src={esriCursor} />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span>
                      {mousePoint
                        ? getFlooredFixed(mousePoint.longitude, 6)
                        : "----"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span>
                      {mousePoint
                        ? getFlooredFixed(mousePoint.latitude, 6)
                        : "----"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img src={esriGreen} />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span>
                      {mouseGreenPoint
                        ? getFlooredFixed(mouseGreenPoint.longitude, 6)
                        : "----"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span>
                      {mouseGreenPoint
                        ? getFlooredFixed(mouseGreenPoint.latitude, 6)
                        : "----"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </Table>
            {mouseGreenPoint && (
              <Table>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      <span>{t("x")}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span>{t("y")}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      <span>
                        {mouseGreenPoint
                          ? getFlooredFixed(mouseGreenPoint.x, 6)
                          : "----"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span>
                        {mouseGreenPoint
                          ? getFlooredFixed(mouseGreenPoint.y, 6)
                          : "----"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}

            <label
              style={{
                whiteSpace: "normal",
                textAlign: "right",
                fontWeight: "bold",
              }}
            >{t('clickMapXY')}
            </label>
          </div>
        )}
      </Container>
    </div>
  );
}
