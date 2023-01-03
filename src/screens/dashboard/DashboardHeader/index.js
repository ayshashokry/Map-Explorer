import React, { useState, useEffect } from "react";
//import Style
//import Packages
import { Navbar, Container } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { clearGraphics, getLayerId, highlightFeature, queryTask } from "../../../helper/common_func";
import { notificationMessage } from "../../../helper/utilsFunc";
import HijriCalenderComp from "./CalenderComp";
import SelectComp from "./SelectComp";

export default function DashHeader(props) {
  const { t, i18n } = useTranslation("dashboard");
  const [timeContexts] = useState([
    {
      name: t("yearly"),
      type: "yearly",
    },
    {
      name: t("monthly"),
      type: "monthly",
    },
    {
      name: t("daily"),
      type: "daily",
    },
  ]);

  const [boundaryTypes] = useState([
    {
      name: t("mainMunicipalities"),
      value: "MUNICIPALITY_NAME",
    },
    {
      name: t("secMunicipalities"),
      value: "SUB_MUNICIPALITY_NAME",
    },
    {
      name: t("plans"),
      value: "PLAN_NO",
    },
    {
      name: t("districts"),
      value: "DISTRICT_NAME",
    },
  ]);

  const handleSelect = (name) => (value, e) => {
    let { queryData, setQueryData, map } = props;
    if (name === "layers") {

      // setQueryData({
      //   ...queryData,
      //   selectedLayer: e?.value,
      // });
      clearGraphics(["ThematicGraphicLayer", "highlightGraphicLayer"], map);
      props.handleLayerChange(e?.value)
    } else if (name === "adminBoundary") {
      props.handleAdminBoundChange(e?.value)
      //CLEAR HEAT MAP 
      clearGraphics(["ThematicGraphicLayer", "highlightGraphicLayer"], map);
      // setQueryData({ ...queryData, selectedBoundaryType: {
      //  ...queryData.selectedBoundaryType,
      //  value: e?.value
      // } });
    } else if (name === "subBoundary") {
      clearGraphics(["highlightGraphicLayer"], props.map)
      setQueryData({
        ...queryData,
        selectedBoundaryType: { ...queryData.selectedBoundaryType, selectedBoundary: e?.value },
      });
      if (e?.value && queryData.selectedBoundaryType.value)
        highlightSubAdmin(e.value, queryData.selectedBoundaryType.value)
    } else if (name === "timeContext") {
      // if(e?.value) props.handleClearCalender();
      if (!e?.value) props.handleClearCalender(true);
      else
        setQueryData({
          ...queryData,
          selectedTimeContext: {
            type: e?.value,
            dateData: [],
          },
        });
    } else {
      return null;
    }
  };
  const highlightSubAdmin = (subAdmin, adminType) => {
    let boundLayer;
    switch (adminType) {
      case "MUNICIPALITY_NAME":
        boundLayer = "Municipality_Boundary";
        break;
      case "SUB_MUNICIPALITY_NAME":
        boundLayer = "Sub_Municipality_Boundary";

        break;
      case "PLAN_NO":
        boundLayer = "Plan_Data";

        break;

      default:
        boundLayer = "District_Boundary";
        break;
    }
    let layerID = getLayerId(props.map.__mapInfo, boundLayer)
    let queryParams = {
      url: window.mapUrl + "/" + layerID,
      notShowLoading: false,
      returnGeometry: true,
      outFields: ["OBJECTID"],
      where: adminType === 'PLAN_NO' ? `${adminType} = '${subAdmin}'` : `${adminType} = ${subAdmin}`
    };
    console.log(queryParams);
    queryTask({
      ...queryParams,
      callbackResult: ({ features }) => {

        if (features.length) {
          highlightFeature(features[0], props.map, {
            layerName: "highlightGraphicLayer",
            isHiglightSymbol: true,
            highlighColor: 'rgba(255, 255, 0, 0.4)',
            strokeColor: [240, 255, 89, 1],
            highlightWidth: 4,
            noclear: false,
            isZoom: true
          });
        }
      },
      callbackError: (err) => {
        notificationMessage("حدث خطأ برجاء المحاولة مرة أخرى", 4);

      },
    });
  }
  return (
    <Navbar className="Dashboard-Header" fixed="top">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {props?.queryData?.selectedTimeContext?.type && (
            <ul className="dashHeaderDates">

              <li>
                <HijriCalenderComp
                  type={props?.queryData?.selectedTimeContext?.type}
                  setQueryData={props.setQueryData}
                  queryData={props.queryData}
                  handleClearCalender={props.handleClearCalender}
                />
              </li>
            </ul>
          )}
          {/** timeContext dropdown list */}
          <div className="dashHeaderSelectDiv">
            <SelectComp
              listName="timeContext"
              onChange={handleSelect('timeContext')}
              value={props?.queryData?.selectedTimeContext?.type}
              placeholder={t(`chooseTimeContext`)}
              list={timeContexts || []}
              allowClear={true}
            />
          </div>
          <div
            // className="m-auto"
            style={{
              display: "flex",
              paddingRight: "100px",
              marginLeft: "auto",
            }}
          >
            {/**subBoundary dropdown list */}

            {props?.queryData?.selectedBoundaryType?.boundariesArr.length ? (
              <div className="dashHeaderSelectDiv">
                <SelectComp
                  listName="subBoundary"
                  onChange={handleSelect('subBoundary')}
                  value={props?.queryData?.selectedBoundaryType?.selectedBoundary}
                  placeholder={t(
                    `sub_${props?.queryData?.selectedBoundaryType.value}`
                  )}
                  list={props?.queryData?.selectedBoundaryType?.boundariesArr || []}
                  allowClear={true}
                />
              </div>
            ) : null}
            {/**adminBoundary dropdown list */}

            {boundaryTypes?.length ? <div className="dashHeaderSelectDiv">
              <SelectComp
                listName="adminBoundary"
                onChange={handleSelect('adminBoundary')}
                value={props?.queryData?.selectedBoundaryType?.value}
                placeholder={t("adminBoundary")}
                list={boundaryTypes || []}
                allowClear={true}
              />
            </div> : null}
            {/**layers dropdown list */}

            {props.layersNames?.length ? <div className="dashHeaderSelectDiv">
              <SelectComp
                listName="layers"
                onChange={handleSelect('layers')}
                value={props?.queryData?.selectedLayer}
                placeholder={t("chooseLayer")}
                list={props.layersNames || []}
                languageStatus={i18n.language}
              />
            </div> : null}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
