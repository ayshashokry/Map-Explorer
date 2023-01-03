import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { Form, Input, message } from "antd";
import { Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsAltH,
  faBan,
  faChartLine,
  faCircle,
  faEraser,
  faInfo,
  faSquare,
  faTextWidth,
} from "@fortawesome/free-solid-svg-icons";

import Sketch from "@arcgis/core/widgets/Sketch";
import { drawText } from "../helper/common_func";
import { useTranslation } from "react-i18next";

export default function Painting(props) {
  const { t } = useTranslation("common");

  const componentRef = useRef({});
  const { current: sketch } = componentRef;
  const activeSketchName = useRef({});

  const [formValues, setFormValues] = useState({
    text: "",
  });

  useEffect(() => {
    sketch.current = new Sketch({
      layer: props.map.findLayerById("drawingGraphicLayer"),
      view: props.map.view,
    });

    sketch.current.on("create", (event) => {
      //debugger
      if (
        event.state === "complete" &&
        activeSketchName.current == "pointText"
      ) {
        props.map.findLayerById("drawingGraphicLayer").remove(event.graphic);

        if (
          typeof window.streetName === "string" ||
          window.streetName instanceof String
        ) {
          drawText(
            event.graphic,
            window.streetName,
            props.map,
            "drawingGraphicLayer"
          );
        } else {
          message.warning(t("enterText"));
        }
      }
    });

    return () => {
      // componentwillunmount in functional component.
      cancelDraw();
    };
  }, []);

  const handleChangeInput = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });

    if (e.target.name == "streetName") {
      window.streetName = e.target.value;
    }
  };

  const drawPolygon = () => {
    activeSketchName.current = "polygon";
    sketch.current.create("polygon");
  };

  const drawPolygonFreeHand = () => {
    activeSketchName.current = "polygon";
    sketch.current.create("polygon", { mode: "freehand" });
  };

  const drawPolyLineFreeHand = () => {
    activeSketchName.current = "polyline";
    sketch.current.create("polyline", { mode: "freehand" });
  };

  const drawPolyLine = () => {
    activeSketchName.current = "polyline";
    sketch.current.create("polyline");
  };

  const drawRectangle = () => {
    activeSketchName.current = "rectangle";
    sketch.current.create("rectangle");
  };

  const drawCircle = () => {
    activeSketchName.current = "circle";
    sketch.current.create("circle");
  };

  const drawPoint = () => {
    activeSketchName.current = "point";
    sketch.current.create("point");
  };

  const cancelDraw = () => {
    sketch.current.cancel();
  };

  const deleteFeature = () => {
    sketch.current.cancel();
  };

  const drawTextHandle = () => {
    sketch.current.create("point");

    activeSketchName.current = "pointText";
  };

  return (
    <div className="coordinates mb-4 mt-2 painting">
      <Container>
        <ul>
          <Tooltip placement="top" title={t("clickMapDrawPoint")}>
            <li onClick={drawPoint}>
              <FontAwesomeIcon icon={faInfo} className="ml-2" />

              {t("point")}
            </li>
          </Tooltip>

          <Tooltip placement="top" title={t("clickWordText")}>
            <li onClick={drawTextHandle}>
              <FontAwesomeIcon icon={faTextWidth} className="ml-2" />

              {t("text")}
            </li>
          </Tooltip>
          <Form.Item name="streetName">
            <Input
              name="streetName"
              onChange={handleChangeInput}
              value={formValues.streetName}
              placeholder={t("enterText2")}
            />
          </Form.Item>

          <Tooltip placement="top" title={t("clickMapSolidLines")}>
            <li onClick={drawPolyLine}>
              <FontAwesomeIcon icon={faArrowsAltH} className="ml-2" />
             {t('solidLines')}
            </li>
          </Tooltip>
          <Tooltip placement="top" title={t("clickDrawPoly")}>
            <li onClick={drawPolyLineFreeHand}>
              <FontAwesomeIcon icon={faChartLine} className="ml-2" />
{t('disConnectLines')}            </li>
          </Tooltip>

          <Tooltip placement="top" title={t("clickMapRec")}>
            <li onClick={drawRectangle}>
              <FontAwesomeIcon icon={faSquare} className="ml-2" />
              {t("rectangle")}
            </li>
          </Tooltip>
          <Tooltip placement="top" title={t("clickMapCirc")}>
            <li onClick={drawCircle}>
              <FontAwesomeIcon icon={faCircle} className="ml-2" />

              {t("circle")}
            </li>
          </Tooltip>

          <Tooltip placement="top" title={t("clickDrawPoly")}>
            <li onClick={drawPolygon}>
              <FontAwesomeIcon icon={faSquare} className="ml-2" />
              {t("polygon")}
            </li>
          </Tooltip>
          <Tooltip placement="top" title={t("clickMapDrag")}>
            <li onClick={drawPolygonFreeHand}>
              <FontAwesomeIcon icon={faSquare} className="ml-2" />
              {t("freePolyg")}
            </li>
          </Tooltip>
          <Tooltip
            placement="top"
            title={t("clickDrawToDelete")}
            // {t("enteronElementToDelete")}
          >
            <li onClick={deleteFeature}>
              <FontAwesomeIcon icon={faEraser} className="ml-2" />
              {t("deletePaintElemnt")}
            </li>
          </Tooltip>
          <Tooltip placement="top" title={t("clickToStopPaint")}>
            <li onClick={cancelDraw}>
              <FontAwesomeIcon icon={faBan} className="ml-2" />
              {t("stopPaint")}
            </li>
          </Tooltip>
        </ul>
      </Container>
    </div>
  );
}
