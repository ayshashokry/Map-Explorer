import React, { useEffect, useRef, useState } from "react";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSearchPlus,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Select, Form } from "antd";
import { Table } from "react-bootstrap";
import { DownCircleFilled, ShopFilled } from "@ant-design/icons";
import { Resizable } from "re-resizable";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  addPictureSymbol,
  getFeatureDomainName,
  makeIdentify,
  showLoading,
  getLayerId,
  clearCanvasLine,
  drawLine,
  highlightFeature,
  queryTask,
  IsNotNull,
  clearGraphicLayer,
  zoomToFeatureByObjectId,
  zoomToFeatureDefault,
  navigateToGoogle,
} from "../../helper/common_func";

// import { layersSetting } from "../../helper/layers";
import identifyIcon from "../../assets/images/identify.gif";
import {
  notificationMessage,
  showDataSplittedBySlash,
} from "../../helper/utilsFunc";
import { useCallback } from "react";

let handler = {};

export default function InquiryTool(props) {
  const { t } = useTranslation("common", "layers");
  const [defaultLayers] = useState([
    "Landbase_Parcel",
    "Plan_Data",
    "District_Boundary",
    "Municipality_Boundary",
    "UrbanAreaBoundary",
  ]);
  const [searchLayer, setSearchLayer] = useState(undefined);
  const [identifyResults, setIdentifyResults] = useState(undefined);
  // const [iconsData, setIconData] = useState([]);
  // const [popupInfo,setPopupInfo] = useState();
  const searchLayerRef = useRef(undefined);
  const [depData, setDepData] = useState();

  const groupByKey = (list, key) =>
    list.reduce(
      (hash, obj) => ({
        ...hash,
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      }),
      {}
    );

  const handleSelect = (layer) => {
    console.log(layer, searchLayerRef.current);
    setSearchLayer(layer);
    searchLayerRef.current = layer;
    //reset table data
    if(searchLayer!==layer) setDepData(undefined);

    if (["Landbase_Parcel"].includes(layer)) {
      props.setPopupInfo({ ...(props.popupInfo || {}), currentLayer: layer });
    } else if (["Street_Naming"].includes(layer)) {
      props.setPopupInfo({
        ...(props.popupInfo || {}),
        currentLayer: layer,
        isStreet: true,
      });
    } else {
      let popupInfoClone = { ...props.popupInfo };
      if (popupInfoClone.currentLayer) delete popupInfoClone.currentLayer;
      props.setPopupInfo(popupInfoClone);
    }
    highlightFeature(
      identifyResults[layer].map((res) => {
        return res.feature;
      }),
      props.map,
      {
        layerName: "SelectGraphicLayer",
        isZoom: true,
        zoomDuration: 2000,
      }
    );
  };
  const mapIdentifyResultWithDomain = (results) => {
    return new Promise((resolve, reject) => {
      results = groupByKey(results, "layerName");
      let count = Object.keys(results).length;

      Object.keys(results).forEach((layerkey, index) => {
        let layerFeatures = results[layerkey];

        getFeatureDomainName(
          layerFeatures.map((layer) => {
            return layer.feature;
          }),
          layerFeatures[0].layerId,
          false,
          undefined,
          true
        ).then((domainResult) => {
          domainResult.forEach((d, index) => {
            layerFeatures[index].feature = d;
          });

          --count;
          if (count == 0) {
            resolve(results);
          }
        });
      });
    });
  };

  const getIdenitfyLayersId = () => {
    let layersSetting = props.mainData.layers;
    let layers = Object.keys(layersSetting);
    layers = layers.filter((l) => {
      return !layersSetting[l].isHidden;
    });

    return layers.map((layer) => {
      return getLayerId(props.map.__mapInfo, layer);
    });
  };

  const setDataToUI = (data) => {
    setIdentifyResults(data);
    let names = Array.from(
      new Set([
        ...defaultLayers.filter((item) => Object.keys(data).includes(item)),
        ...Object.keys(data),
      ])
    );
    // if (!searchLayerRef.current) {
    setSearchLayer(names[0]);
    searchLayerRef.current = names[0];
    // }
    showLoading(false);
    return searchLayerRef.current;
  };

  useEffect(() => {
    window.DisableActiveTool();

    handler = props.map.view.on("click", (event) => {
      console.log("identify single click", { event }, props.map);
      props.map.view.goTo(event.mapPoint);
      addPictureSymbol(
        event.mapPoint,
        identifyIcon,
        "identifyGraphicLayer",
        props.map
      );

      showLoading(true);
      makeIdentify(
        props.map.view,
        event.mapPoint,
        getIdenitfyLayersId(),
        5
      ).then(({ results }) => {
        if (results.length > 0) {
          mapIdentifyResultWithDomain(results).then((res) => {
            if (res["Landbase_Parcel"]) {
              let layerdId = getLayerId(
                props.map.__mapInfo,
                "Tbl_SHOP_LIC_MATCHED"
              );
              let query = res["Landbase_Parcel"].map((f) => {
                return (
                  "PARCEL_SPATIAL_ID = " +
                  f.feature.attributes["PARCEL_SPATIAL_ID"]
                );
              });

              queryTask({
                url: window.mapUrl + "/" + layerdId,
                where: query.join(" or "),
                outFields: ["PARCEL_SPATIAL_ID", "S_SHOP_LIC_NO", ""],
                returnGeometry: false,
                callbackResult: (shops) => {
                  shops.features.forEach((shop) => {
                    let parcel = res["Landbase_Parcel"].find(
                      (f) =>
                        f.feature.attributes["PARCEL_SPATIAL_ID"] ==
                        shop.attributes["PARCEL_SPATIAL_ID"]
                    );
                    if (parcel) parcel.feature.isShopLic = true;
                  });
                  let popupInfo = {
                    mapPoint: event.mapPoint,
                  };
                  let currentLayer = setDataToUI(res);

                  if (
                    res["Landbase_Parcel"].length === 1 ||
                    res["Street_Naming"]?.length === 1
                  ) {
                    let landAttributes =
                      res["Landbase_Parcel"][0].feature.attributes;
                    console.log(
                      currentLayer,
                      "isStreet",
                      res,
                      res["Street_Naming"]?.length
                    );
                    if (
                      ["Street_Naming", "Landbase_Parcel"].includes(
                        currentLayer
                      )
                    ) {
                      props.setPopupInfo({
                        ...popupInfo,
                        isStreet: res["Street_Naming"]?.length ? true : false,
                        isCommercial:
                          landAttributes["PARCEL_MAIN_LUSE"] === "تجاري",
                        isResidential:
                          landAttributes["PARCEL_MAIN_LUSE"] &&
                          landAttributes["PARCEL_MAIN_LUSE"].includes("سكن")
                            ? true
                            : false,
                        landSpatialID: landAttributes["PARCEL_SPATIAL_ID"],
                        currentLayer,
                      });
                    } else {
                      props.setPopupInfo({
                        ...popupInfo,
                        isStreet: res["Street_Naming"]?.length ? true : false,
                        isCommercial:
                          landAttributes["PARCEL_MAIN_LUSE"] === "تجاري",
                        isResidential:
                          landAttributes["PARCEL_MAIN_LUSE"] &&
                          landAttributes["PARCEL_MAIN_LUSE"].includes("سكن")
                            ? true
                            : false,
                        landSpatialID: landAttributes["PARCEL_SPATIAL_ID"],
                      });
                    }
                  } else {
                    props.setPopupInfo({
                      ...popupInfo,
                      currentLayer,
                    });
                  }
                },
              });
            } else if (res["Street_Naming"]) {
              let currentLayer = setDataToUI(res);
              let popupInfo = {
                ...(props.popupInfo || {}),
                mapPoint: event.mapPoint,
                currentLayer,
                isStreet: true,
                isCommercial: false,
                isResidential: false,
              };
              props.setPopupInfo(popupInfo);
            } else {
              let currentLayer = setDataToUI(res);
              console.log(currentLayer);
            }
          });
        } else {
          showLoading(false);
          setIdentifyResults(null);
        }
      });
    });
    return () => {
      props.setPopupInfo();
      clearGraphicLayer("SelectGraphicLayer", props.map);
    };
  }, []);

  const checkIfEnableHighlight = (feature) => {
    if (feature.geometry.type == "polygon") {
      return (
        props.map.view.extent.xmin < feature.geometry.extent.xmin &&
        props.map.view.extent.xmax > feature.geometry.extent.xmax &&
        props.map.view.extent.ymin < feature.geometry.extent.ymin &&
        props.map.view.extent.ymax > feature.geometry.extent.ymax
      );
    } else {
      return true;
    }
  };

  const onMouseMoveOnFeature = (feature, e) => {
    if (checkIfEnableHighlight(feature)) {
      highlightFeature(feature, props.map, {
        layerName: "SelectGraphicLayer",
        isAnimatedLocation: true,
      });
      drawLine({ feature: feature, map: props.map, event: e });
    }
  };

  const clearFeatures = () => {
    props.map.findLayerById("SelectGraphicLayer").removeAll();
    clearCanvasLine();
  };

  const closeIdentify = () => {
    if (handler) handler.remove();
    props.map.findLayerById("identifyGraphicLayer").removeAll();
    props.closeToolsData();
  };

  const getBuildingLic = (feature) => {
    let layersSetting = props.mainData.layers;
    let layerdId = getLayerId(props.map.__mapInfo, "TBL_Parcel_LIC");
    queryTask({
      url: window.mapUrl + "/" + layerdId,
      where: "PARCEL_SPATIAL_ID = " + feature.attributes["PARCEL_SPATIAL_ID"],
      outFields: layersSetting["TBL_Parcel_LIC"].outFields,
      returnGeometry: false,
      callbackResult: ({ features }) => {
        getFeatureDomainName(features, layerdId).then((res) => {
          feature.buildingLic = { ...res[0].attributes };
          setIdentifyResults({ ...identifyResults });
        });
      },
    });
  };
  const getShopLic = (feature) => {
    let layersSetting = props.mainData.layers;
    let layerdId = getLayerId(props.map.__mapInfo, "Tbl_SHOP_LIC_MATCHED");
    queryTask({
      url: window.mapUrl + "/" + layerdId,
      where: "PARCEL_SPATIAL_ID = " + feature.attributes["PARCEL_SPATIAL_ID"],
      outFields: layersSetting["Tbl_SHOP_LIC_MATCHED"].outFields,
      returnGeometry: false,
      callbackResult: ({ features }) => {
        getFeatureDomainName(features, layerdId).then((res) => {
          feature.shopLic = { ...res[0].attributes };
          setIdentifyResults({ ...identifyResults });
        });
      },
    });
  };

  const handleClickDepBtns = useCallback(
    (index, item, depend) => {
      let layersSetting = props.mainData.layers;
      // if (index != 2 && index != 1) setSelectedTab(index);
      console.log(index, item);
      if (!index) {
        //show the main data
        setDepData(undefined);
      }
      //   //get dependcy
      else if (index) {
        let dependency = depend;
        let layerdId = getLayerId(props.map.__mapInfo, dependency.name);
        let field = "";
        if (
          [
            "LGR_ROYAL",
            "PARCEL_PRIVACY",
            "KROKY_SUBMISSIONS",
            "FARZ_SUBMISSIONS",
            "CONTRACT_UPDATE_SUBMISSIONS",
            "ZAWAYED_SUBMISSIONS",
            "SERVICE_PROJECTS_SUBMISSIONS",
          ].includes(dependency.name)
        ) {
          getDepDataAPIDepend(dependency, item);
        } else {
          if (dependency.filter) {
            field = dependency.filter;
          } else field = layersSetting[dependency.name].filter;

          var where = field + "= '" + item.attributes[field] + "'";

          queryTask({
            url: window.mapUrl + "/" + layerdId,
            outFields: layersSetting[dependency.name].outFields,
            where: where,
            callbackResult: ({ features }) => {
              if (features.length) {
                getFeatureDomainName(features, layerdId).then((res) => {
                  res.forEach((r) => {
                    r.attributes.layerName = dependency.name;
                  });

                  if (dependency.isTable) {
                    console.log(res[0]);
                    setDepData({ data: res[0], dependencyData: dependency });
                  } else {
                    let mappingRes = res.map((f) => {
                      return {
                        layerName: dependency.name,
                        id: f.attributes["OBJECTID"],
                        ...f.attributes,
                      };
                    });
                    setDepData({
                      data: mappingRes,
                      dependencyData: dependency,
                    });
                    console.log(mappingRes);
                  }
                });
              } else {
                setDepData({ data: [], dependencyData: dependency });
              }
            },
          });
        }
      }
    },
    [depData?.dependencyData?.name]
  );
  const getDepDataAPIDepend = (dependencyData, mainLayerData) => {
    showLoading(true);
    let layersSetting = props.mainData.layers;

    let token = props.mainData.user?.token;
    let requestURL = "",
      field = "";
    if (["LGR_ROYAL", "PARCEL_PRIVACY"].includes(dependencyData.name)) {
      if (dependencyData.filter) {
        field = dependencyData.filter;
      } else field = layersSetting[dependencyData.name].filter;
      requestURL = dependencyData.url + mainLayerData.attributes[field];
    } else {
      let parcel_no = mainLayerData.attributes["PARCEL_PLAN_NO"];
      let mun_no = mainLayerData.attributes["MUNICIPALITY_NAME_Code"];
      let plan_no =
        mainLayerData.attributes["PLAN_NO"] &&
        mainLayerData.attributes["PLAN_NO"] !== "Null"
          ? mainLayerData.attributes["PLAN_NO"]
          : "";
      let block_no =
        mainLayerData.attributes["PARCEL_BLOCK_NO"] &&
        mainLayerData.attributes["PARCEL_BLOCK_NO"] !== "Null"
          ? mainLayerData.attributes["PARCEL_BLOCK_NO"]
          : "" || "";
      let subdivision_type =
        mainLayerData.attributes["SUBDIVISION_TYPE_Code"] &&
        mainLayerData.attributes["SUBDIVISION_TYPE_Code"] !== "Null"
          ? mainLayerData.attributes["SUBDIVISION_TYPE_Code"]
          : "" || "";
      let subdivision_Desc =
        mainLayerData.attributes["SUBDIVISION_DESCRIPTION"] &&
        mainLayerData.attributes["SUBDIVISION_DESCRIPTION"] !== "Null"
          ? mainLayerData.attributes["SUBDIVISION_DESCRIPTION"]
          : "" || "";
      requestURL =
        dependencyData.url +
        `?Parcel_no=${parcel_no}&Mun_code=${mun_no}&plan_no=${plan_no}&block_no=${block_no}&subdivision_Desc=${subdivision_Desc}&subdivision_type=${subdivision_type}`;
    }
    axios
      .get(requestURL)
      .then((res) => {
        let data =
          dependencyData.name === "LGR_ROYAL" ? [res.data] : res.data || [];
        if (data.length) {
          data = data.map((item) => {
            return {
              attributes: { ...item },
            };
          });
          let mappingRes = data.map((f) => {
            return {
              layerName: dependencyData.name,
              id: f.attributes["OBJECTID"],
              attributes: { ...f.attributes },
              isExternalFetchedData: true,
            };
          });
          setDepData({ data: mappingRes, dependencyData });
        } else {
          setDepData({ data: [], dependencyData });
        }

        showLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showLoading(false);
        notificationMessage("حدث خطأ أثناء استرجاع البيانات", 5);
      });
  };
  return (
    <>
      {/* {popupInfo? <LandIcons popupInfo={popupInfo} map={props.map} />:null} */}
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
          <p className="galleryHead">
            {!identifyResults ? (
              <span style={{ fontFamily: "NeoSansArabic" }}>
                {t("common:clickOnMap")}
              </span>
            ) : (
              <span></span>
            )}
            <span
              style={{
                width: "100%",
                float: "left",
                textAlign: "left",
                marginLeft: "5px",
              }}
            >
              <FontAwesomeIcon
                className="closeServMenu"
                icon={faTimes}
                style={{
                  marginTop: "5px",
                  marginRight: "5px",
                  cursor: "pointer",
                }}
                onClick={closeIdentify}
              />
            </span>
          </p>
          {identifyResults && (
            <div>
              <Select
                virtual={false}
                suffixIcon={<DownCircleFilled />}
                className="dont-show"
                onChange={handleSelect}
                value={searchLayer}
                placeholder={t("common:chooseLayer")}
                getPopupContainer={(trigger) => trigger.parentNode}
                optionFilterProp="value"
                filterOption={(input, option) =>
                  option.value.indexOf(input) >= 0
                }
              >
                {Array.from(
                  new Set([
                    ...defaultLayers.filter((item) =>
                      Object.keys(identifyResults).includes(item)
                    ),
                    ...Object.keys(identifyResults),
                  ])
                ).map(
                  (s) =>
                    props.mainData.layers[s] && (
                      <Select.Option value={s} id={s}>
                        {props.languageState === "ar"
                          ? props.mainData.layers[s].arabicName
                          : props.mainData.layers[s].englishName}
                      </Select.Option>
                    )
                )}
              </Select>

              <div className="identifyScreen">
                <div>
                  {identifyResults[searchLayer] &&
                    identifyResults[searchLayer].map((item) => {
                      return (
                        <>
                          {/**Put here the buttons of dependencies: just of landbase parcel layer */}
                          {searchLayer === "Landbase_Parcel" ? (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: 'space-around',
                              }}
                            >
                              {[
                                {
                                  id: 1,
                                  icon: faInfo,
                                  tooltip: "landsData",
                                  data: "Info Data",
                                },
                                ...(props.mainData.layers[
                                  "Landbase_Parcel"
                                ].dependecies.filter((dep) => {
                                  if (
                                    dep.showingField !== "OWNER_TYPE" ||
                                    (dep.showingField == "OWNER_TYPE" &&
                                      item.feature?.attributes[
                                        dep.showingField + "_Code"
                                      ] === dep.codeValue)
                                  )
                                    return dep;
                                }) || []),
                              ].map((ic, index) => {
                                if (
                                  ic.showingField === undefined ||
                                  ic.showingField !== "OWNER_TYPE" ||
                                  (ic?.showingField == "OWNER_TYPE" &&
                                    item[ic?.showingField + "_Code"] ===
                                      ic?.codeValue)
                                )
                                  return (
                                    <Tooltip
                                      key={"asd" + index}
                                      title={t(`layers:${ic.tooltip}`)}
                                      placement="top"
                                      className="InqueryTool"
                                    >
                                      <IconButton
                                      style={{
                                        borderRadius: '5px 5px 0 0'
                                      }}
                                        className={
                                          depData?.dependencyData?.name ===
                                            ic.name ||
                                          (!depData && ic.data === "Info Data")
                                            ? "tooltipButton activeBtn"
                                            : "tooltipButton"
                                        }
                                        onClick={() =>
                                          handleClickDepBtns(
                                            index,
                                            item.feature,
                                            ic
                                          )
                                        }
                                      >
                                        {ic.icon ? (
                                          <FontAwesomeIcon
                                            icon={ic.icon}
                                            style={{
                                              cursor: "pointer",
                                              borderRadius: '5px 5px 0 0',
                                              // padding: '4px'
                                            }}
                                          />
                                        ) : (
                                          <img
                                            className={
                                              ic.className == "contzwa2edClass"
                                                ? depData?.dependencyData
                                                    ?.name === ic.name
                                                  ? "updaeContractImgClass activeBtn"
                                                  : "updaeContractImgClass"
                                                : ""
                                            }
                                            src={ic.imgIconSrc}
                                            style={{cursor: "pointer",
                                            // padding: '4px',
                                             borderRadius: '5px 5px 0 0',
                                          }}
                                          />
                                        )}
                                      </IconButton>
                                    </Tooltip>
                                  );
                              })}
                            </div>
                          ) : null}

                          {/********************** */}
                          <div>
                            {!depData ? (
                              <Table
                                striped
                                responsive
                                hover
                                className="identifyTableStyle"
                                onMouseLeave={(e) => clearFeatures(e)}
                                onMouseMove={(e) =>
                                  onMouseMoveOnFeature(item.feature, e)
                                }
                              >
                                {props.mainData.layers[searchLayer].outFields
                                  .filter(
                                    (x) =>
                                      x != "OBJECTID" &&
                                      x.indexOf("SPATIAL_ID") < 0
                                  )
                                  .map((attribute, index) => {
                                    return (
                                      IsNotNull(
                                        item.feature.attributes[attribute]
                                      ) && (
                                        <tr key={index} className="identifyTR">
                                          <td className="infoTableTd">
                                            {t(
                                              `layers:${props.mainData.layers[searchLayer].aliasOutFields[index]}`
                                            )}
                                          </td>
                                          <td
                                            style={{ textAlign: "center" }}
                                            className="infoTableData"
                                          >
                                            {(attribute.indexOf("_AREA") > -1
                                              ? (+item.feature.attributes[
                                                  attribute
                                                ]).toFixed(2)
                                              : item.feature.attributes[
                                                  attribute
                                                ]) || t("common:notAvailable")}
                                          </td>
                                        </tr>
                                      )
                                    );
                                  })}
                              </Table>
                            ) : depData?.data &&
                              !depData?.data?.length &&
                              depData?.data?.attributes &&
                              props.mainData.layers[
                                depData?.data?.attributes.layerName
                              ] &&
                              !depData?.data?.attributes
                                .isExternalFetchedData ? (
                              <Table
                                striped
                                responsive
                                hover
                                className="mt-2 outerSearchDetailTrStyle"
                              >
                                {props.mainData.layers[
                                  depData?.data.attributes.layerName
                                ].outFields
                                  .filter(
                                    (x) =>
                                      x != "OBJECTID" &&
                                      x.indexOf("SPATIAL_ID") < 0
                                  )
                                  .map((attribute, index) => {
                                    return (
                                      <tr key={index}>
                                        <td className="infoTableTd">
                                          {t(
                                            `layers:${
                                              props.mainData.layers[
                                                depData?.data.attributes
                                                  .layerName
                                              ].aliasOutFields[index]
                                            }`
                                          )}
                                        </td>
                                        <td
                                          className="infoTableData"
                                          style={{ textAlign: "center" }}
                                        >
                                          {(attribute.indexOf("_AREA") > -1
                                            ? (+depData?.data.attributes[
                                                attribute
                                              ]).toFixed(2)
                                            : showDataSplittedBySlash(
                                                depData?.data.attributes[
                                                  attribute
                                                ]
                                              )) || t("common:notAvailable")}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </Table>
                            ) : depData?.data && depData?.data?.length ? (
                              depData?.data?.map((item) => (
                                <Table
                                  striped
                                  responsive
                                  hover
                                  className="mt-2 outerSearchDetailTrStyle"
                                >
                                  {props.mainData.layers[
                                    item.layerName
                                  ].outFields
                                    .filter((x) => x.name !== "id")
                                    .map((attribute, index) => {
                                      let token = props.mainData.user?.token;
                                      let dependency = depData?.dependencyData;

                                      return (
                                        <tr key={index}>
                                          <td className="infoTableTd">
                                            {t(`layers:${attribute.alias}`)}
                                          </td>
                                          <td
                                            className="infoTableData"
                                            style={{ textAlign: "center" }}
                                          >
                                            {attribute.isAnchor &&
                                            attribute.name === "request_no" &&
                                            item.attributes[attribute.name] ? (
                                              <a
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                href={
                                                  dependency.workflowUrl +
                                                  item.attributes["id"] +
                                                  `?tk=${token}`
                                                }
                                              >
                                                {showDataSplittedBySlash(
                                                  item.attributes[
                                                    attribute.name
                                                  ]
                                                )}
                                              </a>
                                            ) : (
                                              showDataSplittedBySlash(
                                                item.attributes[attribute.name]
                                              ) || t("common:notAvailable")
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </Table>
                              ))
                            ) : depData?.data && depData?.data.length == 0 ? (
                              <p className="noDataStyle">
                                {" "}
                                {t("common:notAvailableData")}
                              </p>
                            ) : (
                              <></>
                            )}
                            {/* {item.feature.buildingLic && (
                              <div>
                                <label className="identifyBuildTitle">
                                  {t("common:constructionLicense")}
                                </label>
                                <Table
                                  striped
                                  responsive
                                  hover
                                  className="identifyTableStyle"
                                  onMouseLeave={(e) => clearFeatures(e)}
                                  onMouseMove={(e) =>
                                    onMouseMoveOnFeature(item.feature, e)
                                  }
                                >
                                  {props.mainData.layers[
                                    "TBL_Parcel_LIC"
                                  ].outFields
                                    .filter(
                                      (x) =>
                                        x != "OBJECTID" &&
                                        x.indexOf("SPATIAL_ID") < 0
                                    )
                                    .map((attribute, i) => {
                                      return (
                                        IsNotNull(
                                          item.feature.buildingLic[attribute]
                                        ) && (
                                          <tr key={i} className="identifyTR">
                                            <td className="infoTableTd">


                                              {t(`layers:${props.mainData.layers[
                                                "TBL_Parcel_LIC"
                                              ].aliasOutFields[i]}`)}
                                            </td>
                                            <td
                                              style={{ textAlign: "center" }}
                                              className="infoTableData"
                                            >
                                              {(
                                                item.feature.buildingLic[
                                                attribute
                                                ]
                                              ) || t("common:notAvailable")}
                                            </td>
                                          </tr>
                                        )
                                      );
                                    })}
                                </Table>
                              </div>
                            )}
                            {item.feature.shopLic && (
                              <div>
                                <label className="identifyBuildTitle">
                                  {t("common:storeLicense")}
                                </label>
                                <Table
                                  striped
                                  responsive
                                  hover
                                  className="identifyTableStyle"
                                  onMouseLeave={(e) => clearFeatures(e)}
                                  onMouseMove={(e) =>
                                    onMouseMoveOnFeature(item.feature, e)
                                  }
                                >
                                  {props.mainData.layers[
                                    "Tbl_SHOP_LIC_MATCHED"
                                  ].outFields
                                    .filter(
                                      (x) =>
                                        x != "OBJECTID" &&
                                        x.indexOf("SPATIAL_ID") < 0
                                    )
                                    .map((attribute, i) => {
                                      return (
                                        IsNotNull(
                                          item.feature.shopLic[attribute]
                                        ) && (
                                          <tr key={i} className="identifyTR">
                                            <td className="infoTableTd">

                                              {t(`layers:${props.mainData.layers[
                                                "Tbl_SHOP_LIC_MATCHED"
                                              ].aliasOutFields[i]}`)}

                                            </td>
                                            <td
                                              style={{ textAlign: "center" }}
                                              className="infoTableData"
                                            >
                                              {(
                                                item.feature.shopLic[attribute]
                                              ) || t("common:notAvailable")}
                                            </td>
                                          </tr>
                                        )
                                      );
                                    })}
                                </Table>
                              </div>
                            )}
                            {searchLayer == "Landbase_Parcel" &&
                              IsNotNull(item.feature.attributes.LIC_NO) && (
                                <div style={{ textAlign: "center" }}>
                                  <button
                                    onClick={() => getBuildingLic(item.feature)}
                                    className="SearchBtn"
                                    htmlType="submit"
                                    style={{
                                      width: "40%",
                                      transition: "none !important",
                                    }}
                                    size="large"
                                  >
                                    {t("common:constructionLicense")}
                                  </button>
                                </div>
                              )}
                            {searchLayer == "Landbase_Parcel" &&
                              item.feature.isShopLic && (
                                <div style={{ textAlign: "center" }}>
                                  <button
                                    onClick={() => getShopLic(item.feature)}
                                    className="SearchBtn"
                                    style={{
                                      width: "40%",
                                      transition: "none !important",
                                    }}
                                    size="large"
                                  >
                                    {t("common:storeLicense")}
                                  </button>
                                </div>
                              )} */}
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </Resizable>
      </Fade>
    </>
  );
}
