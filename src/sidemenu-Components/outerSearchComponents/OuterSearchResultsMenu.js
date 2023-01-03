import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Button } from "antd";
import { Tooltip } from "@mui/material";
import googleLocation from "../../assets/images/googleLocation.png";

import {
  faAngleDoubleDown,
  faSearchPlus,
  faExpandArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  clearCanvasLine,
  clearGraphicLayer,
  drawLine,
  getFeatureDomainName,
  highlightFeature,
  navigateToGoogle,
  queryTask,
  zoomToFeatureByObjectId,
} from "../../helper/common_func";
// import { layersSetting } from "../../helper/layers";
import { useTranslation } from "react-i18next";
export default function OuterSearchResultsMenu(props) {
  const { t } = useTranslation("map");
  const [result, setShownData] = useState(null);

  const navigateGeometry = (index) => {
    if (result[index].geometry) {
      navigateToGoogle(
        result[index].geometry.latitude ||
          result[index].geometry.centroid.latitude,
        result[index].geometry.longitude ||
          result[index].geometry.centroid.longitude
      );
    } else {
      zoomToFeatureByObjectId(result[index], props.map, false, (feature) => {
        result[index].geometry = feature.geometry;
        navigateToGoogle(
          result[index].geometry.latitude ||
            result[index].geometry.centroid.latitude,
          result[index].geometry.longitude ||
            result[index].geometry.centroid.longitude
        );
      });
    }
  };

  if (result && result.length && !result.find((x) => !x.geometry)) {
    highlightFeature(result, props.map, {
      layerName: "ZoomGraphicLayer",
      isZoom: true,
      zoomDuration: 1000,
      isDashStyle: true,
    });
  }

  useEffect(() => {
    if (props.outerSearchResult && props.outerSearchResult.length == 1) {
      props.outerOpenResultdetails(props.outerSearchResult[0]);
    }
    clearGraphicLayer("ZoomGraphicLayer", props.map);
    let features = props.outerSearchResult?.list;
    if (features?.length) {
      zoomToAll(features);
    }
    setShownData(props.outerSearchResult);
    return ()=>{
    clearGraphicLayer("ZoomGraphicLayer", props.map);
    clearGraphicLayer('SelectGraphicLayer', props.map);
    setShownData(null);
    }
  }, []);

  const gotoFeature = (feature) => {
    /*if (feature.geometry) {
      highlightFeature(feature, props.map, {
        layerName: "SelectGraphicLayer",
      });
    }*/
  };

  const onMouseMoveOnFeature = (feature, e) => {
    if (feature.geometry) {
      highlightFeature(feature, props.map, {
        layerName: "SelectGraphicLayer",
        isAnimatedLocation: true,
      });
    }
    drawLine({ feature: feature, map: props.map, event: e });
  };

  const clearFeatures = () => {
    props.map.findLayerById("SelectGraphicLayer").removeAll();
    clearCanvasLine();
  };

  const getDisplayField = (attributes) => {
    let layersSetting = props.mainData.layers;
    return attributes[layersSetting[attributes["layerName"]].displayField];
  };

  const searchForMoreData = (e) => {
    let queryObj = { ...result.queryObj };
    queryObj.start = result.list.length;

    queryTask({
      ...queryObj,
      callbackResult: ({ features }) => {
        if (features.length) {
          getFeatureDomainName(features, queryObj.layerdId).then((res) => {
            let mappingRes = res.map((f) => {
              return {
                layerName: queryObj.layerName,
                id: f.attributes["OBJECTID"],
                ...f.attributes,
                geometry: f.geometry,
              };
            });

            setShownData({
              ...result,
              queryObj: queryObj,
              list: result.list.concat(mappingRes),
            });
          });
        }
      },
      callbackError(error) {},
    });
  };

  const openFeatureDetails = (attributes) => {
    props.outerOpenResultdetails(attributes);
    clearCanvasLine();
  };

  const zoomToAll = (feats) => {
    clearGraphicLayer("ZoomGraphicLayer", props.map);
    if (feats.length && feats.find((d) => d.geometry)) {
      let features = feats.filter((d) => {
        if (d.geometry?.rings || d.geometry?.paths || d.geometry?.x) return d;
        else return;
      });
      highlightFeature(features, props.map, {
        layerName: "SelectGraphicLayer",
        isZoom: true,
        zoomDuration: 1000,
      });
    }
  };
  return (
    <div className="generalSearchResult ">
      <div class="resultTitle">
        {result && result.statisticsInfo && (
          <div style={{ textAlign: "right", width: "50%" }}>
            <strong className="px-2">{t("mapTools.resultNum")} </strong>
            {result.statisticsInfo.COUNT}
          </div>
        )}

        {result && result.statisticsInfo && result.statisticsInfo.AREA && (
          <div style={{ textAlign: "left", width: "25%" }}>
            <strong className="px-2"> {t("mapTools.area")}  </strong>
            {(result.statisticsInfo.AREA / 1000).toFixed(2)} {t("km2")}
          </div>
        )}
        {result && result.statisticsInfo && (
          <div style={{ textAlign: "left", width: "25%" }}>
            <Button 
              className="tableHeaderBtn outerSearchZoomAll"
              onClick={() => {
                let features = props.outerSearchResult.list;
                zoomToAll(features);
              }}
            >
              <Tooltip placement="topLeft" title={t("mapTools.zoomToAll")}>
                <FontAwesomeIcon icon={faExpandArrowsAlt} />
              </Tooltip>
            </Button>
          </div>
        )}
      </div>
      {result &&
        (result.list || result).map((attributes, index) => (
          <div className="generalSearchCard" key={index}>
            <Row
              onMouseLeave={clearFeatures.bind(this)}
              onMouseMove={(e) => onMouseMoveOnFeature(attributes, e)}
              onMouseEnter={gotoFeature.bind(this, attributes)}
            >
              <Col span={16} onClick={() => openFeatureDetails(attributes)}>
                <h5>{getDisplayField(attributes)}</h5>
                <p>
                  <span className="munSpan">
                    {attributes.MUNICIPALITY_NAME}
                  </span>
                  -<span className="distSpan">{attributes.DISTRICT_NAME}</span>
                </p>
              </Col>
              <Col span={8} style={{ margin: "auto", textAlign: "center" }}>
                <Tooltip title={t("mapTools.zoomIn")} placement="top">
                  <button
                    className="tooltipButton"
                    onClick={() =>
                      zoomToFeatureByObjectId(
                        attributes,
                        props.map,
                        false,
                        (feature) => {
                          (result.list || result)[index].geometry =
                            feature.geometry;
                        }
                      )
                    }
                  >
                    <FontAwesomeIcon
                      className="zoomIcon"
                      icon={faSearchPlus}
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </button>
                </Tooltip>

                <Tooltip
                  title={t("mapToolsServices.googleMaps2")}
                  placement="top"
                >
                  <button
                    className="tooltipButton"
                    onClick={() => navigateGeometry(index)}
                  >
                    <img
                      style={{ width: "20px" }}
                      src={googleLocation}
                      alt="googleLocation"
                    />
                  </button>
                </Tooltip>
              </Col>
            </Row>
          </div>
        ))}

      {result && result.list && result.list.length >= window.paginationCount && (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={searchForMoreData}
            className="seeMoreBtn px-3 py-2  mt-3"
            size="large"
            htmlType="submit"
          >
            <FontAwesomeIcon
              className="closeIconsIcon"
              icon={faAngleDoubleDown}
              style={{ cursor: "pointer" }}
            />
          </button>
        </div>
      )}
    </div>
  );
}
